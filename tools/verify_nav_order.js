const puppeteer = require('../node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    '/index.html',
    '/gioi-thieu.html',
    '/san-pham.html',
    '/bang-mau.html',
    '/du-an.html',
    '/lien-he.html',
    '/gioi-thieu/',
    '/san-pham/',
    '/bang-mau/'
  ];

  for (const r of routes) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle0' });
    const nav = await page.evaluate(() =>
      Array.from(document.querySelectorAll('header nav a')).map(a => ({
        text: a.innerText.trim(),
        active: a.getAttribute('data-status') === 'active' || !!a.querySelector('.w-full')
      }))
    );
    const mob = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#b44MobileMenuDrawer nav a')).map(a => a.innerText.trim())
    );
    console.log(r, 'Header:', nav.map(x => (x.active ? `[${x.text}]` : x.text)).join(' | '), 'Mobile:', mob.slice(0, 5).join(' | '));
  }

  await page.goto('http://localhost:3000/gioi-thieu.html', { waitUntil: 'networkidle0' });
  const headerEl = await page.$('header');
  await headerEl.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63/header_nav_reordered.png' });
  await browser.close();
})();

