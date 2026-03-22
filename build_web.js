#!/usr/bin/env node
// Build standalone web deployment from GAS source files
// Outputs to docs/index.html for GitHub Pages

const fs = require('fs');
const path = require('path');

const GAS_DIR = path.join(__dirname, 'gas_app');
const OUT_DIR = path.join(__dirname, 'docs');
const OUT_FILE = path.join(OUT_DIR, 'index.html');

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwiWFvnhP4nEHzHnNXIJoap33t-Es_RAJLWYn3RJwRcKGzQJG5kI3eB-Wk139V0sfhHT6/exec';

// Read source files
const styles = fs.readFileSync(path.join(GAS_DIR, 'Styles.html'), 'utf8');
const appJs = fs.readFileSync(path.join(GAS_DIR, 'App.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(GAS_DIR, 'Index.html'), 'utf8');

// Extract body content from Index.html (between <body> and </body>)
const bodyMatch = indexHtml.match(/<body>([\s\S]*)<\/body>/);
let body = bodyMatch ? bodyMatch[1] : '';

// Remove GAS template tags from body
body = body.replace(/<\?!=\s*include\(['"]App['"]\)\s*\?>/g, '');
body = body.replace(/<\?!=\s*include\(['"]Styles['"]\)\s*\?>/g, '');

// Build the serverCall replacement that uses fetch to GAS API
const serverCallReplacement = `
function serverCall(funcName) {
  var args = Array.prototype.slice.call(arguments, 1);
  var GAS_API = '${GAS_API_URL}';
  return fetch(GAS_API, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ fn: funcName, args: args })
  })
  .then(function(resp) {
    if (!resp.ok) throw new Error('API error: ' + resp.status);
    return resp.json();
  })
  .then(function(data) {
    if (data.error) throw new Error(data.error);
    return data.result;
  });
}
`;

// Replace the serverCall function in App.html
let modifiedAppJs = appJs.replace(
  /function serverCall\(funcName\)\s*\{[\s\S]*?google\.script\.run[\s\S]*?\}\s*\}/,
  serverCallReplacement.trim()
);

// Also remove any google.script references that might remain
modifiedAppJs = modifiedAppJs.replace(/google\.script\.run/g, '/* google.script.run removed for web deploy */');
modifiedAppJs = modifiedAppJs.replace(/google\.script\.host/g, '/* google.script.host removed */');

// Build final HTML
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="mobile-web-app-capable" content="yes">
  <title>MCC Master</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>">
${styles}
</head>
<body>
${body}
${modifiedAppJs}
</body>
</html>`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, html, 'utf8');

const lines = html.split('\n').length;
console.log('Built ' + OUT_FILE + ' (' + lines + ' lines, ' + Math.round(html.length / 1024) + ' KB)');
