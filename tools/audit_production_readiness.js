const fs = require('fs');
const path = require('path');

const WEB_ROOT = path.resolve(__dirname, '../website_download');
const TOOLS_ROOT = path.resolve(__dirname);

const PATTERNS = [
  /đang\s+cập\s+nhật/gi,
  /chờ\s+cập\s+nhật/gi,
  /đang\s+hoàn\s+thiện/gi,
  /sắp\s+ra\s+mắt/gi,
  /coming\s+soon/gi,
  /under\s+construction/gi,
  /placeholder/gi,
  /lorem\s+ipsum/gi,
  /chưa\s+công\s+bố/gi,
  /đang\s+(?:được\s+)?xác\s+minh/gi,
  /đang\s+(?:được\s+)?tổng\s+hợp/gi,
  /sẽ\s+được\s+cập\s+nhật/gi,
  /sẽ\s+được\s+bổ\s+sung/gi,
  /sẽ\s+được\s+đăng/gi,
  /sẽ\s+được\s+thay/gi,
  /sẽ\s+được\s+hiển\s+thị/gi,
  /mang\s+tính\s+minh\s+ho[ạa]/gi,
  /hình\s+ảnh\s+minh\s+ho[ạa]/gi,
  /ảnh\s+minh\s+ho[ạa]/gi,
  /hình\s+minh\s+ho[ạa]/gi,
  /kênh\s+đang\s+cập\s+nhật/gi,
  /cập\s+nhật\s+từ\s+tài\s+liệu/gi,
  /my\s*hour/gi,
  /myhouse/gi,
  /0986[\.\s]?217[\.\s]?444/gi,
  /024[\.\s]?6688[\.\s]?7444/gi,
  /tam\s+trinh|ngọc\s+hồi|gelexia/gi,
  /\[cập\s+nhật/gi,
];

function walk(dir, exts) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

console.log('=== SCANNING WEBSITE_DOWNLOAD HTML / JS / JSON ===');
const webFiles = walk(WEB_ROOT, ['.html', '.js', '.json']);
for (const f of webFiles) {
  const rel = path.relative(WEB_ROOT, f);
  const content = fs.readFileSync(f, 'utf8');
  const hits = [];
  for (const rx of PATTERNS) {
    const matches = content.match(rx);
    if (matches) {
      hits.push(`${rx.source} (${matches.length}x: "${matches[0]}")`);
    }
  }
  if (hits.length) {
    console.log(`\n[${rel}]`);
    hits.forEach((h) => console.log('  - ' + h));
  }
}

console.log('\n=== CHECKING TECHNICAL SEO FILES ===');
for (const f of ['sitemap.xml', 'robots.txt', 'manifest.json', 'images/base44/manifest.json']) {
  const full = path.join(WEB_ROOT, f);
  console.log(`  ${f}: ${fs.existsSync(full) ? 'EXISTS' : 'MISSING'}`);
}

