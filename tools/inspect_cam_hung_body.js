const fs = require('fs');

const html = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');
const bodyMatch = html.match(/<body[\s\S]*?<\/body>/);
if (bodyMatch) {
  const body = bodyMatch[0];
  console.log("BODY LENGTH:", body.length);
  // print first 1500 chars after <header>
  const afterHeader = body.split('</header>')[1] || '';
  console.log("AFTER HEADER (1500 chars):\n", afterHeader.slice(0, 1500));
}

