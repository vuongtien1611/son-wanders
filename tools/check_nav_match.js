const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');
const camHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');

function extractDropdown(html, name) {
  const m = html.match(/<div class="relative group flex h-\[72px\] items-center nav-dropdown">[\s\S]*?<\/div>\s*<\/div>/);
  if (m) {
    console.log(name, 'matched dropdown length:', m[0].length);
  } else {
    console.log(name, 'NO dropdown match');
  }
}

extractDropdown(indexHtml, 'index.html');
extractDropdown(camHtml, 'cam-hung-mau-sac.html');

