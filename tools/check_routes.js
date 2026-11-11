const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

// Look for path: "/" or routes definition
let idx = js.indexOf('path:"/"');
if (idx === -1) idx = js.indexOf('path:`/`');
if (idx !== -1) {
  console.log('Routes found around:', js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 300)));
} else {
  console.log('path:"/" not found, searching path:');
  let pIdx = js.indexOf('path:');
  while (pIdx !== -1 && pIdx < 10000) {
    console.log('path: at', pIdx, js.substring(pIdx, pIdx + 50));
    pIdx = js.indexOf('path:', pIdx + 1);
  }
}

