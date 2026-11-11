const fs = require('fs');

const js = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');
const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');

console.log('CSS length:', css.length);
['base44', 'b44', 'edit-badge', 'Edit with', 'badge'].forEach(word => {
  let count = (css.match(new RegExp(word, 'gi')) || []).length;
  console.log(`CSS "${word}":`, count);
});

// Check if any element in JS has "Edit with" or base44 badge
let b44Matches = [];
let regex = /base44[a-zA-Z0-9_\-]*/gi;
let m;
let set = new Set();
while ((m = regex.exec(js)) !== null) {
  set.add(m[0]);
}
console.log('Distinct base44 identifiers in JS:', Array.from(set));

