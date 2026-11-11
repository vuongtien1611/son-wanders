const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../website_download');

function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const groups = { base44: [], colorHeader: [], oldSite: [], noHeader: [] };
for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f);
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/<header[\s\S]*?<\/header>/);
  if (!m) { groups.noHeader.push(rel); continue; }
  const h = m[0];
  if (h.includes('wanders-header')) groups.colorHeader.push(rel);
  else if (h.includes('border-b border-line bg-bone/95')) groups.base44.push(rel);
  else groups.oldSite.push(rel);
}
console.log('=== base44 (matching gioi-thieu.html) [' + groups.base44.length + '] ===');
console.log(groups.base44.join('\n'));
console.log('\n=== colorHeader (bang-mau / cam-hung-mau-sac) [' + groups.colorHeader.length + '] ===');
console.log(groups.colorHeader.join('\n'));
console.log('\n=== oldSite [' + groups.oldSite.length + '] ===');
console.log(groups.oldSite.join('\n'));
console.log('\n=== noHeader [' + groups.noHeader.length + '] ===');
console.log(groups.noHeader.join('\n'));
