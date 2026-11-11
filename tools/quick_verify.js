const fs = require('fs');

const f1 = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const f2 = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');

console.log('f1 contains inlined CSS:', f1.includes('inlined-core-css'));
console.log('f2 contains inlined CSS:', f2.includes('inlined-core-css'));
console.log('f1 contains crossorigin on css:', f1.includes('crossorigin href='));
console.log('f2 contains crossorigin on css:', f2.includes('crossorigin href='));
console.log('f1 has hamburger button:', f1.includes('aria-label="Mở menu"'));
console.log('f2 has hamburger button:', f2.includes('aria-label="Mở menu"'));
console.log('f1 total size:', f1.length);
console.log('f2 total size:', f2.length);

