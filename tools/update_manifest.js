const fs = require('fs');

const manifestPath = 'giao-dien/website_download/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.start_url = '/';
manifest.scope = '/';
manifest.theme_color = '#1E3A2F';
manifest.background_color = '#ffffff';

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Updated manifest.json:');
console.log(fs.readFileSync(manifestPath, 'utf8'));

