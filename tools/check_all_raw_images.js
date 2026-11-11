const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('giao-dien/website_download/images/base44/manifest.json', 'utf8'));
const fileMap = {};
for (const [url, localPath] of Object.entries(manifest)) {
  const m = url.match(/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg))/i);
  if (m) fileMap[m[1]] = localPath;
}

const files = [
  'header.html',
  'footer.html',
  'raw_home.html',
  'raw_san-pham.html',
  'raw_bang-mau.html',
  'raw_du-an.html',
  'raw_gioi-thieu.html',
  'raw_lien-he.html'
];

files.forEach(f => {
  const p = 'giao-dien/audit_base44/' + f;
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  const found = content.match(/https:\/\/media\.base44\.com\/images\/public\/[^\s"'>)]+/g) || [];
  let unmapped = 0;
  found.forEach(u => {
    const m = u.match(/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg))/i);
    if (!m || !fileMap[m[1]]) unmapped++;
  });
  console.log(`${f}: ${found.length} remote URLs, ${unmapped} unmapped`);
});

