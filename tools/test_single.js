const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://my-hour-home.base44.app';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSinglePage() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(BASE_URL + '/gioi-thieu', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#root > div', { timeout: 10000 });

  const html = await page.content();
  console.log('Gioi-thieu HTML length:', html.length);
  console.log('Contains "Về MY HOUR":', html.includes('MY HOUR'));
  
  // Check headings
  const h1 = await page.$eval('h1, h2', el => el.innerText).catch(() => 'none');
  console.log('Heading:', h1);

  await browser.close();
}

testSinglePage().catch(console.error);
