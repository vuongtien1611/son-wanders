const fs = require('fs');

const js = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');
const mountIdx = js.indexOf('getElementById(`root`)');
const mountIdx2 = js.indexOf('getElementById("root")');
console.log('root mounts:', { mountIdx, mountIdx2 });
const idx = mountIdx !== -1 ? mountIdx : mountIdx2;
if (idx !== -1) {
  console.log(js.substring(idx - 100, idx + 200));
}

