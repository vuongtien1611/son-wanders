const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

// Find menu definition
const idx = code.indexOf('Nhà phân phối');
if (idx !== -1) {
  console.log('Found around Nhà phân phối:');
  console.log(code.substring(Math.max(0, idx - 400), Math.min(code.length, idx + 400)));
}

