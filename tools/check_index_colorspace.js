const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const sIdx = html.indexOf('Màu sắc thay đổi không gian sống');
console.log(html.substring(sIdx - 100, sIdx + 1200));

