const puppeteer = require('../node_modules/puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=1']
  });

  const page = await browser.newPage();
  
  for (let w of [1440, 1280, 1024, 768, 390]) {
    await page.setViewport({ width: w, height: 900 });
    await page.goto('http://localhost:3000/bang-mau/', { waitUntil: 'networkidle2' });

    const m = await page.evaluate(() => {
      const headerInner = document.querySelector('header > div');
      const logo = document.querySelector('header a');
      const cta = document.querySelector('header .bg-\\[\\#0F4C3A\\]') || document.querySelector('header a[href*="lien-he"]');
      const hStyle = window.getComputedStyle(headerInner);
      const r = headerInner.getBoundingClientRect();
      const lr = logo ? logo.getBoundingClientRect() : null;
      const cr = cta ? cta.getBoundingClientRect() : null;

      return {
        headerLeft: r.left,
        headerRight: r.right,
        headerWidth: r.width,
        contentLeft: r.left + parseFloat(hStyle.paddingLeft),
        contentRight: r.right - parseFloat(hStyle.paddingRight),
        contentWidth: r.width - parseFloat(hStyle.paddingLeft) - parseFloat(hStyle.paddingRight),
        logoLeft: lr ? lr.left : null,
        ctaRight: cr ? cr.right : null,
        maxWidth: hStyle.maxWidth,
        paddingLeft: hStyle.paddingLeft,
        paddingRight: hStyle.paddingRight
      };
    });

    console.log(`\n=== Viewport: ${w}px ===`);
    console.log(`  Header Box: [left=${m.headerLeft}, right=${m.headerRight}, width=${m.headerWidth}]`);
    console.log(`  Padding: L=${m.paddingLeft}, R=${m.paddingRight}`);
    console.log(`  Content Inner: [left=${m.contentLeft}, right=${m.contentRight}, width=${m.contentWidth}]`);
    console.log(`  Logo Left: ${m.logoLeft} (diff from contentLeft: ${m.logoLeft - m.contentLeft}px)`);
    console.log(`  CTA Right: ${m.ctaRight} (diff from contentRight: ${m.ctaRight - m.contentRight}px)`);
  }

  await browser.close();
})();

