const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');

const m = indexHtml.match(/aria-label=["']Điều hướng di động["'][\s\S]*?<\/nav>/i);
if (m) {
  console.log('Mobile nav in index.html:\n', m[0].substring(0, 1000));
} else {
  console.log('Mobile nav not found by aria-label');
  const m2 = indexHtml.match(/lg:hidden[\s\S]*?<\/aside>/i) || indexHtml.match(/lg:hidden[\s\S]*?<\/div>/i);
  if (m2) console.log('Mobile block:\n', m2[0].substring(0, 500));
}

