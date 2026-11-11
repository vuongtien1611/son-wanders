const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject'
};

function startServer(port) {
  const server = http.createServer((req, res) => {
    // Enable CORS for all local requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';

    let filePath = path.join(ROOT_DIR, reqPath);

    // 1. Directory redirection: ensure trailing slash so relative paths resolve cleanly
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!req.url.split('?')[0].endsWith('/')) {
        const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
        res.writeHead(301, { 'Location': req.url.split('?')[0] + '/' + query });
        res.end();
        return;
      }
      filePath = path.join(filePath, 'index.html');
    }

    // 2. Clean URL resolution: /gioi-thieu -> /gioi-thieu.html or /gioi-thieu/index.html
    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      } else {
        // Fallback for SPA or return 404
        const fallbackIndex = path.join(ROOT_DIR, 'index.html');
        if (reqPath.endsWith('.js') || reqPath.endsWith('.css') || reqPath.endsWith('.json') || reqPath.endsWith('.png') || reqPath.endsWith('.jpg') || reqPath.endsWith('.svg')) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found: ' + reqPath);
          return;
        }
        filePath = fallbackIndex;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(data);
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Cổng ${port} đang bận, tự động chuyển sang cổng ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Lỗi server:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(`  WEBSITE SƠN WANDERS ĐANG CHẠY CỤC BỘ TẠI:`);
    console.log(`  -> URL: http://localhost:${port}`);
    console.log(`  -> URL IP: http://127.0.0.1:${port}`);
    console.log(`  -> Trang Cảm hứng màu sắc: http://localhost:${port}/cam-hung-mau-sac/`);
    console.log(`  -> Trang Sản phẩm: http://localhost:${port}/san-pham/`);
    console.log(`  -> Giao thức: HTTP (CORS, ES Modules & Manifest hoạt động 100%)`);
    console.log(`================================================================`);
  });
}

startServer(DEFAULT_PORT);
