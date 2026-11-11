const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

function findVarDef(name) {
  const p = `var ${name}=`;
  const idx = code.indexOf(p);
  if (idx !== -1) {
    console.log(`=== ${p} ===`);
    console.log(code.substring(idx, idx + 1000));
  } else {
    const p2 = `const ${name}=`;
    const idx2 = code.indexOf(p2);
    if (idx2 !== -1) {
      console.log(`=== ${p2} ===`);
      console.log(code.substring(idx2, idx2 + 1000));
    }
  }
}

findVarDef('Qg');
findVarDef('$g');
findVarDef('t_');
findVarDef('n_');
