const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');

const m = indexHtml.match(/<header[\s\S]*?<\/header>/i);
if (m) console.log(m[0].substring(0, 1500));

