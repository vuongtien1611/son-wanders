const fs = require('fs');

const jsPath = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js';
const js = fs.readFileSync(jsPath, 'utf8');

const startIdx = js.indexOf('$g=[');
const endIdx = js.indexOf('];', startIdx);
console.log('$g definition substring:');
console.log(js.substring(startIdx, Math.min(endIdx + 2, startIdx + 8000)));
