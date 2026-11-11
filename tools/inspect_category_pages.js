const fs = require('fs');

function inspectPage(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('=== FILE:', filePath);
  // find product links: href="...san-pham/..."
  const regex = /href="([^"]*san-pham\/[^"]*)"/g;
  let m;
  const links = new Set();
  while ((m = regex.exec(content)) !== null) {
    links.add(m[1]);
  }
  console.log('Product links:', Array.from(links));
}

inspectPage('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/index.html');
inspectPage('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/son-chong-tham/index.html');
inspectPage('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/san-pham-khac/index.html');

