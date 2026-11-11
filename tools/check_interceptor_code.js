const fs = require('fs');

const idxHtml = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');
const scriptMatch = idxHtml.match(/<script id="offline-link-interceptor">[\s\S]*?<\/script>/);
console.log('Script match found:', !!scriptMatch);
if (scriptMatch) {
  console.log(scriptMatch[0].substring(0, 300));
}

