const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const match = html.match(/<script id="offline-nav-and-cleaner"[\s\S]*?<\/script>/);
if (match) {
  console.log(match[0].slice(0, 400));
} else {
  console.log('Not found');
}

