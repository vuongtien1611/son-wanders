const fs = require('fs');

const cam = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');

const m = cam.match(/<!-- HEADER RIGHT ACTIONS -->[\s\S]*?<\/header>/i);
if (m) console.log(m[0]);

