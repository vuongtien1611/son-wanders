const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';

function checkHeader(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('nav-dropdown') || content.includes('Sản phẩm</span>')) {
    return true;
  }
  return false;
}

const matching = [];
function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (item.endsWith('.html')) {
      if (checkHeader(full)) {
        matching.push(path.relative(rootDir, full));
      }
    }
  }
}

walk(rootDir);
console.log('HTML files with navigation dropdown:', matching.length);
console.log(matching.slice(0, 10));

