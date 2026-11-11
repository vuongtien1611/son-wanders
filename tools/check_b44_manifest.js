const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('giao-dien/website_download/images/base44/manifest.json', 'utf8'));

// Check images that appear in Base44
console.log('Manifest entries with keywords:');
for (let url in manifest) {
  const item = manifest[url];
  const local = item.localPath || item;
  console.log(local);
}

