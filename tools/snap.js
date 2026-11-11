const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const localHtml = 'file:///' + path.resolve(__dirname, 'website_download', 'index.html').replace(/\\/g, '/');

async function snap() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(localHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(__dirname, 'website_download', 'preview.png') });
  console.log('Screenshot saved to preview.png');
  await browser.close();
}

snap().catch(console.error);
