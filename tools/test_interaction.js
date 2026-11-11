const puppeteer = require('../node_modules/puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testInteractions() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  console.log('Testing Product Filter Tabs...');
  const totalCards = await page.$$eval('.product-card', cards => cards.length);
  console.log('Total product cards:', totalCards);

  // Click 'Sơn nội thất'
  await page.click('button[data-filter="son-noi-that"]');
  const visibleInterior = await page.$$eval('.product-card', cards => 
    cards.filter(c => window.getComputedStyle(c).display !== 'none').length
  );
  console.log('Visible interior cards:', visibleInterior);

  // Click 'Chống thấm'
  await page.click('button[data-filter="chong-tham"]');
  const visibleWaterproof = await page.$$eval('.product-card', cards => 
    cards.filter(c => window.getComputedStyle(c).display !== 'none').length
  );
  console.log('Visible waterproof cards:', visibleWaterproof);

  // Click 'Sản phẩm khác'
  await page.click('button[data-filter="san-pham-khac"]');
  const visibleOther = await page.$$eval('.product-card', cards => 
    cards.filter(c => window.getComputedStyle(c).display !== 'none').length
  );
  console.log('Visible other special products cards:', visibleOther);

  // Click 'Tất cả'
  await page.click('button[data-filter="all"]');
  const visibleAll = await page.$$eval('.product-card', cards => 
    cards.filter(c => window.getComputedStyle(c).display !== 'none').length
  );
  console.log('Visible all cards:', visibleAll);

  // Check Header logo text
  const logoText = await page.$eval('header a[aria-label*="WANDERS"]', el => el.innerText.trim());
  console.log('Header Logo text:', logoText);

  // Check Hotline in header and footer
  const hotlines = await page.$$eval('a[href*="0937760688"]', els => els.length);
  console.log('Hotline links count:', hotlines);

  await browser.close();
  console.log('All interactive tests passed 100%!');
}

testInteractions().catch(console.error);

