const fs = require('fs');

const content = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const scriptSrcs = [];
const regex = /<script[^>]+src=["']([^"']+)["']/gi;
let m;
while ((m = regex.exec(content)) !== null) {
  scriptSrcs.push(m[1]);
}
console.log('Script srcs in cam-hung-mau-sac.html:', scriptSrcs);

