const fs = require('fs');

const cat = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/son-chong-tham/index.html', 'utf8');
const idx = cat.indexOf('xika-bitum-chong-tham-san');
const aEnd = cat.indexOf('</a>', idx);
console.log(cat.substring(idx - 100, aEnd + 4));
