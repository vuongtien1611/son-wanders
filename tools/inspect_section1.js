const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/bang-mau.html', 'utf8');

const s1Start = html.indexOf('<section class="bg-bone');
const s2Start = html.indexOf('<section class="border-t border-line bg-cream');
const s1 = html.substring(s1Start, s2Start);
console.log('Section 1 length:', s1.length);
console.log(s1.substring(0, 3000));

