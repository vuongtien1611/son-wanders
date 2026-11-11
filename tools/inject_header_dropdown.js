const fs = require('fs');

const PAGES = [
  { path: 'giao-dien/website_download/index.html', prefix: './' },
  { path: 'giao-dien/website_download/gioi-thieu.html', prefix: './' },
  { path: 'giao-dien/website_download/gioi-thieu/index.html', prefix: '../' },
  { path: 'giao-dien/website_download/san-pham.html', prefix: './' },
  { path: 'giao-dien/website_download/san-pham/index.html', prefix: '../' },
  { path: 'giao-dien/website_download/bang-mau.html', prefix: './' },
  { path: 'giao-dien/website_download/bang-mau/index.html', prefix: '../' },
  { path: 'giao-dien/website_download/cam-hung-mau-sac.html', prefix: './' },
  { path: 'giao-dien/website_download/cam-hung-mau-sac/index.html', prefix: '../' },
  { path: 'giao-dien/website_download/du-an.html', prefix: './' },
  { path: 'giao-dien/website_download/du-an/index.html', prefix: '../' },
  { path: 'giao-dien/website_download/lien-he.html', prefix: './' },
  { path: 'giao-dien/website_download/lien-he/index.html', prefix: '../' }
];

for (const page of PAGES) {
  let html = fs.readFileSync(page.path, 'utf8');
  let changed = false;

  const cssTag = `<link rel="stylesheet" href="${page.prefix}assets/wanders_header_dropdown.css">`;
  if (!html.includes('wanders_header_dropdown.css')) {
    html = html.replace('</head>', `  ${cssTag}\n</head>`);
    changed = true;
  }

  const jsTag = `<script src="${page.prefix}assets/wanders_nav_dropdown.js"></script>`;
  if (!html.includes('wanders_nav_dropdown.js')) {
    html = html.replace('</body>', `  ${jsTag}\n</body>`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(page.path, html, 'utf8');
    console.log('Injected dropdown into:', page.path);
  }
}

