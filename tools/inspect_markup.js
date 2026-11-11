const fs = require('fs');

const detail = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/xika-bitum-chong-tham-san/index.html', 'utf8');

// Find where product image or placeholder is in detail page
const idx = detail.indexOf('Ảnh sản phẩm đang cập nhật');
if (idx !== -1) {
  console.log('Detail placeholder context:');
  console.log(detail.substring(idx - 250, idx + 150));
} else {
  console.log('No placeholder found in detail page');
}

// Check category listing page
const cat = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/son-chong-tham/index.html', 'utf8');
const catIdx = cat.indexOf('xika-bitum-chong-tham-san');
if (catIdx !== -1) {
  console.log('Category card context:');
  console.log(cat.substring(catIdx - 200, catIdx + 400));
}

