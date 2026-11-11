const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const localHtml = 'file:///' + path.resolve(__dirname, '..', 'website_download', 'cam-hung-mau-sac', 'index.html').replace(/\\/g, '/');

async function snapColorPage() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(localHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));

  const screenshotPath = path.join(__dirname, '..', 'website_download', 'snap_nobadge.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved snap to:', screenshotPath);
  await browser.close();
}

snapColorPage().catch(console.error);

