const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

// Slice products area
const productsPart = code.substring(422070, 426680);
const productSlugs = [...productsPart.matchAll(/slug:`([^`]+)`/g)].map(m => m[1]);
console.log('Product count:', productSlugs.length);
console.log('Product slugs:', productSlugs);

// Slice news area
const newsPart = code.substring(426680, 427585);
const newsSlugs = [...newsPart.matchAll(/slug:`([^`]+)`/g)].map(m => m[1]);
console.log('News count:', newsSlugs.length);
console.log('News slugs:', newsSlugs);

// Category slugs
const catPart = code.substring(code.indexOf('var Qg='), code.indexOf(',$g='));
const catSlugs = [...catPart.matchAll(/slug:`([^`]+)`/g)].map(m => m[1]);
console.log('Category count:', catSlugs.length);
console.log('Category slugs:', catSlugs);
