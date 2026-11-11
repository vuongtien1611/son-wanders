const fs = require('fs');

const home = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');

const start = home.indexOf('anti-uv-exterior-ex9000');
console.log(home.substring(start - 200, start + 800));

