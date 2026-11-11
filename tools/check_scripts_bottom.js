const fs = require('fs');

const p = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/xika-bitum-chong-tham-san/index.html', 'utf8');
const scriptIdx = p.lastIndexOf('<script');
console.log(p.substring(scriptIdx));

