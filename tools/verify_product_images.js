const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach(item => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(baseDir);
console.log(`Found ${htmlFiles.length} HTML files.`);

let totalImagesChecked = 0;
let missingImages = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fileDir = path.dirname(file);
  
  // Find all <img ... src="...">
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let m;
  while ((m = imgRegex.exec(content)) !== null) {
    const src = m[1];
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
      continue;
    }
    totalImagesChecked++;
    const resolvedPath = path.resolve(fileDir, src);
    if (!fs.existsSync(resolvedPath)) {
      missingImages.push({
        file: path.relative(baseDir, file).replace(/\\/g, '/'),
        src: src,
        resolved: resolvedPath
      });
    }
  }
});

console.log(`Total local images checked across all HTML files: ${totalImagesChecked}`);
if (missingImages.length === 0) {
  console.log('SUCCESS! ALL local image src attributes resolve to existing files on disk!');
} else {
  console.error(`Found ${missingImages.length} missing image references:`, missingImages);
}

// Check the 12 product pages specifically
const targetProducts = [
  'xika-bitum-chong-tham-san',
  'waterproof-e5-we5',
  'waterproof-nano-wnano',
  'xika-lastic',
  'phu-gia-chong-tham-latex-mh',
  'son-chong-nong-cn08',
  'son-chau-canh-cao-cap',
  'clear-nano-phu-bong',
  'son-nhu-cao-cap-mh9999',
  'son-bong-2k',
  'bot-ba-noi-ngoai-that-putty',
  'bot-ba-ngoai-that-cao-cap'
];

console.log('\n--- Checking 12 Product Detail Pages ---');
targetProducts.forEach(p => {
  const pPath = path.join(baseDir, 'san-pham', p, 'index.html');
  if (!fs.existsSync(pPath)) {
    console.error(`MISSING PAGE: san-pham/${p}/index.html`);
    return;
  }
  const content = fs.readFileSync(pPath, 'utf8');
  const hasImg = content.includes('images/product-') || content.includes('images/ChatGPT') || content.includes('images/Premium') || content.includes('images/35658');
  const hasPlaceholder = content.includes('Ảnh sản phẩm đang cập nhật');
  console.log(`- san-pham/${p}: hasImg=${hasImg}, hasPlaceholder=${hasPlaceholder}`);
});

