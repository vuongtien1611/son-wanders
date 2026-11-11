const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/bang-mau.html', 'utf8');

const s2Start = html.indexOf('<section class="border-t border-line bg-cream');
const s3Start = html.indexOf('<section class="bg-sand');
const s2 = html.substring(s2Start, s3Start);
console.log(s2);

