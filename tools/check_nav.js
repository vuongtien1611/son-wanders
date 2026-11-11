const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('giao-dien/website_download/index.html', 'utf8');
const headerMatch = indexHtml.match(/<header[\s\S]*?<\/header>/);
if (headerMatch) {
  console.log("=== HEADER IN INDEX.HTML ===");
  console.log(headerMatch[0]);
} else {
  console.log("No <header> found in index.html");
}

const camHung = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');
const headerCamHung = camHung.match(/<header[\s\S]*?<\/header>/);
if (headerCamHung) {
  console.log("\n=== HEADER IN CAM-HUNG-MAU-SAC.HTML ===");
  console.log(headerCamHung[0]);
}

