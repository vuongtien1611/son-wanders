const fs = require('fs');

const html = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');

let idx = html.indexOf('id="selectedColorBox"');
console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 1500)));

