const fs = require('fs');
const http = require('http');

console.log('Testing server.js logic:');
const ROOT_DIR = 'giao-dien/website_download';

const testPaths = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index-BG3fZPr5.js',
  '/assets/index-BDqGYMxC.css',
  '/cam-hung-mau-sac',
  '/cam-hung-mau-sac/',
  '/cam-hung-mau-sac/index.html',
  '/cam-hung-mau-sac.html',
  '/gioi-thieu',
  '/san-pham',
  '/san-pham/son-noi-that/index.html'
];

testPaths.forEach(p => {
  let reqPath = decodeURI(p.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = require('path').join(ROOT_DIR, reqPath);
  let isDir = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  let resolved = filePath;
  if (isDir) {
    resolved = require('path').join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      resolved = filePath + '.html';
    } else if (fs.existsSync(require('path').join(filePath, 'index.html'))) {
      resolved = require('path').join(filePath, 'index.html');
    }
  }
  console.log(`${p.padEnd(35)} -> ${fs.existsSync(resolved) ? 'FOUND: ' + resolved : 'NOT FOUND'}`);
});

