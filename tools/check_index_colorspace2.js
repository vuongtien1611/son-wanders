const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const sIdx = html.indexOf('Màu sắc thay đổi không gian sống');
const sEnd = html.indexOf('Không gian &amp; Công trình WANDERS');
console.log(html.substring(sIdx, sEnd));

