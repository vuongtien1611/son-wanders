const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../website_download');
const ref = fs.readFileSync(path.join(ROOT, 'gioi-thieu.html'), 'utf8').match(/<header[\s\S]*?<\/header>/)[0];
console.log('REF gioi-thieu.html header length:', ref.length);

function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f);
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/<header[\s\S]*?<\/header>/);
  if (!m) continue;
  const h = m[0];
  const hasBadSrcset = h.includes('srcset="./images/') && rel.includes(path.sep);
  const hasDupAttr = h.includes('data-status="active" data-status="active"');
  const hasOld = !h.includes('border-b border-line bg-bone/95');
  const hasLazyLogo = h.includes('loading="lazy"');
  if (hasBadSrcset || hasDupAttr || hasOld || hasLazyLogo) {
    console.log(`${rel}: badSrcset=${hasBadSrcset} dupAttr=${hasDupAttr} nonStdHdr=${hasOld} lazyLogo=${hasLazyLogo}`);
  }
}

