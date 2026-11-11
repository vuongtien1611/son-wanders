const fs = require('fs');
const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');

const sIdx = html.indexOf('CẢM HỨNG MÀU SẮC');
if (sIdx !== -1) {
  console.log(html.substring(sIdx, sIdx + 1500));
} else {
  console.log('Not found');
}

