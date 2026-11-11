const fs = require('fs');

const f1 = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const f2 = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');

function getAssets(html) {
  const scripts = html.match(/<script[^>]*src=["'][^"']+["'][^>]*>/gi) || [];
  const links = html.match(/<link[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
  return { scripts, links: links.filter(l => !l.includes('googleapis') && !l.includes('gstatic')) };
}

console.log('=== cam-hung-mau-sac.html ===');
console.log(getAssets(f1));

console.log('\n=== cam-hung-mau-sac/index.html ===');
console.log(getAssets(f2));

