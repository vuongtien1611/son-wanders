const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

const uIdx = code.indexOf('u_={');
if (uIdx !== -1) {
  console.log('u_ definition:');
  console.log(code.substring(uIdx, uIdx + 2000));
}

