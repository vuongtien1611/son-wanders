const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

const idx = code.indexOf('function hx()');
if (idx !== -1) {
  console.log(code.substring(idx, idx + 1500));
}
