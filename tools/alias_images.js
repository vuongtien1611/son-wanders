const fs = require('fs');
const path = require('path');

const imgDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/images';

const imageMap = {
  'product-ct-b5-xi-mang.png': 'ChatGPT Image Nov 5, 2026, 09_19_01 PM-1.png',
  'product-ct-b5-mau.png': 'ChatGPT Image Nov 5, 2026, 09_19_02 PM-2.png',
  'product-xika-bitum.png': 'ChatGPT Image Nov 5, 2026, 09_19_02 PM-3.png',
  'product-xika-lastic.png': 'ChatGPT Image Nov 5, 2026, 09_19_03 PM-4.png',
  'product-son-chong-nong-cn08.png': 'ChatGPT Image Nov 5, 2026, 09_19_04 PM-5.png',
  'product-son-nhu-mh9999.png': 'ChatGPT Image Nov 5, 2026, 09_19_04 PM-6.png',
  'product-clear-nano.png': 'ChatGPT Image Nov 5, 2026, 09_19_05 PM-7.png',
  'product-son-bong-2k.png': 'ChatGPT Image Nov 5, 2026, 09_19_06 PM-8.png',
  'product-bot-ba-noi-that.png': 'ChatGPT Image Nov 5, 2026, 09_19_07 PM-9.png',
  'product-bot-ba-ngoai-that.png': 'ChatGPT Image Nov 5, 2026, 09_19_08 PM-10.png',
  'product-latex-mh.png': '35658efa-0157-4ecb-b0c9-526faddd2e1e.png',
  'product-son-chau-canh.png': 'Premium Blue Paint Bucket Packaging.png'
};

for (const [cleanName, srcName] of Object.entries(imageMap)) {
  const srcPath = path.join(imgDir, srcName);
  const destPath = path.join(imgDir, cleanName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${cleanName}`);
  } else {
    console.error(`Source not found: ${srcName}`);
  }
}

