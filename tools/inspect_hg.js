const fs = require('fs');

const jsPath = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js';
const js = fs.readFileSync(jsPath, 'utf8');

const idx = js.indexOf('function Hg(');
console.log(js.substring(idx, idx + 800));

