const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /<a\s+[^>]*href=["'](\/[a-zA-Z0-9_\-\/]*)["'][^>]*>/gi;
  let match;
  const badLinks = [];
  while ((match = regex.exec(content)) !== null) {
    badLinks.push(match[1]);
  }
  return badLinks;
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  let totalBad = 0;
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (item.endsWith('.html')) {
      const bad = checkFile(full);
      if (bad.length > 0) {
        console.log(path.relative(rootDir, full), 'has', bad.length, 'absolute links:', bad.slice(0, 5));
        totalBad += bad.length;
      }
    }
  }
}

walk(rootDir);

