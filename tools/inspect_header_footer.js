const fs = require('fs');

const page = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');

const headerStart = page.indexOf('<header');
const headerEnd = page.indexOf('</header>') + 9;
console.log('Header length:', headerEnd - headerStart);

const footerStart = page.indexOf('<footer');
const footerEnd = page.indexOf('</footer>') + 9;
console.log('Footer length:', footerEnd - footerStart);

