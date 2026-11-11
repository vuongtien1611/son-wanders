const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = path.resolve(__dirname);
const SUBMISSIONS_FILE = path.resolve(ROOT_DIR, '..', 'submissions', 'contact_submissions.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
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

function applySecurityHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

function handleContactApi(req, res) {
  let body = '';
  let aborted = false;
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 32768) {
      aborted = true;
      res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'Dữ liệu gửi lên vượt quá giới hạn cho phép.' }));
      req.destroy();
    }
  });
  req.on('end', () => {
    if (aborted) return;
    try {
      const payload = JSON.parse(body || '{}');
      const full_name = String(payload.full_name || '').trim().slice(0, 120);
      const phone = String(payload.phone || '').trim().slice(0, 32);
      const email = String(payload.email || '').trim().slice(0, 120);
      const need = String(payload.need || '').trim().slice(0, 80);
      const message = String(payload.message || '').trim().slice(0, 2000);

      if (full_name.length < 2) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự).' }));
        return;
      }
      if (!/^[0-9+\-\s().]{8,20}$/.test(phone)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Vui lòng nhập số điện thoại hợp lệ.' }));
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Địa chỉ email chưa đúng định dạng.' }));
        return;
      }
      if (message.length < 5) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Vui lòng mô tả ngắn gọn nhu cầu tư vấn (tối thiểu 5 ký tự).' }));
        return;
      }

      fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true });
      let list = [];
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        try {
          list = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
          if (!Array.isArray(list)) list = [];
        } catch {
          list = [];
        }
      }
      const record = {
        id: 'WD-' + Date.now(),
        created_at: new Date().toISOString(),
        full_name,
        phone,
        email,
        need: need || 'Chưa chọn nhóm cụ thể',
        message
      };
      list.push(record);
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf8');

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, id: record.id }));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'Định dạng yêu cầu không hợp lệ.' }));
    }
  });
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    applySecurityHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const reqUrlPath = (req.url || '/').split('?')[0];

    if (req.method === 'POST' && reqUrlPath === '/api/contact') {
      handleContactApi(req, res);
      return;
    }

    let reqPath;
    try {
      reqPath = decodeURI(reqUrlPath);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('400 Bad Request');
      return;
    }
    if (reqPath === '/') reqPath = '/index.html';

    let filePath = path.resolve(ROOT_DIR, '.' + reqPath);
    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    // 1. Directory redirection: ensure trailing slash so relative paths resolve cleanly
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!reqUrlPath.endsWith('/')) {
        const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
        res.writeHead(301, { 'Location': reqUrlPath + '/' + query });
        res.end();
        return;
      }
      filePath = path.join(filePath, 'index.html');
    }

    // 2. Intelligent nested asset fallback for /assets/ and /images/
    if (!fs.existsSync(filePath)) {
      if (reqPath.includes('/assets/')) {
        const sub = reqPath.substring(reqPath.indexOf('/assets/'));
        const altPath = path.resolve(ROOT_DIR, '.' + sub);
        if (altPath.startsWith(ROOT_DIR) && fs.existsSync(altPath)) filePath = altPath;
      } else if (reqPath.includes('/images/')) {
        const sub = reqPath.substring(reqPath.indexOf('/images/'));
        const altPath = path.resolve(ROOT_DIR, '.' + sub);
        if (altPath.startsWith(ROOT_DIR) && fs.existsSync(altPath)) filePath = altPath;
      }
    }

    // 3. Clean URL resolution: /gioi-thieu -> /gioi-thieu.html or /gioi-thieu/index.html
    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>404 — WANDERS</title></head><body style="font-family:sans-serif;padding:48px;background:#F6F3EC;color:#273238;"><h1 style="color:#073B2E;">404 — Không tìm thấy trang</h1><p>Đường dẫn bạn truy cập không tồn tại trên hệ thống WANDERS.</p><p><a href="/" style="color:#073B2E;font-weight:600;border-bottom:2px solid #D6AD45;text-decoration:none;padding-bottom:2px;">Quay lại trang chủ WANDERS</a></p></body></html>');
        return;
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
    console.log(`  -> Trang Bảng màu: http://localhost:${port}/bang-mau/`);
    console.log(`  -> Trang Bảng màu HTML: http://localhost:${port}/bang-mau.html`);
    console.log(`  -> Trang Cảm hứng màu sắc: http://localhost:${port}/cam-hung-mau-sac/`);
    console.log(`  -> Trang Sản phẩm: http://localhost:${port}/san-pham/`);
    console.log(`  -> Giao thức: HTTP (CORS, ES Modules & Manifest hoạt động 100%)`);
    console.log(`================================================================`);
  });
}

startServer(DEFAULT_PORT);
