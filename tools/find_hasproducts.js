const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

const idx = code.indexOf('hasProducts');
while (idx !== -1) {
  console.log('Context of hasProducts:');
  console.log(code.substring(Math.max(0, idx - 200), Math.min(code.length, idx + 400)));
  break;
}

// Find where qg is used
const idxQg = code.indexOf('qg.map');
if (idxQg !== -1) {
  console.log('Context of qg.map:');
  console.log(code.substring(Math.max(0, idxQg - 100), Math.min(code.length, idxQg + 800)));
}

