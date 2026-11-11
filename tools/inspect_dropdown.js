const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');
const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');

// Find dropdown markup in index.html
const m = indexHtml.match(/<div[^>]*nav-dropdown[\s\S]*?<\/div>\s*<\/div>/i) || indexHtml.match(/<span>Sản phẩm<\/span>[\s\S]*?<\/nav>/i);
if (m) {
  console.log('Dropdown in index.html:\n', m[0].substring(0, 800));
} else {
  console.log('Not found by regex in index.html');
}

// Find nav-dropdown in css
let idx = 0;
while ((idx = css.indexOf('nav-dropdown', idx)) !== -1) {
  console.log('CSS nav-dropdown at', idx, ':\n', css.substring(Math.max(0, idx - 50), Math.min(css.length, idx + 200)));
  idx += 12;
}

// Check Tailwind w-[520px] or similar in CSS
['w-[520px]', '520px', 'nav-dropdown-menu'].forEach(term => {
  let count = (css.match(new RegExp(term.replace(/[\[\]]/g, '\\$&'), 'g')) || []).length;
  console.log(`CSS has "${term}":`, count);
});

