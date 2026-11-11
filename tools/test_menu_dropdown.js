const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const localHtml = 'file:///' + path.resolve(__dirname, '..', 'website_download', 'index.html').replace(/\\/g, '/');

async function testDropdown() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(localHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));

  // Check nav text
  const navTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('nav[aria-label="Điều hướng chính"] > *')).map(el => el.innerText.trim());
  });
  console.log('Nav items in DOM:', navTexts);

  // Hover over "Sản phẩm"
  console.log('Hovering over Sản phẩm...');
  await page.hover('.nav-dropdown');
  await new Promise(r => setTimeout(r, 300));

  // Check if dropdown menu is visible
  const isVisible = await page.evaluate(() => {
    const menu = document.querySelector('.nav-dropdown-menu');
    if (!menu) return false;
    const style = window.getComputedStyle(menu);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
  console.log('Is dropdown visible on hover:', isVisible);

  // Take screenshot of header with dropdown
  await page.screenshot({ path: path.join(__dirname, '..', 'website_download', 'header_preview.png'), clip: { x: 0, y: 0, width: 1440, height: 350 } });
  console.log('Screenshot saved to header_preview.png');

  // Test clicking "Nhận tư vấn"
  console.log('Clicking "Nhận tư vấn"...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Nhận tư vấn'));
    if (btn) btn.click();
  });
  await page.waitForNavigation({ waitUntil: 'load', timeout: 5000 }).catch(() => {});
  console.log('URL after clicking Nhận tư vấn:', page.url());

  await browser.close();
}

testDropdown().catch(console.error);

