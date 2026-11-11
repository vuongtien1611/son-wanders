const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../website_download');
const DATA_DIR = path.join(BASE_DIR, 'data');
const JSON_PATH = path.join(DATA_DIR, 'wanders_products.json');

console.log('=== STEP 1: Updating wanders_products.json with Authentic Excel Images ===');
const products = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const codeToImage = {
  'IN3*': 'images/products/wanders-in-3.jpeg',
  'IN525': 'images/products/wanders-in-525.jpeg',
  'IN626': 'images/products/wanders-in-626.jpeg',
  'IN828': 'images/products/wanders-in-828.jpeg',
  'IN929': 'images/products/wanders-in-929.jpeg',
  'EX555': 'images/products/wanders-ex-555.jpeg',
  'EX777': 'images/products/wanders-ex-777.jpeg',
  'EX999': 'images/products/wanders-ex999.jpeg',
  'LĐN 515': 'images/products/wanders-lot-da-nang.jpeg',
  'CK818': 'images/products/wanders-kiem-noi.jpeg',
  'CK919': 'images/products/wanders-kiem-ngoai.jpeg',
  'PRIMER NANOTECH': 'images/products/wanders-sieu-lien-ket.jpeg',
  'WATERPROOF-CT B5': 'images/products/wanders-ct-xi-mang.jpeg',
  'WATERPROOF-CT B5 MÀU': 'images/products/wanders-ct-mau.jpeg',
  'XIKA BITUM': 'images/products/wanders-ct-bitum.jpeg',
  'XIKA LASTIC': 'images/products/wanders-ct-lo-thien.jpeg',
  'CN08': 'images/products/wanders-chong-nong.png',
  'MH 9999': 'images/products/wanders-nhu-vang.jpeg',
  'CLEAR NANO': 'images/products/wanders-bong-clear.jpeg',
  'PHỦ BÓNG 2K': 'images/products/wanders-2k.jpeg',
  'PUTTY INTER': 'images/products/wanders-bot-ba-noi.jpeg',
  'PUTTY EXTER': 'images/products/wanders-bot-ba-ngoai.jpeg',
  'LATEX MH': 'images/products/wanders-latex.jpeg',
  'SƠN CHẬU CẢNH': 'images/products/wanders-sheet1.jpeg'
};

products.forEach(p => {
  const realImg = codeToImage[p.code];
  if (realImg) {
    p.image = realImg;
    p.image_url = realImg;
    p.image_path = realImg;
  }
});

fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf8');
console.log('Saved updated wanders_products.json.');

console.log('\n=== STEP 2: Updating All 24 Product Detail Pages ===');
let detailUpdatedCount = 0;

products.forEach(p => {
  const detailPath = path.join(BASE_DIR, p.link);
  if (!fs.existsSync(detailPath)) {
    console.warn(`Detail page not found: ${p.link}`);
    return;
  }

  let html = fs.readFileSync(detailPath, 'utf8');

  // Replace any existing img in product display area or placeholder
  // Check if there is an <img ...> in the product image container
  // Replace the image source with relative path "../../images/products/wanders-..."
  const relImg = '../../' + p.image;

  // Match main product image tag or container
  // 1. If there's an existing <img> tag inside the main section
  if (html.includes('<img') && html.includes('images/')) {
    html = html.replace(/<img[^>]+(images\/[^\"]+)[\"'][^>]*>/i, (match) => {
      return `<img src="${relImg}" alt="${p.name}" class="product-image h-full w-full object-contain object-center drop-shadow-lg transition-transform duration-300 hover:scale-105 p-4" style="width:100%;height:100%;object-fit:contain;object-position:center;">`;
    });
  } else if (html.includes('Ảnh sản phẩm đang cập nhật')) {
    // Replace placeholder
    const placeholderRegex = /<div class="flex flex-col items-center justify-center bg-brand-ivory aspect-\[4\/5\] w-full">[\s\S]*?Ảnh sản phẩm đang cập nhật<\/span><\/div>/;
    html = html.replace(placeholderRegex, `
      <div class="flex items-center justify-center bg-brand-ivory/60 aspect-[4/5] w-full overflow-hidden p-6 relative">
        <img src="${relImg}" alt="${p.name}" class="product-image h-full w-full object-contain object-center drop-shadow-lg" style="width:100%;height:100%;object-fit:contain;object-position:center;">
      </div>
    `);
  }

  // Ensure correct product code is displayed in subtitle/meta
  html = html.replace(/<span class="font-mono text-\[11px\] uppercase tracking-\[0\.2em\] text-brand-green">[^<]*<\/span>/, `<span class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-green">${p.code}</span>`);

  fs.writeFileSync(detailPath, html, 'utf8');
  detailUpdatedCount++;
});

console.log(`Updated ${detailUpdatedCount} product detail pages with real images!`);

console.log('\n=== STEP 3: Updating React Bundle Mapping ===');
const jsBundlePath = path.join(BASE_DIR, 'assets/index-BG3fZPr5.js');
if (fs.existsSync(jsBundlePath)) {
  let js = fs.readFileSync(jsBundlePath, 'utf8');

  // Build mapping from code and slug to real image
  const jsMapEntries = {};
  products.forEach(p => {
    jsMapEntries[p.code] = p.image;
    if (p.slug) jsMapEntries[p.slug] = p.image;
  });

  const mapJsonStr = JSON.stringify(jsMapEntries);
  // If _IMG_MAP exists in bundle, update it
  if (js.includes('var _IMG_MAP=')) {
    js = js.replace(/var _IMG_MAP=\{[\s\S]*?\};/, `var _IMG_MAP=${mapJsonStr};`);
    fs.writeFileSync(jsBundlePath, js, 'utf8');
    console.log('Updated _IMG_MAP in React bundle index-BG3fZPr5.js!');
  }
}

