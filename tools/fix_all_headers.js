const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllHtmlFiles('giao-dien/website_download');

let fixedExtraDivCount = 0;
let fixedHamburgerCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Remove the extra </div> after nav-dropdown
  // The pattern in nav:
  // nav-mega-footer is inside nav-mega-menu, which is inside nav-dropdown.
  // </div> (footer) </div> (menu) </div> (dropdown) </div> (EXTRA!)
  // followed by <a ... du-an
  const extraDivRegex = /(<div class="nav-mega-footer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)\s*<\/div>(\s*<a[^>]*href="[^"]*du-an)/;
  if (extraDivRegex.test(content)) {
    content = content.replace(extraDivRegex, '$1$2');
    fixedExtraDivCount++;
    changed = true;
  }

  // 2. Ensure mobile menu button exists in header right actions
  // Check if header has hamburger button
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/);
  if (headerMatch) {
    const headerHtml = headerMatch[0];
    if (!headerHtml.includes('aria-label="Mở menu"') && !headerHtml.includes('lucide-menu')) {
      // Find the right actions container: <div class="flex items-center gap-3">...</div>
      const rightActionRegex = /(<div class="flex items-center gap-3">[\s\S]*?)(<\/div>\s*<\/div>\s*<\/header>)/;
      if (rightActionRegex.test(content)) {
        const hamburgerBtn = `<button type="button" aria-label="Mở menu" class="flex h-10 w-10 items-center justify-center border border-brand-line text-brand-ink lg:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu h-5 w-5"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button>`;
        content = content.replace(rightActionRegex, (m, p1, p2) => {
          return `${p1}${hamburgerBtn}${p2}`;
        });
        fixedHamburgerCount++;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
}

console.log(`Successfully fixed extra </div> in ${fixedExtraDivCount} files.`);
console.log(`Successfully added hamburger button in ${fixedHamburgerCount} files.`);

