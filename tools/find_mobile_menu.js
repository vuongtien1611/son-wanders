const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

const idx = code.indexOf('Mở menu');
if (idx !== -1) {
  console.log('Mobile menu in JS:');
  console.log(code.substring(Math.max(0, idx - 400), Math.min(code.length, idx + 600)));
}

