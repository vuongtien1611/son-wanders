const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllHtmlFiles('giao-dien/website_download');

let brokenLinks = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  
  // Extract all href and src
  const matches = content.matchAll(/(?:href|src)=["']([^"']+)["']/g);
  for (const m of matches) {
    const val = m[1];
    if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('#') || val.startsWith('tel:') || val.startsWith('mailto:') || val.startsWith('data:')) {
      continue;
    }
    const cleanPath = val.split('?')[0].split('#')[0];
    const targetPath = path.resolve(dir, cleanPath);
    if (!fs.existsSync(targetPath)) {
      brokenLinks.push({ file, val, targetPath });
    }
  }
}

console.log(`Checked ${files.length} HTML files.`);
console.log(`Broken local references found: ${brokenLinks.length}`);
if (brokenLinks.length > 0) {
  console.log(brokenLinks.slice(0, 10));
}

