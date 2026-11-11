const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/bang-mau.html', 'utf8');

const s0End = html.indexOf('<section class="bg-bone');
console.log('From 0 to section 1:\n', html.substring(0, s0End));

