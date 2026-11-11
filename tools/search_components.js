const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

function searchDef(name) {
  const patterns = [
    `function ${name}(`,
    `const ${name}=`,
    `let ${name}=`,
    `var ${name}=`
  ];
  for (const p of patterns) {
    const idx = code.indexOf(p);
    if (idx !== -1) {
      console.log(`=== FOUND ${name} (${p}) ===`);
      console.log(code.substring(idx, idx + 800));
      return;
    }
  }
  console.log(`=== NOT FOUND ${name} ===`);
}

searchDef('gv');
searchDef('wv');
searchDef('px');
searchDef('mx');
searchDef('_x');
searchDef('yx');
