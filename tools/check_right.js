const fs = require('fs');

const camHung = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const indexHtml = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');

const getRight = (h) => {
  const m = h.match(/<div class="flex items-center gap-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/);
  return m ? m[0] : 'not found';
};

console.log("INDEX RIGHT ACTIONS:\n", getRight(indexHtml));
console.log("CAM HUNG RIGHT ACTIONS:\n", getRight(camHung));

