const fs = require('fs');
const path = require('path');

const imgDir = 'giao-dien/website_download/images';
const files = fs.readdirSync(imgDir);

console.log('Total files:', files.length);

// Let's check which images correspond to what in existing index.html
const indexHtml = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const usedImages = [];
const imgTags = indexHtml.matchAll(/src=["']([^"']+)["']/g);
for (const m of imgTags) {
  if (!usedImages.includes(m[1])) {
    usedImages.push(m[1]);
  }
}

console.log('Images currently used in index.html:');
usedImages.forEach(img => console.log(' - ', img));

