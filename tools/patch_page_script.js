const fs = require('fs');

const p = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html';
let html = fs.readFileSync(p, 'utf8');

// Remove React bundle script on this page so React does not overwrite our custom color inspiration UI
html = html.replace(/<script src="\.\.\/assets\/index-BG3fZPr5\.js" type="module">\s*<\/script>/, '');

// Also ensure dropdown on header works smoothly with hover CSS (which is already in site-main-css)
fs.writeFileSync(p, html, 'utf8');
console.log('Removed React bundle script from cam-hung-mau-sac/index.html');

