const fs = require('fs');

const content = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');
const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
let match;
const found = [];
while ((match = regex.exec(content)) !== null) {
  const href = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim().substring(0, 40);
  if (href.startsWith('/') || href.includes('gioi-thieu') || href.includes('cam-hung')) {
    found.push({ href, text });
  }
}
console.log('Found', found.length, 'matching links in index.html:');
console.log(JSON.stringify(found.slice(0, 25), null, 2));

