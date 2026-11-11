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

    const headerMetrics = await page.evaluate(() => {
      const headerInner = document.querySelector('header > div');
      const logo = document.querySelector('header a');
      const cta = document.querySelector('header .bg-\\[\\#0F4C3A\\]') || document.querySelector('header a[href*="lien-he"]');
      const hStyle = window.getComputedStyle(headerInner);

      return {
        headerInnerRect: headerInner.getBoundingClientRect(),
        logoRect: logo ? logo.getBoundingClientRect() : null,
        ctaRect: cta ? cta.getBoundingClientRect() : null,
        maxWidth: hStyle.maxWidth,
        paddingLeft: hStyle.paddingLeft,
        paddingRight: hStyle.paddingRight,
        marginLeft: hStyle.marginLeft,
        marginRight: hStyle.marginRight
      };
    });

    console.log(`\n=== Viewport: ${w}px ===`);
    console.log('Header inner rect:', headerMetrics.headerInnerRect);
    console.log('Header inner style:', {
      maxWidth: headerMetrics.maxWidth,
      paddingLeft: headerMetrics.paddingLeft,
      paddingRight: headerMetrics.paddingRight
    });
    console.log('Logo left:', headerMetrics.logoRect ? headerMetrics.logoRect.left : 'N/A');
    console.log('CTA right:', headerMetrics.ctaRect ? headerMetrics.ctaRect.right : 'N/A');
  }

  await browser.close();
})();

