const fs = require('fs');

let content = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');

// For root cam-hung-mau-sac.html:
// Replace ../manifest.json with manifest.json
content = content.replace(/\.\.\/manifest\.json/g, 'manifest.json');

// Replace ../assets/ with assets/
content = content.replace(/\.\.\/assets\//g, 'assets/');

// Replace ../images/ with images/
content = content.replace(/\.\.\/images\//g, 'images/');

// Replace ../data/ with data/
content = content.replace(/\.\.\/data\//g, 'data/');

// In nav and footer links:
// ../index.html -> index.html
content = content.replace(/href=["']\.\.\/index\.html["']/g, 'href="index.html"');

// ../gioi-thieu/index.html -> gioi-thieu.html (or gioi-thieu/index.html)
content = content.replace(/href=["']\.\.\/gioi-thieu\/index\.html["']/g, 'href="gioi-thieu/index.html"');

// ../san-pham/index.html -> san-pham.html (or san-pham/index.html)
content = content.replace(/href=["']\.\.\/san-pham\/index\.html["']/g, 'href="san-pham/index.html"');
content = content.replace(/href=["']\.\.\/san-pham\/([^"']+)["']/g, 'href="san-pham/$1"');

// ../du-an/index.html -> du-an.html
content = content.replace(/href=["']\.\.\/du-an\/index\.html["']/g, 'href="du-an/index.html"');

// ../cam-hung-mau-sac/index.html -> cam-hung-mau-sac.html
content = content.replace(/href=["']\.\.\/cam-hung-mau-sac\/index\.html["']/g, 'href="cam-hung-mau-sac.html"');

// ../tin-tuc/index.html -> tin-tuc.html
content = content.replace(/href=["']\.\.\/tin-tuc\/index\.html["']/g, 'href="tin-tuc/index.html"');

// ../lien-he/index.html -> lien-he.html
content = content.replace(/href=["']\.\.\/lien-he\/index\.html["']/g, 'href="lien-he/index.html"');

// Clean up duplicate <!DOCTYPE html> at beginning if present
content = content.replace(/^<!DOCTYPE html>\s*<html lang="vi">\s*<!DOCTYPE html><html lang="vi">/, '<!DOCTYPE html>\n<html lang="vi">');

// Also ensure base44 badge is completely hidden/removed
content = content.replace(/<div id="base44-edit-badge"[\s\S]*?<\/div>/gi, '');

fs.writeFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', content, 'utf8');
console.log('Successfully generated cam-hung-mau-sac.html. Length:', content.length);

