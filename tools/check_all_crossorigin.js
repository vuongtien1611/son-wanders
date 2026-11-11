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

let crossoriginTags = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/<[^>]+crossorigin[^>]*>/g) || [];
  for (const m of matches) {
    if (!m.includes('fonts.gstatic.com')) {
      crossoriginTags.push({ file, tag: m });
    }
  }
}

console.log("Non-font crossorigin tags:", crossoriginTags.length);
crossoriginTags.forEach(t => console.log(t.file, t.tag));

