const fs = require('fs');

const indexHtml = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const headerIndex = indexHtml.match(/<header[\s\S]*?<\/header>/)[0];
console.log("=== FIXED HEADER IN INDEX.HTML ===");
console.log(headerIndex);

const camHung = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const headerCamHung = camHung.match(/<header[\s\S]*?<\/header>/)[0];
console.log("=== FIXED HEADER IN CAM-HUNG-MAU-SAC.HTML ===");
console.log(headerCamHung);

