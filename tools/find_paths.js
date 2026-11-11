const fs = require('fs');

const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

let idx = -1;
let matches = [];
while ((idx = code.indexOf('path:', idx + 1)) !== -1) {
  matches.push(code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 80)));
}

console.log('Matches for path:');
matches.forEach((m, i) => console.log(`[${i}] ${m}`));
