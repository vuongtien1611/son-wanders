const fs = require('fs');
const path = require('path');

const pagePath = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html';
const rawHtml = fs.readFileSync(pagePath, 'utf8');

// Extract head (up to </head>)
const headEnd = rawHtml.indexOf('</head>') + 7;
let headHtml = rawHtml.substring(0, headEnd);

// Ensure Google Font Playfair / Cinzel for luxury serif typography
if (!headHtml.includes('Playfair+Display')) {
  headHtml = headHtml.replace('</head>', `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Cinzel:wght@500;600;700&display=swap" rel="stylesheet">
</head>`);
}

// Extract header
const headerStart = rawHtml.indexOf('<header');
const headerEnd = rawHtml.indexOf('</header>') + 9;
const headerHtml = rawHtml.substring(headerStart, headerEnd);

// Extract footer
const footerStart = rawHtml.indexOf('<footer');
const footerEnd = rawHtml.indexOf('</footer>') + 9;
const footerHtml = rawHtml.substring(footerStart, footerEnd);

// Load color palette data
const paletteData = JSON.parse(fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/data/color_palette.json', 'utf8'));

console.log('Read data successfully. Collections:', paletteData.length);

