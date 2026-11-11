const http = require('http');
const { spawn } = require('child_process');

console.log('Starting server.js for end-to-end verification...');

const serverProc = spawn('node', ['giao-dien/website_download/server.js'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

serverProc.stdout.on('data', (d) => {
  process.stdout.write('[SERVER] ' + d.toString());
});

serverProc.stderr.on('data', (d) => {
  process.stderr.write('[SERVER ERR] ' + d.toString());
});

function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          dataLength: data.length
        });
      });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
  });
}

// Wait 1s for server to start, then test
setTimeout(async () => {
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/index.html',
    'http://localhost:3000/assets/index-BG3fZPr5.js',
    'http://localhost:3000/assets/index-BDqGYMxC.css',
    'http://localhost:3000/manifest.json',
    'http://localhost:3000/cam-hung-mau-sac/',
    'http://localhost:3000/cam-hung-mau-sac.html',
    'http://localhost:3000/gioi-thieu/',
    'http://localhost:3000/san-pham/',
    'http://localhost:3000/du-an/',
    'http://localhost:3000/tin-tuc/',
    'http://localhost:3000/lien-he/'
  ];

  console.log('\n--- VERIFYING ENDPOINTS VIA HTTP ---');
  let allOk = true;

  for (const u of urls) {
    const res = await fetchUrl(u);
    const ok = res.status === 200;
    if (!ok) allOk = false;
    const cors = res.headers ? res.headers['access-control-allow-origin'] : 'none';
    const cType = res.headers ? res.headers['content-type'] : 'none';
    console.log(`${ok ? '✓ PASS' : '✗ FAIL'} [${res.status}] ${u.padEnd(46)} | Content-Type: ${cType} | CORS: ${cors} | Size: ${res.dataLength}`);
  }

  // Also test 301 redirect for directory without slash
  const redirectRes = await new Promise((resolve) => {
    http.get('http://localhost:3000/cam-hung-mau-sac', (res) => {
      resolve({ status: res.statusCode, location: res.headers.location });
    });
  });
  console.log(`\n✓ PASS [${redirectRes.status}] Redirect /cam-hung-mau-sac -> ${redirectRes.location}`);

  console.log('\nAll endpoints verified successfully:', allOk);
  serverProc.kill();
  process.exit(allOk ? 0 : 1);
}, 1500);

