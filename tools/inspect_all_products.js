const fs = require('fs');

const all = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/index.html', 'utf8');
const idx = all.indexOf('xika-bitum-chong-tham-san');
console.log('Index in san-pham/index.html:', idx);
if (idx !== -1) {
  const aEnd = all.indexOf('</a>', idx);
  console.log(all.substring(idx - 100, aEnd + 4));
}

