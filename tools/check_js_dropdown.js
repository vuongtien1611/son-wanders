const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

let idx = js.indexOf('hasProducts');
while (idx !== -1) {
  console.log('hasProducts at', idx, ':\n', js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 400)));
  idx = js.indexOf('hasProducts', idx + 1);
}

