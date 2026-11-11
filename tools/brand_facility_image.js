const puppeteer = require('../node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1719, height: 1650 });
  
  const imgUrl = 'http://localhost:3000/images/027_3e3b1c190_myhour-facility.png';
  
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;overflow:hidden;">
    <canvas id="c" width="1719" height="1650"></canvas>
    <script>
      const img = new Image();
      img.src = "${imgUrl}";
      img.onload = () => {
        const c = document.getElementById('c');
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // 1. Tank logo overlay
        // In the tank area around x: 230 to 470, y: 840 to 920:
        // Sample metal gradient to blend
        const grad = ctx.createLinearGradient(200, 840, 500, 930);
        grad.addColorStop(0, '#A6ACB2');
        grad.addColorStop(0.5, '#BDC3C9');
        grad.addColorStop(1, '#9AA0A6');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(220, 840, 270, 75, 8);
        ctx.fill();
        
        // Metal texture highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(220, 840, 270, 20);
        
        // Draw WANDERS text on tank
        ctx.fillStyle = '#0F4C3A';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('WANDERS', 355, 878);
        
        // 2. Engineer coat overlay (around x: 140 to 240, y: 1460 to 1530)
        ctx.fillStyle = '#E2E5E8';
        ctx.beginPath();
        ctx.roundRect(145, 1470, 100, 38, 6);
        ctx.fill();
        
        ctx.fillStyle = '#0F4C3A';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('WANDERS', 195, 1489);

        window.renderDone = true;
      };
    </script>
  </body></html>`);

  await page.waitForFunction('window.renderDone === true');
  
  const canvasEl = await page.$('#c');
  const outPath = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/images/facility-wanders.png';
  await canvasEl.screenshot({ path: outPath });
  console.log('Saved facility-wanders.png. Size:', fs.statSync(outPath).size);

  await browser.close();
})();
