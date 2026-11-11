const fs = require('fs');
console.log('--- start-web.bat ---');
console.log(fs.readFileSync('start-web.bat', 'utf8'));
console.log('--- giao-dien/website_download/start_preview.bat ---');
console.log(fs.readFileSync('giao-dien/website_download/start_preview.bat', 'utf8'));

