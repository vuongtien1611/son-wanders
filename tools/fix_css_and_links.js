const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, 'website_download');
const cssPath = path.join(ROOT_DIR, 'assets', 'index-BDqGYMxC.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('CSS size:', cssContent.length);

function getRelativeAssetPrefix(filePath) {
  const rel = path.relative(ROOT_DIR, path.dirname(filePath));
  if (!rel || rel === '.') return './';
  const depth = rel.split(path.sep).length;
  return '../'.repeat(depth);
}

function processHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const prefix = getRelativeAssetPrefix(filePath);

  // 1. Remove crossorigin="" from css link and script
  html = html.replace(/<link\s+crossorigin(?:="[^"]*")?\s+href="\/assets\/index-BDqGYMxC\.css"\s+rel="stylesheet"\s*\/?>/gi, '');
  html = html.replace(/<link\s+href="\/assets\/index-BDqGYMxC\.css"\s+rel="stylesheet"\s*\/?>/gi, '');
  html = html.replace(/<link\s+rel="stylesheet"\s+href="\/assets\/index-BDqGYMxC\.css"\s*\/?>/gi, '');

  // 2. Fix script tag
  html = html.replace(/src="\/assets\/index-BG3fZPr5\.js"/g, `src="${prefix}assets/index-BG3fZPr5.js"`);
  html = html.replace(/crossorigin=""\s+src=/g, 'src=');
  html = html.replace(/src="\/static\/js\/badge\.js"/g, `src="${prefix}static/js/badge.js"`);
  html = html.replace(/href="\/manifest\.json"/g, `href="${prefix}manifest.json"`);

  // 3. Inject CSS directly into <head> with <style>
  // This guarantees 100% CSS styling even with file:/// protocol
  const styleBlock = `
  <!-- Inlined Tailwind & Website CSS to guarantee full styling offline & via file:/// -->
  <style id="site-main-css">
${cssContent}
  </style>
  <link rel="stylesheet" href="${prefix}assets/index-BDqGYMxC.css">
`;

  // Inject before </head>
  if (!html.includes('id="site-main-css"')) {
    html = html.replace('</head>', `${styleBlock}\n</head>`);
  }

  // 4. Wrap base44 tracking script in try-catch / skip if file:///
  html = html.replace(
    /if \(window\.self === window\.top\) {/g,
    `if (window.self === window.top && window.location.protocol.startsWith('http')) {`
  );

  fs.writeFileSync(filePath, html, 'utf8');
}

function walkDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'images') {
        walkDir(fullPath);
      }
    } else if (item.endsWith('.html')) {
      processHtmlFile(fullPath);
    }
  }
}

walkDir(ROOT_DIR);
console.log('All HTML files have been updated with inlined and relative CSS!');
