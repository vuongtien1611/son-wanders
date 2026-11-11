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

let absoluteLinksFound = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/);
  if (!headerMatch) continue;
  const header = headerMatch[0];
  const hrefs = header.match(/href="\/[^"]*"/g) || [];
  if (hrefs.length > 0) {
    absoluteLinksFound.push({ file, hrefs });
  }
}

console.log("Absolute root links in headers:", absoluteLinksFound.length);
if (absoluteLinksFound.length > 0) {
  console.log(absoluteLinksFound.slice(0, 5));
}

