const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/san-pham/index.html', 'utf8');
const links = html.match(/(src|href)=["'][^"']*(assets|images)[^"']*["']/g) || [];
console.log('Sample links in san-pham/index.html:');
links.slice(0, 10).forEach(l => console.log(' - ' + l));

