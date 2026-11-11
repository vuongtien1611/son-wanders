const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');

const regex = /<img[^>]+>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  const tag = m[0];
  const src = (tag.match(/src=["']([^"']+)["']/) || [])[1];
  const alt = (tag.match(/alt=["']([^"']*)["']/) || [])[1];
  console.log(`ALT: "${alt}" | SRC: ${src}`);
}

