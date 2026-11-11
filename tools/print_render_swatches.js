const fs = require('fs');

const html = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const s4 = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)][4][0];

let idx = s4.indexOf('function renderSwatches()');
console.log(s4.substring(idx, idx + 2200));

