const fs = require('fs');

const home = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');

const idx = home.indexOf('san-pham');
console.log('Home san-pham mentions:');
let pos = 0;
while ((pos = home.indexOf('/san-pham/', pos)) !== -1) {
  console.log(home.substring(pos, pos + 100));
  pos += 10;
}

