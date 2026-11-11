const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';

const PRODUCT_INFO = {
  'xika-bitum-chong-tham-san': {
    code: 'XI-KA BITUM',
    name: 'Chống thấm sàn XI-KA BITUM',
    img: 'product-xika-bitum.png',
    cat: 'son-chong-tham',
    desc: 'Vật liệu chống thấm gốc bitum dùng cho sàn và khu vực ẩm ướt.'
  },
  'waterproof-e5-we5': {
    code: 'CT-B5 XI MĂNG',
    name: 'Sơn chống thấm xi măng Waterproof CT-B5',
    img: 'product-ct-b5-xi-mang.png',
    cat: 'son-chong-tham',
    desc: 'Hợp chất chống thấm copolymer liên kết cực tốt với bê tông và vữa xi măng.'
  },
  'waterproof-nano-wnano': {
    code: 'CT-B5 MÀU',
    name: 'Sơn chống thấm màu Waterproof CT-B5',
    img: 'product-ct-b5-mau.png',
    cat: 'son-chong-tham',
    desc: 'Sơn chống thấm màu hệ nước cao cấp kết hợp trang trí, không cần sơn lót.'
  },
  'xika-lastic': {
    code: 'XIKA LASTIC',
    name: 'Sơn chống thấm lộ thiên XIKA LASTIC',
    img: 'product-xika-lastic.png',
    cat: 'son-chong-tham',
    desc: 'Sơn chống thấm đàn hồi lộ thiên chuyên dụng cho sân thượng, mái bê tông, sê nô.'
  },
  'phu-gia-chong-tham-latex-mh': {
    code: 'LATEX MH',
    name: 'Phụ gia chống thấm & tác nhân kết nối LATEX MH',
    img: 'product-latex-mh.png',
    cat: 'son-chong-tham',
    desc: 'Nhũ tương Polymer cải tiến tăng độ dẻo, độ bám dính và chống thấm cho vữa xi măng.'
  },
  'son-chong-nong-cn08': {
    code: 'CN08',
    name: 'Sơn chống nóng cao cấp CN08',
    img: 'product-son-chong-nong-cn08.png',
    cat: 'son-chong-nong',
    desc: 'Sơn cách nhiệt giảm nhiệt hiệu quả, phản xạ bức xạ nhiệt cho mái tôn và tường đứng.'
  },
  'son-chau-canh-cao-cap': {
    code: 'CHẬU CẢNH',
    name: 'Sơn chậu cảnh cao cấp MY HOUR',
    img: 'product-son-chau-canh.png',
    cat: 'san-pham-khac',
    desc: 'Sơn dùng cho chậu cảnh và vật liệu trang trí ngoài trời, bền màu 10 năm.'
  },
  'clear-nano-phu-bong': {
    code: 'CLEAR NANO',
    name: 'Sơn phủ bóng Clear Nano',
    img: 'product-clear-nano.png',
    cat: 'san-pham-khac',
    desc: 'Lớp phủ bóng bảo vệ bề mặt hoàn thiện, tăng độ bền và dễ vệ sinh.'
  },
  'son-nhu-cao-cap-mh9999': {
    code: 'MH9999',
    name: 'Sơn nhũ vàng cao cấp MH 9999',
    img: 'product-son-nhu-mh9999.png',
    cat: 'san-pham-khac',
    desc: 'Sơn nhũ hệ nước trang trí ánh kim vàng óng ánh cho công trình đặc biệt.'
  },
  'son-bong-2k': {
    code: '2K CLEAR',
    name: 'Sơn phủ bóng 2K MY HOUR (Clear & Hardner)',
    img: 'product-son-bong-2k.png',
    cat: 'san-pham-khac',
    desc: 'Sơn phủ bóng 2 thành phần siêu bóng, tăng độ cứng và bảo vệ chống trầy xước.'
  },
  'bot-ba-noi-ngoai-that-putty': {
    code: 'PUTTY INTER',
    name: 'Bột bả nội thất cao cấp Putty Inter & Exter',
    img: 'product-bot-ba-noi-that.png',
    cat: 'san-pham-khac',
    desc: 'Bột bả che lấp lỗ hổng và làm phẳng mịn bề mặt tường hồ vữa, bê tông.'
  },
  'bot-ba-ngoai-that-cao-cap': {
    code: 'PUTTY EXTER',
    name: 'Bột bả ngoại thất cao cấp Putty For Exterior',
    img: 'product-bot-ba-ngoai-that.png',
    cat: 'san-pham-khac',
    desc: 'Bột bả ngoại thất chịu thời tiết cao cấp, tăng độ bám dính lớp sơn phủ.'
  }
};

