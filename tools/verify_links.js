const fs = require('fs');

const indexHtml = fs.readFileSync('website_download/index.html', 'utf8');
const gtHtml = fs.readFileSync('website_download/gioi-thieu/index.html', 'utf8');
const spHtml = fs.readFileSync('website_download/san-pham/son-noi-that/index.html', 'utf8');

function findSampleHrefs(html, title) {
  const matches = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
  console.log(`=== Sample hrefs in ${title} ===`);
  const internal = [...new Set(matches.filter(h => h.includes('index.html') || h.startsWith('.')))];
  console.log(internal.slice(0, 10));
}

findSampleHrefs(indexHtml, 'website_download/index.html');
findSampleHrefs(gtHtml, 'website_download/gioi-thieu/index.html');
findSampleHrefs(spHtml, 'website_download/san-pham/son-noi-that/index.html');

