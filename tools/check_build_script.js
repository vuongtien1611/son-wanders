const fs = require('fs');
const path = require('path');

const cssPath = 'giao-dien/website_download/assets/index-BDqGYMxC.css';
const cssContent = fs.readFileSync(cssPath, 'utf8');

const buildScriptPath = 'giao-dien/tools/build_cam_hung_page.js';
let script = fs.readFileSync(buildScriptPath, 'utf8');

// 1. In build_cam_hung_page.js, read index-BDqGYMxC.css and embed it
// Check how buildHtml is defined in build_cam_hung_page.js
console.log("Original script length:", script.length);

