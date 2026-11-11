const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

let idx = js.indexOf('(0,j.jsxs)(Ms,{children:');
console.log(js.substring(Math.max(0, idx - 250), idx + 100));

