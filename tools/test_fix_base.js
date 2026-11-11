const fs = require('fs');
const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  // Test removing base tag from bang-mau.html
  let html = fs.readFileSync('giao-dien/website_download/bang-mau.html', 'utf8');
  html = html.replace(/<base href="\/">/g, '');
  fs.writeFileSync('giao-dien/website_download/bang-mau.html', html, 'utf8');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure().errorText });
  });

  const fileUrl = 'file:///' + path.resolve('giao-dien/website_download/bang-mau.html').replace(/\\/g, '/');
  console.log('Testing file URL after removing base tag:', fileUrl);

  await page.goto(fileUrl, { waitUntil: 'networkidle2' });

  console.log('Failed requests count:', failedRequests.length);
  failedRequests.forEach(f => console.log('FAILED:', f.url, '->', f.failure));

  await page.screenshot({ path: 'giao-dien/tools/test_file_open_fixed.png' });
  console.log('Screenshot taken at test_file_open_fixed.png');

  await browser.close();
})();

