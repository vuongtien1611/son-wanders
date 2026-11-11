const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const localHtml = 'file:///' + path.resolve(__dirname, '..', 'website_download', 'index.html').replace(/\\/g, '/');

async function testNavigation() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Loading homepage via file:/// ...');
  await page.goto(localHtml, { waitUntil: 'load' });
  console.log('Homepage URL:', page.url());
  console.log('Homepage Title:', await page.title());

  // 2. Click "Giới thiệu"
  console.log('\n2. Clicking "Giới thiệu" link...');
  const clicked = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Giới thiệu'));
    if (link) {
      console.log('Clicking href:', link.getAttribute('href'));
      link.click();
      return true;
    }
    return false;
  });

  if (!clicked) {
    console.error('Could not find Giới thiệu link!');
  } else {
    await page.waitForNavigation({ waitUntil: 'load', timeout: 5000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 500));
    console.log('New URL after click:', page.url());
    console.log('New Title:', await page.title());
    const h1 = await page.$eval('h1, h2', el => el.innerText).catch(() => 'none');
    console.log('Heading on new page:', h1);
  }

  // 3. Click "Sản phẩm"
  console.log('\n3. Clicking "Sản phẩm" link from Giới thiệu page...');
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.trim() === 'Sản phẩm');
    if (link) link.click();
  });
  await page.waitForNavigation({ waitUntil: 'load', timeout: 5000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 500));
  console.log('New URL after clicking Sản phẩm:', page.url());
  console.log('Heading on Sản phẩm page:', await page.$eval('h1, h2', el => el.innerText).catch(() => 'none'));

  await browser.close();
}

testNavigation().catch(console.error);

