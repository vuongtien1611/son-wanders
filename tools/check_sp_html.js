const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/san-pham/index.html', 'utf8');

// Find product cards in san-pham/index.html
const cardMatches = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('Product Headings in san-pham/index.html:');
console.log(cardMatches);

// Find how images or placeholders are rendered in san-pham/index.html
const imgTags = [...html.matchAll(/<img[^>]*>/gi)].map(m => m[0]);
console.log('Total img tags in san-pham/index.html:', imgTags.length);
console.log('Sample img tags:', imgTags.slice(0, 5));

// Check placeholder div / text
console.log('Contains "CHỜ BỔ SUNG" or "Chờ ảnh thật" or similar:');
console.log(html.includes('pending') || html.includes('CHỜ') || html.includes('Chờ'));