function injectCardThumbnail(html, slug, info, relPrefix) {
  const targetPattern = `href="${relPrefix}san-pham/${slug}/index.html"`;
  let idx = 0;
  while ((idx = html.indexOf(targetPattern, idx)) !== -1) {
    const aTagEnd = html.indexOf('>', idx);
    const aClose = html.indexOf('</a>', idx);
    const cardContent = html.substring(aTagEnd + 1, aClose);
    
    // Check if thumbnail already injected
    if (!cardContent.includes('<img')) {
      const thumbHtml = `\n    <div class="aspect-[4/3] w-full mb-4 flex items-center justify-center bg-brand-ivory/50 p-3 overflow-hidden rounded-[2px] border border-brand-line/40">\n      <img src="${relPrefix}images/${info.img}" alt="${info.name}" class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />\n    </div>\n    `;
      html = html.substring(0, aTagEnd + 1) + thumbHtml + html.substring(aTagEnd + 1);
      console.log(`Injected thumbnail into card: ${slug}`);
    }
    idx = aClose + 4;
  }
  return html;
}

function addCardIfMissing(html, slug, info, relPrefix, category) {
  if (html.includes(`san-pham/${slug}/index.html`)) return html;
  
  const cardHtml = `
<a class="group flex flex-col bg-white p-5 transition-colors hover:bg-brand-canvas" href="${relPrefix}san-pham/${slug}/index.html" data-discover="true">
  <div class="aspect-[4/3] w-full mb-4 flex items-center justify-center bg-brand-ivory/50 p-3 overflow-hidden rounded-[2px] border border-brand-line/40">
    <img src="${relPrefix}images/${info.img}" alt="${info.name}" class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
  </div>
  <span class="font-mono text-[11px] tracking-[0.14em] text-brand-green">${info.code}</span>
  <span class="mt-3 font-heading text-[15px] font-semibold leading-snug text-brand-ink">${info.name}</span>
  <span class="mt-2 flex-1 text-[13px] leading-relaxed text-brand-slate">${info.desc}</span>
  <span class="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-brand-green">Chi tiết<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>
</a>
`;

  // Find the grid container and insert before closing
  const gridMarker = 'grid gap-px bg-brand-line';
  const gridIdx = html.indexOf(gridMarker);
  if (gridIdx !== -1) {
    const gridEnd = html.indexOf('</div>', gridIdx);
    html = html.substring(0, gridEnd) + cardHtml + html.substring(gridEnd);
    console.log(`Added missing card: ${slug}`);
  }
  return html;
}

// 1. Process san-pham/son-chong-tham/index.html
const ctPath = path.join(baseDir, 'san-pham/son-chong-tham/index.html');
if (fs.existsSync(ctPath)) {
  let ctHtml = fs.readFileSync(ctPath, 'utf8');
  for (const [slug, info] of Object.entries(PRODUCT_INFO)) {
    if (info.cat === 'son-chong-tham') {
      ctHtml = injectCardThumbnail(ctHtml, slug, info, '../../');
      ctHtml = addCardIfMissing(ctHtml, slug, info, '../../', 'son-chong-tham');
    }
  }
  fs.writeFileSync(ctPath, ctHtml, 'utf8');
}

// 2. Process san-pham/san-pham-khac/index.html
const spkPath = path.join(baseDir, 'san-pham/san-pham-khac/index.html');
if (fs.existsSync(spkPath)) {
  let spkHtml = fs.readFileSync(spkPath, 'utf8');
  for (const [slug, info] of Object.entries(PRODUCT_INFO)) {
    if (info.cat === 'san-pham-khac') {
      spkHtml = injectCardThumbnail(spkHtml, slug, info, '../../');
      spkHtml = addCardIfMissing(spkHtml, slug, info, '../../', 'san-pham-khac');
    }
  }
  fs.writeFileSync(spkPath, spkHtml, 'utf8');
}

// 3. Process san-pham/son-chong-nong/index.html
const cnPath = path.join(baseDir, 'san-pham/son-chong-nong/index.html');
if (fs.existsSync(cnPath)) {
  let cnHtml = fs.readFileSync(cnPath, 'utf8');
  cnHtml = injectCardThumbnail(cnHtml, 'son-chong-nong-cn08', PRODUCT_INFO['son-chong-nong-cn08'], '../../');
  fs.writeFileSync(cnPath, cnHtml, 'utf8');
}

// 4. Process san-pham/index.html (All Products)
const allPath = path.join(baseDir, 'san-pham/index.html');
if (fs.existsSync(allPath)) {
  let allHtml = fs.readFileSync(allPath, 'utf8');
  for (const [slug, info] of Object.entries(PRODUCT_INFO)) {
    allHtml = injectCardThumbnail(allHtml, slug, info, '../');
    allHtml = addCardIfMissing(allHtml, slug, info, '../', 'all');
  }
  fs.writeFileSync(allPath, allHtml, 'utf8');
}

console.log('Cards update finished!');

