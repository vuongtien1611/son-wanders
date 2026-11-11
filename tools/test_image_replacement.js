const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('giao-dien/website_download/images/base44/manifest.json', 'utf8'));
const rawHome = fs.readFileSync('giao-dien/audit_base44/raw_home.html', 'utf8');

// Build file map
const fileMap = {};
for (const [url, localPath] of Object.entries(manifest)) {
  const m = url.match(/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg))/i);
  if (m) fileMap[m[1]] = localPath;
}

// Find all media.base44.com occurrences in rawHome
const found = rawHome.match(/https:\/\/media\.base44\.com\/images\/public\/[^\s"'>)]+/g) || [];
console.log('Total remote image occurrences in raw_home:', found.length);

const unmapped = [];
found.forEach(u => {
  const m = u.match(/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg))/i);
  if (!m || !fileMap[m[1]]) {
    unmapped.push(u);
  }
});

console.log('Unmapped occurrences:', unmapped.length);
if (unmapped.length > 0) {
  console.log('Sample unmapped:', unmapped.slice(0, 5));
}

