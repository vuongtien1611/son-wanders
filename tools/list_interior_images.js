const fs = require('fs');

const imgDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/images';
const files = fs.readdirSync(imgDir);
console.log('Images count:', files.length);
files.filter(f => f.includes('generated') || f.includes('cover') || f.includes('myhour')).forEach(f => {
  console.log(f);
});

