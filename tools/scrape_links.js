const puppeteer = require('puppeteer-core');

async function scrapeLinks() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://my-hour-home.base44.app/', { waitUntil: 'networkidle2' });

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'));
  });

  console.log('Homepage links count:', links.length);
  const internalLinks = [...new Set(links)].filter(h => h && (h.startsWith('/') || !h.includes(':')));
  console.log('Internal links:', internalLinks);

  await browser.close();
}

scrapeLinks().catch(console.error);
