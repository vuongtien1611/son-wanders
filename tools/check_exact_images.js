const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = 'giao-dien/audit_base44';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const allImgSrcs = new Set();
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const matches = content.match(/https:\/\/media\.base44\.com\/[^\s\"\'\>]+/g) || [];
  matches.forEach(m => {
    let cleaned = m.split(',')[0].trim();
    if (cleaned.endsWith('.png') || cleaned.endsWith('.jpg') || cleaned.endsWith('.svg') || cleaned.endsWith('.webp')) {
      allImgSrcs.add(cleaned);
    }
  });
});

console.log('Total distinct image URLs in Base44 templates:', allImgSrcs.size);

// Check if any of these are mobile hero images or large banners
const imgList = Array.from(allImgSrcs);
const heroMobile = imgList.filter(u => u.includes('373ede7be'));
console.log('Hero mobile images:', heroMobile);

