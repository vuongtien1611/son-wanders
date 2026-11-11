const fs = require('fs');

// Verify we can load the full data/color_palette.json
const paletteData = JSON.parse(fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/data/color_palette.json', 'utf8'));
console.log('Loaded collections:', paletteData.length);
let count = 0;
paletteData.forEach(c => count += c.colors.length);
console.log('Total colors:', count);

