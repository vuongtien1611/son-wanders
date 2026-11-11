const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Starting visual verification at 1440px...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  
  // Console errors collector
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  // 1. Desktop 1440px Viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  
  const desktopPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cfab6cee-0d29-42b2-9b09-bea16f5d5c63\\wanders_home_desktop.png';
  await page.screenshot({ path: desktopPath, fullPage: true });
  console.log('Saved 1440px desktop fullpage screenshot:', fs.statSync(desktopPath).size);

  // Capture individual sections at 1440px for precise inspection
  const sections = [
    { name: 'section_1_header', sel: 'header' },
    { name: 'section_2_hero', sel: 'section:nth-of-type(1)' },
    { name: 'section_3_benefits', sel: '.brand-value-strip' },
    { name: 'section_4_ecosystem', sel: 'section:nth-of-type(2)' },
    { name: 'section_5_featured', sel: '#san-pham-noi-bat' },
    { name: 'section_6_color_inspiration', sel: 'section:nth-of-type(4)' },
    { name: 'section_7_projects', sel: 'section:nth-of-type(5)' },
    { name: 'section_8_why_wanders', sel: 'section:nth-of-type(6)' },
    { name: 'section_9_cta', sel: '#cta-cuoi-trang' },
    { name: 'section_10_facility_partners', sel: 'section:nth-of-type(8)' },
    { name: 'section_11_footer', sel: 'footer' }
  ];

  for (const s of sections) {
    try {
      const el = await page.$(s.sel);
      if (el) {
        await page.evaluate(element => {
          element.scrollIntoView({ block: 'center' });
        }, el);
        await new Promise(r => setTimeout(r, 200));
        const p = `C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cfab6cee-0d29-42b2-9b09-bea16f5d5c63\\${s.name}.png`;
        await el.screenshot({ path: p });
        console.log(`Saved ${s.name}:`, fs.statSync(p).size);
      }
    } catch (e) {
      console.log(`Error taking ${s.name}:`, e.message);
    }
  }

  // 2. Tablet (768x1024)
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  const tabletPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cfab6cee-0d29-42b2-9b09-bea16f5d5c63\\wanders_home_tablet.png';
  await page.screenshot({ path: tabletPath, fullPage: true });
  console.log('Saved tablet screenshot:', fs.statSync(tabletPath).size);

  // 3. Mobile (390x844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  const mobilePath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cfab6cee-0d29-42b2-9b09-bea16f5d5c63\\wanders_home_mobile.png';
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log('Saved mobile screenshot:', fs.statSync(mobilePath).size);

  console.log('Total console errors:', errors.length);
  if (errors.length > 0) console.log(errors);

  await browser.close();
})();
