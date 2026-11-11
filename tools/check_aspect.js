const fs = require('fs');

const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');

console.log('CSS has "aspect-[7/4]":', css.includes('aspect-[7/4]'));
console.log('CSS has "aspect-":', css.includes('aspect-'));

