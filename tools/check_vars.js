const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

const idxG = code.indexOf('var $g=');
console.log('$g preview:');
console.log(code.substring(idxG, idxG + 500));

const idxT = code.indexOf('var t_=');
console.log('t_ preview:');
console.log(code.substring(idxT, idxT + 500));

const idxN = code.indexOf('var n_=');
console.log('n_ preview:');
console.log(code.substring(idxN, idxN + 500));
