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

let fixedSrcsetCount = 0;
let fixedDupAttrCount = 0;
let fixedLazyLogoCount = 0;

for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f);
  let html = fs.readFileSync(f, 'utf8');
  const orig = html;

  // Fix stale srcset="./images/..." in 1-level subdirectories like gioi-thieu/index.html & lien-he/index.html
  const depth = rel.split(path.sep).length - 1;
  if (depth === 1 && !rel.startsWith('tin-tuc') && !rel.startsWith('dang-ky') && !rel.startsWith('nha-phan')) {
    const before = html;
    html = html.replace(/srcset="\.\/images\//g, 'srcset="../images/');
    html = html.replace(/, \.\/images\//g, ', ../images/');
    if (html !== before) fixedSrcsetCount++;
  }

  // Clean duplicate data-status="active" in index.html
  if (html.includes('data-status="active" data-status="active"')) {
    html = html.replace(/data-status="active"\s+data-status="active"/g, 'data-status="active"');
    fixedDupAttrCount++;
  }

  // Ensure header logo never uses loading="lazy"
  const headerMatch = html.match(/<header[\s\S]*?<\/header>/);
  if (headerMatch && headerMatch[0].includes('border-b border-line bg-bone/95') && headerMatch[0].includes('loading="lazy"')) {
    const updatedHeader = headerMatch[0].replace(/<img loading="lazy" /g, '<img ');
    html = html.replace(headerMatch[0], updatedHeader);
    fixedLazyLogoCount++;
  }

  if (html !== orig) {
    fs.writeFileSync(f, html, 'utf8');
  }
}

console.log({ fixedSrcsetCount, fixedDupAttrCount, fixedLazyLogoCount });

