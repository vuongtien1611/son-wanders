const fs = require('fs');

const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
console.log('Updated Nav:');
console.log(navMatch[0]);

const ctaMatch = html.match(/<a[^>]*>Nhận tư vấn<\/a>/i);
console.log('CTA Button:');
console.log(ctaMatch[0]);

