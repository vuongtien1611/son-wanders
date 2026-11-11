const fs = require('fs');

const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');

let idx = css.indexOf('.shell{');
if (idx === -1) idx = css.indexOf('.shell');
console.log(css.substring(idx, idx + 300));

