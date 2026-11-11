const fs = require('fs');

const buildScriptPath = 'giao-dien/tools/build_cam_hung_page.js';
let script = fs.readFileSync(buildScriptPath, 'utf8');

// Restore manifest.json link
script = script.replace('<!-- manifest omitted for offline file:/// compatibility -->', '<link href="${p}manifest.json" rel="manifest">');

fs.writeFileSync(buildScriptPath, script, 'utf8');
console.log('Restored manifest link in build_cam_hung_page.js');

