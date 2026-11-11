const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

const dIdx = code.indexOf(',f_=e=>u_[e]');
if (dIdx !== -1) {
  console.log('Before f_:');
  console.log(code.substring(Math.max(0, dIdx - 1500), dIdx + 100));
}

