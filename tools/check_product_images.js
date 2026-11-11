const fs = require('fs');
const code = fs.readFileSync('giao-dien/website_download/assets/index-BG3fZPr5.js', 'utf8');

// Look for image mappings for products
// In find_arrays.js earlier, we saw:
// $g has products array
const gIdx = code.indexOf(',$g=[');
if (gIdx !== -1) {
  console.log('Sample of $g:');
  console.log(code.substring(gIdx, gIdx + 800));
}

// Find image helper function (like y_ or m_)
const mIdx = code.indexOf('function y_(');
if (mIdx !== -1) {
  console.log('y_ function:');
  console.log(code.substring(mIdx, mIdx + 400));
}

// Find media URLs in $g or image table
const mediaMatches = [...code.matchAll(/https:\/\/media\.base44\.com\/images\/[^\s"',]+/g)].map(m => m[0]);
console.log('Total media.base44.com URLs in JS:', mediaMatches.length);
console.log('Unique media URLs in JS:', [...new Set(mediaMatches)].slice(0, 15));

