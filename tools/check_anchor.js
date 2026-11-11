const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

const anchor = 'var iv=Qg,av=$g';
const pos = code.indexOf(anchor);
console.log('Position of anchor:', pos);
console.log('Before anchor:');
console.log(code.substring(Math.max(0, pos - 3000), pos));
