const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

let idx = js.indexOf('Qg=');
if (idx !== -1) {
  console.log(js.substring(idx - 50, idx + 400));
} else {
  console.log('Qg= not found');
}

