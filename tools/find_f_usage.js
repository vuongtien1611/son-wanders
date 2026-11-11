const fs = require('fs');

const jsPath = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js';
const js = fs.readFileSync(jsPath, 'utf8');

let idx = 0;
while ((idx = js.indexOf('(0,j.jsx)(F_,', idx)) !== -1) {
  console.log('F_ usage at', idx, ':');
  console.log(js.substring(idx - 100, idx + 200));
  idx += 10;
}

