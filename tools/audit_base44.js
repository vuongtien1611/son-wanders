const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://wanders-color-lab.base44.app';
const AUDIT_DIR = path.join(__dirname, '../audit_base44');
const SCREENSHOTS_DIR = path.join(AUDIT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

(async () => {
  console.log('--- STARTING BASE44 AUDIT ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 45000 });

  // 1. Discover all links & routes on Base44
  const discoveredLinks = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors.map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText.trim().replace(/\s+/g, ' '),
      fullUrl: a.href
    })).filter(l => l.href && !l.href.startsWith('#') && !l.href.startsWith('mailto:') && !l.href.startsWith('tel:'));
  });

  console.log('Total internal/external links found on homepage:', discoveredLinks.length);
  fs.writeFileSync(path.join(AUDIT_DIR, 'discovered_links.json'), JSON.stringify(discoveredLinks, null, 2));

  // Extract unique internal paths
  const internalPaths = new Set(['/']);
  discoveredLinks.forEach(l => {
    try {
      const u = new URL(l.fullUrl);
      if (u.origin === 'https://wanders-color-lab.base44.app') {
        internalPaths.add(u.pathname);
      }
    } catch (e) {}
  });

  console.log('Unique internal routes discovered:', Array.from(internalPaths));

  // 2. Extract Design System Tokens from Home Page
  const designTokens = await page.evaluate(() => {
    const computed = window.getComputedStyle(document.body);
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).slice(0, 10).map(h => ({
      tag: h.tagName,
      text: h.innerText.substring(0, 40),
      fontFamily: window.getComputedStyle(h).fontFamily,
      fontSize: window.getComputedStyle(h).fontSize,
      fontWeight: window.getComputedStyle(h).fontWeight,
      color: window.getComputedStyle(h).color
    }));

    const buttons = Array.from(document.querySelectorAll('button, a[class*="btn"], a[role="button"]')).slice(0, 10).map(b => ({
      text: b.innerText.trim().substring(0, 30),
      bg: window.getComputedStyle(b).backgroundColor,
      color: window.getComputedStyle(b).color,
      borderRadius: window.getComputedStyle(b).borderRadius,
      padding: window.getComputedStyle(b).padding
    }));

    const containers = Array.from(document.querySelectorAll('div[class*="container"], main > div, section > div')).slice(0, 10).map(c => ({
      maxWidth: window.getComputedStyle(c).maxWidth,
      paddingLeft: window.getComputedStyle(c).paddingLeft,
      paddingRight: window.getComputedStyle(c).paddingRight
    }));

    return {
      bodyFont: computed.fontFamily,
      bodyColor: computed.color,
      bodyBg: computed.backgroundColor,
      headings,
      buttons,
      containers
    };
  });

  fs.writeFileSync(path.join(AUDIT_DIR, 'design_tokens.json'), JSON.stringify(designTokens, null, 2));
  console.log('Extracted design tokens.');

  // 3. Inspect sections on Home Page
  const homepageSections = await page.evaluate(() => {
    const sects = Array.from(document.querySelectorAll('header, section, footer, main > div'));
    return sects.map((s, idx) => ({
      index: idx,
      tag: s.tagName,
      id: s.id,
      className: s.className,
      rect: {
        width: s.getBoundingClientRect().width,
        height: s.getBoundingClientRect().height
      },
      heading: s.querySelector('h1, h2, h3')?.innerText.trim(),
      textSnippet: s.innerText.trim().substring(0, 150).replace(/\s+/g, ' ')
    }));
  });

  fs.writeFileSync(path.join(AUDIT_DIR, 'homepage_sections.json'), JSON.stringify(homepageSections, null, 2));
  console.log(`Audited ${homepageSections.length} sections on homepage.`);

  // 4. Screenshots & deep inspection for standard routes
  const standardRoutes = [
    { name: 'home', path: '/' },
    { name: 'san-pham', path: '/san-pham' },
    { name: 'bang-mau', path: '/bang-mau' },
    { name: 'du-an', path: '/du-an' },
    { name: 'gioi-thieu', path: '/gioi-thieu' },
    { name: 'lien-he', path: '/lien-he' }
  ];

  // Also check if there are other internal paths found
  internalPaths.forEach(p => {
    if (!standardRoutes.some(r => r.path === p) && p !== '/') {
      const cleanName = p.replace(/^\//, '').replace(/\//g, '_');
      standardRoutes.push({ name: cleanName, path: p });
    }
  });

  console.log(`Routes to audit and capture (${standardRoutes.length}):`, standardRoutes.map(r => r.path));

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  for (const r of standardRoutes) {
    const fullUrl = BASE_URL + r.path;
    console.log(`\nAuditing route: ${r.path} (${fullUrl})...`);
    
    // Page details collection
    let pageDetail = { route: r.path, title: '', headings: [], images: [], buttons: [], forms: [] };

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 35000 });
        // wait extra moment for animations / interactive components to settle
        await new Promise(res => setTimeout(res, 1200));

        if (vp.name === 'desktop') {
          pageDetail.title = await page.title();
          pageDetail.headings = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
              tag: h.tagName,
              text: h.innerText.trim().replace(/\s+/g, ' ')
            }));
          });
          pageDetail.images = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img')).map(img => ({
              src: img.src,
              alt: img.alt,
              w: img.naturalWidth || img.width,
              h: img.naturalHeight || img.height
            }));
          });
          pageDetail.htmlStructure = await page.evaluate(() => {
            return document.querySelector('main')?.innerHTML || document.body.innerHTML;
          });
        }

        const screenshotPath = path.join(SCREENSHOTS_DIR, `${r.name}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  Saved screenshot: ${r.name}_${vp.name}.png (${fs.statSync(screenshotPath).size} bytes)`);
      } catch (err) {
        console.error(`  Error capturing ${r.path} at ${vp.name}:`, err.message);
      }
    }

    fs.writeFileSync(path.join(AUDIT_DIR, `detail_${r.name}.json`), JSON.stringify({
      route: r.path,
      title: pageDetail.title,
      headings: pageDetail.headings,
      imagesCount: pageDetail.images.length,
      imagesSample: pageDetail.images.slice(0, 15)
    }, null, 2));

    if (pageDetail.htmlStructure) {
      fs.writeFileSync(path.join(AUDIT_DIR, `raw_${r.name}.html`), pageDetail.htmlStructure);
    }
  }

  await browser.close();
  console.log('\n--- BASE44 AUDIT COMPLETE ---');
})();

