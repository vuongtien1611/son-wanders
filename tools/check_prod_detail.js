const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/san-pham/diamond-for-interior-in9000/index.html', 'utf8');

// Find where product details are rendered
const heroIdx = html.indexOf('Diamond For Interior');
console.log(html.substring(heroIdx, heroIdx + 1500));

