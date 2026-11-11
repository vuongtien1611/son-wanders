const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/bang-mau.html', 'utf8');

const fIdx = html.indexOf('<footer');
console.log('Footer:\n', html.substring(fIdx, fIdx + 1500));

