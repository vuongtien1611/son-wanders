const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const imgs = html.match(/images\/base44\/[^"'\s]+/g) || [];
console.log('Unique base44 images in index.html:');
[...new Set(imgs)].forEach(img => console.log(' - ' + img));

