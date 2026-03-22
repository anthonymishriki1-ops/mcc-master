/**
 * Condense 7K Key Topics into ~300 organized concept cards using Claude Sonnet.
 *
 * Reads Dont_Miss sheet via Google Sheets API (clasp token),
 * sends specialty batches to Claude for intelligent grouping,
 * writes results to a new "Key_Topics_Condensed" sheet tab.
 *
 * Usage: node condense_keytopics.js <anthropic-api-key>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SHEET_ID = '1dqlfIfqzRA4pgLa1NocrlT2iyiJuQBN9Tauy1xLVsvo';
const home = process.env.USERPROFILE || process.env.HOME;

// ---- Google Sheets API ----

function getGoogleToken() {
  const clasprc = JSON.parse(fs.readFileSync(path.join(home, '.clasprc.json'), 'utf8'));
  const t = clasprc.tokens.default;
  return new Promise((resolve, reject) => {
    const postData = `client_id=${encodeURIComponent(t.client_id)}&client_secret=${encodeURIComponent(t.client_secret)}&refresh_token=${encodeURIComponent(t.refresh_token)}&grant_type=refresh_token`;
    const req = https.request({ hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => res.statusCode === 200 ? resolve(JSON.parse(body).access_token) : reject(new Error('Token refresh failed: ' + body)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function sheetsGet(accessToken, range) {
  return new Promise((resolve, reject) => {
    const encodedRange = encodeURIComponent(range);
    const req = https.request({
      hostname: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => res.statusCode === 200 ? resolve(JSON.parse(body)) : reject(new Error(`Sheets error (${res.statusCode}): ${body.substring(0, 300)}`)));
    });
    req.on('error', reject);
    req.end();
  });
}

function sheetsAppend(accessToken, range, values) {
  return new Promise((resolve, reject) => {
    const encodedRange = encodeURIComponent(range);
    const payload = JSON.stringify({ values });
    const req = https.request({
      hostname: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => res.statusCode === 200 ? resolve(JSON.parse(body)) : reject(new Error(`Append error (${res.statusCode}): ${body.substring(0, 300)}`)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function sheetsClear(accessToken, range) {
  return new Promise((resolve, reject) => {
    const encodedRange = encodeURIComponent(range);
    const req = https.request({
      hostname: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${SHEET_ID}/values/${encodedRange}:clear`,
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json', 'Content-Length': 2 }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve());
    });
    req.on('error', reject);
    req.write('{}');
    req.end();
  });
}

// Ensure sheet tab exists
function ensureSheet(accessToken, title) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      requests: [{ addSheet: { properties: { title } } }]
    });
    const req = https.request({
      hostname: 'sheets.googleapis.com',
      path: `/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve()); // ignore errors (sheet may already exist)
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ---- Claude API ----

function claudeCall(apiKey, systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const data = JSON.parse(body);
          resolve(data.content[0].text);
        } else if (res.statusCode === 429) {
          // Rate limited, retry after delay
          setTimeout(() => claudeCall(apiKey, systemPrompt, userMessage).then(resolve).catch(reject), 15000);
        } else {
          reject(new Error(`Claude API error (${res.statusCode}): ${body.substring(0, 300)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ---- Main Logic ----

const SYSTEM_PROMPT = `You are a medical education expert condensing study material for the MCCQE Part I exam.

Your task: Take a list of individual "don't miss" bullet points for a medical specialty and intelligently condense them into organized CONCEPT CARDS.

Rules:
1. Group related items into concept cards (e.g., all hyponatremia bullets become one "Hyponatremia" card)
2. Each card should have:
   - A clear TITLE (the concept name)
   - KEY POINTS organized logically (causes | diagnosis | treatment, or similar structure)
   - A PRIORITY tag: "Must Know" (high-frequency exam topics), "Should Know" (common), or "Good to Know" (rare/edge cases)
3. Preserve ALL important medical facts — don't remove content, just organize it
4. Use concise medical language, no fluff
5. Aim for roughly 5-15 concept cards per batch of items
6. Use pipe (|) to separate sub-sections within key points

Output format — return ONLY a JSON array, no markdown:
[
  {
    "title": "Concept Name",
    "points": "Causes: X, Y, Z | Diagnosis: test1, test2 | Treatment: drug1, drug2 | Pearl: key exam fact",
    "priority": "Must Know"
  }
]`;

async function main() {
  const apiKey = process.argv[2];
  if (!apiKey) {
    console.error('Usage: node condense_keytopics.js <anthropic-api-key>');
    process.exit(1);
  }

  console.log('=== Key Topics Condenser ===\n');

  // Step 1: Get Google token and read Dont_Miss sheet
  console.log('Reading Dont_Miss sheet...');
  const googleToken = await getGoogleToken();
  const sheetData = await sheetsGet(googleToken, 'Dont_Miss!A:B');
  const rows = sheetData.values || [];

  if (rows.length < 2) {
    console.error('No data in Dont_Miss sheet');
    process.exit(1);
  }

  // Parse rows (skip header)
  const headers = rows[0];
  const specIdx = headers.indexOf('Specialty');
  const itemIdx = headers.indexOf('Item');

  if (specIdx === -1 || itemIdx === -1) {
    console.error('Could not find Specialty/Item columns. Headers:', headers);
    process.exit(1);
  }

  // Group by specialty
  const specGroups = {};
  for (let i = 1; i < rows.length; i++) {
    const spec = (rows[i][specIdx] || '').trim();
    const item = (rows[i][itemIdx] || '').trim();
    if (!spec || !item) continue;
    if (!specGroups[spec]) specGroups[spec] = [];
    specGroups[spec].push(item);
  }

  const specialties = Object.keys(specGroups).sort();
  const totalItems = Object.values(specGroups).reduce((s, arr) => s + arr.length, 0);
  console.log(`Found ${totalItems} items across ${specialties.length} specialties\n`);

  // Step 2: Process each specialty through Claude
  const allCards = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (let s = 0; s < specialties.length; s++) {
    const spec = specialties[s];
    const items = specGroups[spec];
    console.log(`[${s + 1}/${specialties.length}] ${spec} (${items.length} items)...`);

    // For large specialties, batch into chunks of 200
    const BATCH_SIZE = 200;
    const batches = [];
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      batches.push(items.slice(i, i + BATCH_SIZE));
    }

    for (let b = 0; b < batches.length; b++) {
      const batch = batches[b];
      const userMsg = `Specialty: ${spec}\n\nCondense these ${batch.length} items into organized concept cards:\n\n${batch.map((item, i) => `${i + 1}. ${item}`).join('\n')}`;

      try {
        const response = await claudeCall(apiKey, SYSTEM_PROMPT, userMsg);

        // Parse JSON from response
        let cards;
        try {
          // Try direct parse
          cards = JSON.parse(response);
        } catch {
          // Try extracting JSON from response
          const match = response.match(/\[[\s\S]*\]/);
          if (match) {
            cards = JSON.parse(match[0]);
          } else {
            console.error(`  Failed to parse response for ${spec} batch ${b + 1}`);
            continue;
          }
        }

        cards.forEach(card => {
          allCards.push({
            specialty: spec,
            title: card.title,
            points: card.points,
            priority: card.priority || 'Should Know'
          });
        });

        console.log(`  -> ${cards.length} concept cards`);

        // Small delay between calls
        if (b < batches.length - 1 || s < specialties.length - 1) {
          await new Promise(r => setTimeout(r, 1000));
        }
      } catch (e) {
        console.error(`  ERROR: ${e.message}`);
      }
    }
  }

  console.log(`\nTotal concept cards: ${allCards.length} (from ${totalItems} raw items)`);

  // Step 3: Write to new sheet tab
  console.log('\nWriting to Key_Topics_Condensed sheet...');
  const freshToken = await getGoogleToken();
  await ensureSheet(freshToken, 'Key_Topics_Condensed');
  await new Promise(r => setTimeout(r, 1000));

  // Clear existing data
  try {
    await sheetsClear(freshToken, 'Key_Topics_Condensed!A:D');
  } catch (e) { /* ignore if empty */ }

  // Write header + data
  const sheetRows = [['Specialty', 'Title', 'Points', 'Priority']];
  allCards.forEach(card => {
    sheetRows.push([card.specialty, card.title, card.points, card.priority]);
  });

  // Write in chunks of 500 rows
  for (let i = 0; i < sheetRows.length; i += 500) {
    const chunk = sheetRows.slice(i, i + 500);
    await sheetsAppend(freshToken, 'Key_Topics_Condensed!A:D', chunk);
  }

  console.log(`\nDone! ${allCards.length} concept cards written to Key_Topics_Condensed sheet.`);

  // Save local backup
  fs.writeFileSync('C:/Users/antho/Desktop/MCC/condensed_keytopics.json', JSON.stringify(allCards, null, 2));
  console.log('Local backup saved to condensed_keytopics.json');

  // Stats
  const byPriority = { 'Must Know': 0, 'Should Know': 0, 'Good to Know': 0 };
  allCards.forEach(c => { byPriority[c.priority] = (byPriority[c.priority] || 0) + 1; });
  console.log('\nBreakdown:');
  Object.entries(byPriority).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
}

main().catch(e => { console.error(e); process.exit(1); });
