const fs = require('fs');
const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');

console.log('CSS has "w-[600px]":', css.includes('w-[600px]'));
console.log('CSS has "600px":', css.includes('600px'));

