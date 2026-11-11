const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

const fIdx = code.indexOf('f_=');
if (fIdx !== -1) {
  console.log('f_= definition:');
  console.log(code.substring(Math.max(0, fIdx - 200), Math.min(code.length, fIdx + 1200)));
}

