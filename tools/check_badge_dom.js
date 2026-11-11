const fs = require('fs');

const html = fs.readFileSync('website_download/index.html', 'utf8');
const start = html.indexOf('<div id="base44-edit-badge"');
if (start !== -1) {
  // Find the end tag
  const end = html.indexOf('</div>', start + 100);
  console.log(html.substring(start, end + 6));
}

