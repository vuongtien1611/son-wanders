const fs = require('fs');
const html = fs.readFileSync('website_download/index.html', 'utf8');
const hrefMatches = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
const internalHrefs = [...new Set(hrefMatches.filter(h => h.startsWith('/')))];
console.log('Internal hrefs in index.html:');
console.log(internalHrefs);

