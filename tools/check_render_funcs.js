const fs = require('fs');

const html = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const s4 = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)][4][0];

const fnMatches = ['renderSwatches', 'renderSelectedColor', 'renderAll', 'getContrastColor', 'swatchesGrid'];
fnMatches.forEach(name => {
  let idx = s4.indexOf(name);
  if (idx !== -1) {
    console.log(`=== Function/Variable: ${name} ===`);
    console.log(s4.substring(idx - 40, idx + 600));
  }
});

