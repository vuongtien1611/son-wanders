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
console.log(`Found ${files.length} html files.`);

let fixedCount = 0;
const invalidHeaders = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Check if header contains the bug pattern:
  // "</div>\s*</div>\s*</div>\s*</div>\s*<a[^>]*href=\"[^\"]*du-an"
  const bugPattern = /(<\/div>\s*<\/div>\s*<\/div>\s*)<\/div>(\s*<a[^>]*href="[^"]*du-an)/;
  if (bugPattern.test(content)) {
    fixedCount++;
  }
}

console.log(`Files matching the extra </div> bug: ${fixedCount}`);

