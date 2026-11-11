const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIR = path.resolve(__dirname, '../website_download/images/introl');
const FILES = [
  '01_W.png', '02_A.png', '03_N.png', '04_D.png', '05_E.png', '06_R.png', '07_S.png',
  '01_paint_impact.png', '02_paint_explosion.png', '03_liquid_ribbons.png', '04_paint_transition.png'
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });

  const results = [];
  for (const name of FILES) {
    const url = `http://localhost:3000/images/introl/${name}`;
    const res = await page.evaluate(async (imgUrl, fileName) => {
      const img = new Image();
      img.src = imgUrl;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let minX = width, maxX = 0, minY = height, maxY = 0, transparentPx = 0;
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          const a = data[(y * width + x) * 4 + 3];
          if (a < 20) transparentPx++;
          if (a > 20) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return {
        fileName,
        w: width,
        h: height,
        transparentRatio: +(transparentPx / ((width / 2) * (height / 2))).toFixed(3),
        bbox: { minX, maxX, minY, maxY, gw: maxX - minX, gh: maxY - minY }
      };
    }, url, name);
    results.push(res);
  }
  console.table(results.map(r => ({
    file: r.fileName,
    size: `${r.w}x${r.h}`,
    transp: r.transparentRatio,
    xRange: `${r.bbox.minX}..${r.bbox.maxX}`,
    yRange: `${r.bbox.minY}..${r.bbox.maxY}`,
    glyph: `${r.bbox.gw}x${r.bbox.gh}`
  })));
  await browser.close();
})();
