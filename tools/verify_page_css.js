const fs = require('fs');
const html = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');
console.log('Has site-main-css:', html.includes('site-main-css'));
console.log('File size in bytes:', html.length);
console.log('Has offline-link-interceptor:', html.includes('offline-link-interceptor'));

