const fs = require('fs');

const indexHtml = fs.readFileSync('website_download/index.html', 'utf8');

// Check for "Edit with Base 44" or "Base44"
const matches = [...indexHtml.matchAll(/Edit with/gi)];
console.log('Matches for "Edit with" in index.html:', matches.length);

// Check for badge script or badge container
const badgeScriptMatches = [...indexHtml.matchAll(/badge\.js/gi)];
console.log('Matches for "badge.js":', badgeScriptMatches.length);

// Look around "badge" in indexHtml
let idx = indexHtml.indexOf('badge');
while (idx !== -1) {
  console.log('Context around badge:');
  console.log(indexHtml.substring(Math.max(0, idx - 50), Math.min(indexHtml.length, idx + 100)));
  idx = indexHtml.indexOf('badge', idx + 1);
}

