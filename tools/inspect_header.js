const fs = require('fs');

const html = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');

// Find all occurrences of menu links
const navIndex = html.indexOf('<nav');
const navEnd = html.indexOf('</nav>');
console.log('Main Nav:');
console.log(html.substring(navIndex, navEnd + 6));

// Check if there is another nav or mobile drawer
let nextNav = html.indexOf('<nav', navEnd);
if (nextNav !== -1) {
  console.log('Second Nav:');
  console.log(html.substring(nextNav, html.indexOf('</nav>', nextNav) + 6));
} else {
  console.log('No second nav tag in static HTML (mobile menu is rendered dynamically by React or hidden dialog).');
}

