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

let count = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (/<link[^>]*rel="stylesheet"[^>]*crossorigin/i.test(content) || /<link[^>]*crossorigin[^>]*rel="stylesheet"/i.test(content)) {
    count++;
    console.log(`Found in: ${file}`);
  }
}
console.log(`Total files with crossorigin stylesheet: ${count}`);

