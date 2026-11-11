const fs = require('fs');

const content = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const idRegex = /id=["']([^"']+)["']/g;
let m;
const ids = [];
while ((m = idRegex.exec(content)) !== null) {
  ids.push(m[1]);
}
console.log('IDs in cam-hung-mau-sac.html:', ids);

