const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

// Let's find $g, t_, n_
function getVarRaw(varName) {
  const match = code.match(new RegExp(`var ${varName}=(\\[.*?\\]);(?:var|function|const|let)`, 's'));
  if (match) return match[1];
  return null;
}

// Or we can extract all slugs by regex in the region of $g, t_, n_
const qgMatch = code.match(/var Qg=(\[[\s\S]*?\]);var \$g/);
if (qgMatch) {
  console.log('Qg extracted');
}

const gMatch = code.match(/var \$g=(\[[\s\S]*?\]);var t_/);
if (gMatch) {
  console.log('$g length:', gMatch[1].length);
  // Extract all slug:`...` inside $g
  const slugs = [...gMatch[1].matchAll(/slug:`([^`]+)`/g)].map(m => m[1]);
  console.log('Product slugs:', slugs);
}

const tMatch = code.match(/var t_=(\[[\s\S]*?\]);var e_/);
if (tMatch) {
  console.log('t_ length:', tMatch[1].length);
  const slugs = [...tMatch[1].matchAll(/slug:`([^`]+)`/g)].map(m => m[1]);
  console.log('News slugs:', slugs);
}

const nMatch = code.match(/var n_=(\[[\s\S]*?\]);var iv/);
if (nMatch) {
  console.log('n_ length:', nMatch[1].length);
  const slugs = [...nMatch[1].matchAll(/slug:`([^`]+)`/g)].map(m => m[1]);
  console.log('Project slugs:', slugs);
}
