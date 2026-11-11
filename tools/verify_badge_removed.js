const fs = require('fs');

const indexHtml = fs.readFileSync('website_download/index.html', 'utf8');
const colorHtml = fs.readFileSync('website_download/cam-hung-mau-sac/index.html', 'utf8');

console.log('base44-edit-badge in index.html:', indexHtml.includes('base44-edit-badge'));
console.log('Edit with in index.html:', indexHtml.includes('Edit with'));

console.log('base44-edit-badge in cam-hung-mau-sac:', colorHtml.includes('base44-edit-badge'));
console.log('Edit with in cam-hung-mau-sac:', colorHtml.includes('Edit with'));
console.log('badge.js in cam-hung-mau-sac:', colorHtml.includes('badge.js'));

