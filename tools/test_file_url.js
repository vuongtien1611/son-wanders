const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const localHtml = 'file:///' + path.resolve(__dirname, 'website_download', 'index.html').replace(/\\/g, '/');

async function testFileUrl() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure().errorText));

  console.log('Navigating to localHtml:', localHtml);
  await page.goto(localHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  // Check if body has styling applied
  const bodyStyle = await page.evaluate(() => {
    const el = document.body;
    return {
      fontFamily: window.getComputedStyle(el).fontFamily,
      backgroundColor: window.getComputedStyle(el).backgroundColor,
      headerBg: document.querySelector('header') ? window.getComputedStyle(document.querySelector('header')).backgroundColor : null
    };
  });
  console.log('Body styles:', bodyStyle);

  await browser.close();
}

testFileUrl().catch(console.error);
