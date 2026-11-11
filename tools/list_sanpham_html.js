const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach(item => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getFiles('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham');
htmlFiles.forEach(f => {
  const rel = path.relative('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham', f).replace(/\\/g, '/');
  console.log(rel);
});

