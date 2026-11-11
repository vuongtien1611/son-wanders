const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const headings = html.match(/<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/g) || [];
headings.forEach(h => console.log('H: ' + h.replace(/<[^>]+>/g, '').trim()));

