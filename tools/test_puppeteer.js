const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://my-hour-home.base44.app/', { waitUntil: 'networkidle2' });
  const title = await page.title();
  console.log('Page loaded successfully! Title:', title);
  await browser.close();
}

test().catch(console.error);
