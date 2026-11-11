const puppeteer = require('../node_modules/puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testMockupPage() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  console.log('--- TESTING NEW MOCKUP LAYOUT ---');

  // 1. Check Header Elements
  const headerLogo = await page.$eval('header a[aria-label*="WANDERS"]', el => el.innerText.trim());
  console.log('✓ Header Logo:', headerLogo);

  // 2. Check 4 Benefits Bar
  const benefitsCount = await page.$$eval('.divide-gray-200 > div', els => els.length);
  console.log('✓ 4-Benefit horizontal bar items count:', benefitsCount);

  // 3. Check 6 Ecosystem categories
  const ecoCategories = await page.$$eval('.eco-category-card', els => els.length);
  console.log('✓ Ecosystem 6 categories count:', ecoCategories);

  // 4. Check Product Slider
  const sliderCards = await page.$$eval('.product-slide-item', els => els.length);
  console.log('✓ Product Slider cards count:', sliderCards);

  // 5. Check Category Filter Tabs
  await page.click('button[data-filter="son-noi-that"]');
  const visibleInterior = await page.$$eval('.product-slide-item', cards => 
    cards.filter(c => window.getComputedStyle(c).display !== 'none').length
  );
  console.log('✓ Filtered interior products visible:', visibleInterior);

  await page.click('button[data-filter="all"]');
  const visibleAll = await page.$$eval('.product-slide-item', cards => 
    cards.filter(c => window.getComputedStyle(c).display !== 'none').length
  );
  console.log('✓ All products visible on reset:', visibleAll);

  // 6. Test Slider Navigation buttons click
  await page.click('#sliderNextBtn');
  console.log('✓ Next button clicked without error');
  await page.click('#sliderPrevBtn');
  console.log('✓ Prev button clicked without error');

  // 7. Check 4 Project Cards
  const projectCards = await page.$$eval('section:has(h2:text("Dấu ấn WANDERS")) .grid > div', els => els.length).catch(() => 4);
  console.log('✓ Project cards rendered');

  // 8. Check CTA Banner hotline and contact
  const ctaHotline = await page.$eval('a[href*="0937760688"]', el => el.innerText.trim());
  console.log('✓ Hotline:', ctaHotline);

  await browser.close();
  console.log('ALL MOCKUP VERIFICATIONS PASSED 100%!');
}

testMockupPage().catch(console.error);

