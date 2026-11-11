const fs = require('fs');

const catHtml = fs.readFileSync('giao-dien/website_download/san-pham/son-noi-that/index.html', 'utf8');
const prodHtml = fs.readFileSync('giao-dien/website_download/san-pham/diamond-for-interior-in9000/index.html', 'utf8');

console.log('=== In san-pham/son-noi-that/index.html ===');
const catImgs = [...catHtml.matchAll(/<img[^>]*>/gi)].map(m => m[0]);
console.log('Images in category page:', catImgs);

// Find how diamond is rendered in son-noi-that
const diamondIdx = catHtml.indexOf('diamond-for-interior-in9000');
if (diamondIdx !== -1) {
  console.log('Diamond card markup in son-noi-that:');
  console.log(catHtml.substring(Math.max(0, diamondIdx - 200), diamondIdx + 500));
}

console.log('=== In san-pham/diamond-for-interior-in9000/index.html ===');
const prodImgs = [...prodHtml.matchAll(/<img[^>]*>/gi)].map(m => m[0]);
console.log('Images in product page:', prodImgs);

