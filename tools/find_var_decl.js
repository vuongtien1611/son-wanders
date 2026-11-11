const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

function findDecl(varName) {
  const regex = new RegExp(`(?:const|let|var|function|,)\\s*${varName.replace('$', '\\$')}\\s*=`, 'g');
  let m;
  while ((m = regex.exec(code)) !== null) {
    console.log(`Found ${varName} at index ${m.index}:`);
    console.log(code.substring(m.index, m.index + 200));
  }
}

findDecl('$g');
findDecl('t_');
findDecl('n_');
