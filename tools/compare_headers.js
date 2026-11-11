const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/index.html', 'utf8');
const camHtml = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');

const mIndex = indexHtml.match(/<header[\s\S]*?<\/header>/i);
const mCam = camHtml.match(/<header[\s\S]*?<\/header>/i);

console.log('--- INDEX HEADER (length: ' + (mIndex ? mIndex[0].length : 0) + ') ---');
if (mIndex) console.log(mIndex[0]);

console.log('\n--- CAM HUNG HEADER (length: ' + (mCam ? mCam[0].length : 0) + ') ---');
if (mCam) console.log(mCam[0]);

