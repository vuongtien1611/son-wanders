const fs = require('fs');

const jsPath = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js';
const js = fs.readFileSync(jsPath, 'utf8');

// Find references to .image in product context
let idx = 0;
while ((idx = js.indexOf('.image', idx)) !== -1) {
  console.log('--- .image reference at', idx, '---');
  console.log(js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 200)));
  idx += 6;
  if (idx > 500000) break;
}

