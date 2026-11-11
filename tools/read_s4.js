const fs = require('fs');

const html = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const scripts = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)];
const s4 = scripts[4][0];
console.log('Script 4 length:', s4.length);
console.log('Script 4 preview:\n', s4.substring(0, 1500));
console.log('...\n', s4.substring(s4.length - 1500));

