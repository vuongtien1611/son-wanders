const fs = require('fs');

const indexHtml = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const scriptMatches = indexHtml.match(/<script[\s\S]*?<\/script>/g);
console.log(`Found ${scriptMatches ? scriptMatches.length : 0} scripts in index.html`);
if (scriptMatches) {
  for (const s of scriptMatches) {
    if (s.includes('Mở menu') || s.includes('lucide-menu') || s.includes('nav-dropdown')) {
      console.log("Header related script found:\n", s.slice(0, 300));
    }
  }
}

