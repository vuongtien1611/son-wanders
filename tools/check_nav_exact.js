const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');

const navMatch = indexHtml.match(/<nav[\s\S]*?<\/nav>/i);
if (navMatch) console.log(navMatch[0]);

