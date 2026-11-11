const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

const targetStr = 'hasProducts?(0,j.jsxs)(`div`,{className:`relative flex h-[72px] items-center`,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1)';
const idx = js.indexOf(targetStr);
console.log('Target found at:', idx);
if (idx !== -1) {
  console.log(js.substring(idx, idx + 600));
}

