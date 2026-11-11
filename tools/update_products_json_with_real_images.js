const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../website_download/data');
const jsonPath = path.join(dataDir, 'wanders_products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Exact mapping from sheet to product code
const sheetToImage = {
  'IN 3': 'images/products/wanders-in-3.jpeg',
  'IN 525': 'images/products/wanders-in-525.jpeg',
  'IN 626': 'images/products/wanders-in-626.jpeg',
  'IN 828': 'images/products/wanders-in-828.jpeg',
  'IN 929': 'images/products/wanders-in-929.jpeg',
  'EX 555': 'images/products/wanders-ex-555.jpeg',
  'EX 777': 'images/products/wanders-ex-777.jpeg',
  'EX999': 'images/products/wanders-ex999.jpeg',
  'Lót đă năng': 'images/products/wanders-lot-da-nang.jpeg',
  'Kiềm nội': 'images/products/wanders-kiem-noi.jpeg',
  'Kiềm ngoại': 'images/products/wanders-kiem-ngoai.jpeg',
  'Siêu liên kết': 'images/products/wanders-sieu-lien-ket.jpeg',
  'CT xi măng': 'images/products/wanders-ct-xi-mang.jpeg',
  'CT màu': 'images/products/wanders-ct-mau.jpeg',
  'CT Bitum': 'images/products/wanders-ct-bitum.jpeg',
  'CT lộ thiên': 'images/products/wanders-ct-lo-thien.jpeg',
  'Chống nóng': 'images/products/wanders-chong-nong.png',
  'Nhũ vàng': 'images/products/wanders-nhu-vang.jpeg',
  'Bóng Clear': 'images/products/wanders-bong-clear.jpeg',
  '2K': 'images/products/wanders-2k.jpeg',
  'Bột bả nội': 'images/products/wanders-bot-ba-noi.jpeg',
  'Bột bả ngoại': 'images/products/wanders-bot-ba-ngoai.jpeg',
  'Latex': 'images/products/wanders-latex.jpeg',
  'Sheet1': 'images/products/wanders-sheet1.jpeg'
};

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
  const img = codeToImage[p.code];
  if (img) {
    p.image = img;
    p.image_url = img;
    p.image_path = img;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf8');
console.log('Updated wanders_products.json with all 24 real images!');

// Also copy each to images/ directly for flat reference
const baseImgDir = path.join(__dirname, '../website_download/images');
const prodImgDir = path.join(baseImgDir, 'products');
fs.readdirSync(prodImgDir).forEach(f => {
  fs.copyFileSync(path.join(prodImgDir, f), path.join(baseImgDir, f));
});
console.log('Mirrored images to website_download/images/ directly!');

