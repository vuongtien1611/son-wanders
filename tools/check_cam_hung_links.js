const fs = require('fs');

const indexHtml = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');
console.log('cam-hung-mau-sac link in index.html:');
let pos = 0;
while ((pos = indexHtml.indexOf('cam-hung-mau-sac', pos)) !== -1) {
  console.log(indexHtml.substring(pos - 30, pos + 50));
  pos += 16;
}

