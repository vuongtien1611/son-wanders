const fs = require('fs');
const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');
let idx = css.indexOf('edit-badge');
console.log(css.substring(Math.max(0, idx - 100), Math.min(css.length, idx + 150)));

