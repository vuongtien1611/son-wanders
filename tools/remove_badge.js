const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', 'website_download');

// Empty badge.js
const badgePath = path.join(ROOT_DIR, 'static', 'js', 'badge.js');
if (fs.existsSync(badgePath)) {
  fs.writeFileSync(badgePath, '/* badge disabled */', 'utf8');
  console.log('Cleared badge.js');
}

// Add hide rule to index-BDqGYMxC.css
const cssPath = path.join(ROOT_DIR, 'assets', 'index-BDqGYMxC.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('#base44-edit-badge')) {
    css += '\n#base44-edit-badge{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}\n';
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Added hide rule to index-BDqGYMxC.css');
  }
}

// Regex to remove the entire <div id="base44-edit-badge" ...> ... </div> block
// Look for <div id="base44-edit-badge" until the matching closing tags
const badgeDivRegex = /<div id="base44-edit-badge"[\s\S]*?<\/button>\s*<\/div>/gi;
const badgeScriptRegex = /<script[^>]*badge\.js[^>]*>[\s\S]*?<\/script>/gi;

function removeBadgeFromFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (badgeDivRegex.test(html)) {
    html = html.replace(badgeDivRegex, '');
    changed = true;
  }

  if (badgeScriptRegex.test(html)) {
    html = html.replace(badgeScriptRegex, '');
    changed = true;
  }

  // Also add inline CSS hide rule to <style id="site-main-css"> just in case
  if (html.includes('id="site-main-css"') && !html.includes('#base44-edit-badge{display:none')) {
    html = html.replace('id="site-main-css">', 'id="site-main-css">\n#base44-edit-badge{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}\n');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
  }
}

function walkDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'images' && item !== 'assets' && item !== 'static') {
        walkDir(fullPath);
      }
    } else if (item.endsWith('.html')) {
      removeBadgeFromFile(fullPath);
    }
  }
}

walkDir(ROOT_DIR);
console.log('Removed Base44 badge from all HTML files!');

