const fs = require('fs');

const js = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');
const rootIdx = js.indexOf('createRoot');
console.log('createRoot index:', rootIdx);
if (rootIdx !== -1) {
  console.log(js.substring(rootIdx - 100, rootIdx + 300));
}

