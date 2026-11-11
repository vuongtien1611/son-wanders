const fs = require('fs');

const jsPath = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js';
const js = fs.readFileSync(jsPath, 'utf8');

const regex = /([a-zA-Z0-9_$]+)=function\s*\(\{src:/g;
console.log('src components:', js.match(regex));

const regex2 = /function\s+([a-zA-Z0-9_$]+)\(\{src:/g;
console.log('src functions:', js.match(regex2));

// Or look around where Image is imported or Base44 Image component is defined
const idx = js.indexOf('fittingType');
console.log('fittingType at:', idx);
console.log(js.substring(idx - 300, idx + 300));

