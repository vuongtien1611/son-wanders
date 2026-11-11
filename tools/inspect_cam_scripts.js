const fs = require('fs');

const html = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const scripts = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)];
console.log('Total scripts in cam-hung-mau-sac.html:', scripts.length);
scripts.forEach((s, i) => {
  console.log(`Script ${i}:`, s[0].substring(0, 80).replace(/\n/g, ' '));
});

