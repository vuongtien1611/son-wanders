const fs = require('fs');

const indexHtml = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');

const scripts = indexHtml.match(/<script[^>]*src=["'][^"']+["'][^>]*>/gi) || [];
const links = indexHtml.match(/<link[^>]*href=["'][^"']+["'][^>]*>/gi) || [];

console.log('Scripts in index.html:', scripts);
console.log('Links in index.html:', links);

