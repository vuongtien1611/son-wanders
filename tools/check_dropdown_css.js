const fs = require('fs');

const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');

let idx = css.indexOf('/* Navigation dropdown styles */');
if (idx !== -1) {
  console.log(css.substring(idx - 50, idx + 400));
} else {
  console.log('Comment not found');
}

