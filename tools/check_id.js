const fs = require('fs');
const html = fs.readFileSync('website_download/index.html', 'utf8');

const matches = [...html.matchAll(/id="base44-edit-badge"/g)];
console.log('DOM matches for id="base44-edit-badge":', matches.length);

