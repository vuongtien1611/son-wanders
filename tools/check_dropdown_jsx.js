const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

let idx = js.indexOf('hasProducts?(0,j.jsxs)(`div`,{className:`relative flex h-[72px]');
if (idx === -1) idx = js.indexOf('hasProducts');
console.log(js.substring(idx, idx + 1500));

