/**
 * Upload diagram images to Google Drive using clasp's OAuth token.
 * Reads token from ~/.clasprc.json, uploads to the MCC images folder.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const FOLDER_ID = '1l96pRrZhTWc8duzvxCyHptkDXBEM7a73';
const IMAGES_DIR = 'C:/Users/antho/Desktop/MCC/diagram_images';
const CONCURRENT = 5; // parallel uploads
const home = process.env.USERPROFILE || process.env.HOME;

// Get access token from clasp
function getToken() {
  const clasprc = JSON.parse(fs.readFileSync(path.join(home, '.clasprc.json'), 'utf8'));
  const t = clasprc.tokens.default;
  return {
    accessToken: t.access_token,
    refreshToken: t.refresh_token,
    clientId: t.client_id,
    clientSecret: t.client_secret,
    expiryDate: t.expiry_date
  };
}

// Refresh access token if expired
function refreshAccessToken(token) {
  return new Promise((resolve, reject) => {
    const postData = `client_id=${encodeURIComponent(token.clientId)}&client_secret=${encodeURIComponent(token.clientSecret)}&refresh_token=${encodeURIComponent(token.refreshToken)}&grant_type=refresh_token`;
    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const data = JSON.parse(body);
          resolve(data.access_token);
        } else {
          reject(new Error('Token refresh failed: ' + body));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Upload a single file to Drive
function uploadFile(filePath, fileName, accessToken) {
  return new Promise((resolve, reject) => {
    const fileData = fs.readFileSync(filePath);
    const metadata = JSON.stringify({
      name: fileName,
      parents: [FOLDER_ID]
    });

    const boundary = '---boundary' + Date.now();
    const bodyParts = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
      `--${boundary}\r\nContent-Type: image/png\r\n\r\n`
    ];
    const bodyEnd = `\r\n--${boundary}--`;

    const bodyStart = Buffer.from(bodyParts[0] + bodyParts[1].toString(), 'utf8');
    // Properly construct the multipart body
    const part1 = Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: image/png\r\n\r\n`, 'utf8');
    const part2 = fileData;
    const part3 = Buffer.from(`\r\n--${boundary}--`, 'utf8');
    const fullBody = Buffer.concat([part1, part2, part3]);

    const options = {
      hostname: 'www.googleapis.com',
      path: '/upload/drive/v3/files?uploadType=multipart',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'multipart/related; boundary=' + boundary,
        'Content-Length': fullBody.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Upload failed (${res.statusCode}): ${body.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

// Process uploads with concurrency limit
async function uploadBatch(files, accessToken, concurrent) {
  let completed = 0;
  let failed = 0;
  const total = files.length;
  const startTime = Date.now();

  async function worker(queue) {
    while (queue.length > 0) {
      const file = queue.shift();
      const filePath = path.join(IMAGES_DIR, file);
      try {
        await uploadFile(filePath, file, accessToken);
        completed++;
        if (completed % 25 === 0 || completed === total) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
          const rate = (completed / elapsed * 60).toFixed(0);
          console.log(`  [${completed}/${total}] ${elapsed}s elapsed, ~${rate}/min`);
        }
      } catch (e) {
        failed++;
        console.error(`  FAIL: ${file} - ${e.message.substring(0, 80)}`);
        // Retry once
        try {
          await uploadFile(filePath, file, accessToken);
          completed++;
          failed--;
        } catch (e2) {
          console.error(`  RETRY FAIL: ${file}`);
        }
      }
    }
  }

  const queue = [...files];
  const workers = [];
  for (let i = 0; i < concurrent; i++) {
    workers.push(worker(queue));
  }
  await Promise.all(workers);
  return { completed, failed };
}

async function main() {
  console.log('=== MCC Diagram Uploader ===\n');

  // Get files
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} diagram images (${(files.reduce((s, f) => s + fs.statSync(path.join(IMAGES_DIR, f)).size, 0) / 1024 / 1024).toFixed(1)} MB)\n`);

  // Get and refresh token
  console.log('Refreshing OAuth token...');
  const token = getToken();
  let accessToken;
  try {
    accessToken = await refreshAccessToken(token);
    console.log('Token refreshed OK\n');
  } catch (e) {
    console.error('Could not refresh token. Try running: clasp login');
    process.exit(1);
  }

  // Upload
  console.log(`Uploading ${files.length} files (${CONCURRENT} parallel)...\n`);
  const result = await uploadBatch(files, accessToken, CONCURRENT);

  console.log(`\nDone! Uploaded: ${result.completed}, Failed: ${result.failed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
