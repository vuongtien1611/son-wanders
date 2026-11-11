const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/data/color_palette.json', 'utf8'));

console.log('Collections count:', data.length);
let totalColors = 0;
let invalidHex = 0;
data.forEach(col => {
  console.log(`- ${col.code} (${col.name}): ${col.colors ? col.colors.length : 0} colors`);
  if (col.colors) {
    totalColors += col.colors.length;
    col.colors.forEach(clr => {
      if (!clr.hex || !clr.hex.startsWith('#') || clr.hex.length < 4) {
        invalidHex++;
        console.log('Invalid HEX:', clr);
      }
    });
  }
});

console.log('Total colors in JSON:', totalColors);
console.log('Invalid HEX count:', invalidHex);

