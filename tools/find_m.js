const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

const mIdx = code.indexOf('m_=');
if (mIdx !== -1) {
  console.log('m_= definition:');
  console.log(code.substring(Math.max(0, mIdx - 50), Math.min(code.length, mIdx + 1200)));
}

