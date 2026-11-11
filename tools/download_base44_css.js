const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  const cssUrls = [];
  page.on('response', resp => {
    if (resp.request().resourceType() === 'stylesheet') {
      cssUrls.push(resp.url());
    }
  });

  await page.goto('https://wanders-color-lab.base44.app/', { waitUntil: 'networkidle2' });
  console.log('CSS URLs found:', cssUrls);

  for (let i = 0; i < cssUrls.length; i++) {
    const u = cssUrls[i];
    try {
      const cssText = await page.evaluate(async (url) => {
        const res = await fetch(url);
        return res.text();
      }, u);
      const outPath = path.join(__dirname, `../audit_base44/base44_style_${i}.css`);
      fs.writeFileSync(outPath, cssText);
      console.log(`Saved CSS ${i} (size: ${cssText.length})`);
    } catch (e) {
      console.error(`Error fetching CSS ${i}:`, e.message);
    }
  }

  // Also check inline <style> tags
  const inlineStyles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('style')).map(s => s.innerHTML);
  });
  console.log(`Found ${inlineStyles.length} inline <style> tags`);
  inlineStyles.forEach((st, idx) => {
    fs.writeFileSync(path.join(__dirname, `../audit_base44/inline_style_${idx}.css`), st);
  });

  await browser.close();
})();

