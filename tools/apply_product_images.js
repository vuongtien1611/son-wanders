const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';
const jsPath = path.join(baseDir, 'assets/index-BG3fZPr5.js');

// 1. PRODUCT IMAGES DEFINITION & MAPPING
const PRODUCT_INFO = {
  'xika-bitum-chong-tham-san': {
    code: 'XI-KA BITUM',
    name: 'Sơn chống thấm sàn XI-KA BITUM',
    img: 'product-xika-bitum.png',
    cat: 'son-chong-tham',
    desc: 'Hợp chất chống thấm Bitum polymer cải tiến gốc nước 1 thành phần thi công nguội cho sàn mái, ban công, toilet.'
  },
  'waterproof-e5-we5': {
    code: 'CT-B5',
    name: 'Sơn chống thấm xi măng Waterproof CT-B5',
    img: 'product-ct-b5-xi-mang.png',
    cat: 'son-chong-tham',
    desc: 'Hợp chất chống thấm kết hợp xi măng copolymer bám dính cực tốt, chống thấm hoàn hảo cho bê tông và vữa xây.'
  },
  'waterproof-nano-wnano': {
    code: 'CT-B5 MÀU',
    name: 'Sơn chống thấm màu Waterproof CT-B5',
    img: 'product-ct-b5-mau.png',
    cat: 'son-chong-tham',
    desc: 'Sơn chống thấm màu hệ nước hai dòng nhựa Pure Acrylic và PU, màng sơn co dãn kháng kiềm, chống UV, không cần lót.'
  },
  'xika-lastic': {
    code: 'XIKA LASTIC',
    name: 'Sơn chống thấm lộ thiên XIKA LASTIC',
    img: 'product-xika-lastic.png',
    cat: 'son-chong-tham',
    desc: 'Dòng sơn chống thấm đàn hồi lộ thiên chuyên dụng cho sân thượng, mái bê tông, sê nô chịu nắng mưa trực tiếp.'
  },
  'phu-gia-chong-tham-latex-mh': {
    code: 'LATEX MH',
    name: 'Phụ gia chống thấm & tác nhân kết nối LATEX MH',
    img: 'product-latex-mh.png',
    cat: 'son-chong-tham',
    desc: 'Phụ gia nhũ tương Polymer tăng độ bám dính, độ dẻo dai và chống thấm cho vữa xi măng, kết nối bê tông cũ và mới.'
  },
  'son-chong-nong-cn08': {
    code: 'CN08',
    name: 'Sơn chống nóng cao cấp CN08',
    img: 'product-son-chong-nong-cn08.png',
    cat: 'son-chong-nong',
    desc: 'Sơn cách nhiệt giảm nhiệt hiệu quả chịu khí hậu nóng bức, ngăn cản truyền nhiệt và phản xạ ánh sáng cho mái và tường.'
  },
  'son-chau-canh-cao-cap': {
    code: 'CHẬU CẢNH',
    name: 'Sơn chậu cảnh cao cấp MY HOUR',
    img: 'product-son-chau-canh.png',
    cat: 'san-pham-khac',
    desc: 'Sơn chuyên dụng trang trí chậu cảnh ngoài trời, độ bền màu cao, bóng đẹp và kháng kiềm chịu thời tiết.'
  },
  'clear-nano-phu-bong': {
    code: 'CLEAR NANO',
    name: 'Sơn phủ bóng Clear Nano',
    img: 'product-clear-nano.png',
    cat: 'san-pham-khac',
    desc: 'Sơn dầu bóng trang trí dùng trong và ngoài nhà, phản chiếu ánh sáng, màng Polymer liên tục chống thấm xâm nhập.'
  },
  'son-nhu-cao-cap-mh9999': {
    code: 'MH9999',
    name: 'Sơn nhũ vàng cao cấp MH 9999',
    img: 'product-son-nhu-mh9999.png',
    cat: 'san-pham-khac',
    desc: 'Sơn nhũ hệ nước hiệu ứng ánh kim vàng óng ánh đẳng cấp cho đền chùa, công trình tôn giáo, khách sạn, biệt thự.'
  },
  'son-bong-2k': {
    code: '2K CLEAR',
    name: 'Sơn phủ bóng 2K MY HOUR (Clear & Hardner)',
    img: 'product-son-bong-2k.png',
    cat: 'san-pham-khac',
    desc: 'Sơn phủ bóng hai thành phần cao cấp, màng bảo vệ trong suốt siêu bóng, tăng cường độ cứng và chống trầy xước.'
  },
  'bot-ba-noi-ngoai-that-putty': {
    code: 'PUTTY INTER',
    name: 'Bột bả nội thất cao cấp Putty Inter & Exter',
    img: 'product-bot-ba-noi-that.png',
    cat: 'san-pham-khac',
    desc: 'Bột bả tường chất lượng cao che lấp lỗ hổng, vết nứt nhỏ và làm phẳng mịn bề mặt tường trước khi sơn lót.'
  },
  'bot-ba-ngoai-that-cao-cap': {
    code: 'PUTTY EXTER',
    name: 'Bột bả ngoại thất cao cấp Putty For Exterior',
    img: 'product-bot-ba-ngoai-that.png',
    cat: 'san-pham-khac',
    desc: 'Bột trét mastic ngoại thất dẻo mịn bám dính cao, che lấp khe nứt, chịu thời tiết và tăng độ bám dính lớp sơn phủ.'
  }
};

// 2. UPDATE REACT JS BUNDLE
console.log('--- 1. Updating JS bundle ---');
let js = fs.readFileSync(jsPath, 'utf8');

// Replace F_ component
const oldFRegex = /function F_\(\{product:e,className:t\}\)\{return e\?\.image\?\(0,j\.jsx\)\(Z,\{src:e\.image,alt:e\.name,className:Kr\(`h-full w-full`,t\),fittingType:`fit`\}\):\(0,j\.jsxs\)\(`div`,\{className:Kr\(`flex flex-col items-center justify-center bg-brand-ivory`,t\),children:\[\(0,j\.jsx\)\(`span`,\{className:`font-mono text-\[11px\] uppercase tracking-\[0\.2em\] text-brand-green`,children:e\?\.code\}\),\(0,j\.jsx\)\(`span`,\{className:`mt-3 h-px w-8 bg-brand-line`\}\),\(0,j\.jsx\)\(`span`,\{className:`mt-3 px-4 text-center text-\[11px\] leading-snug text-brand-slate\/80`,children:`Ảnh sản phẩm đang cập nhật`\}\)\]\}\)\}/;

const newFCode = `var _IMG_MAP={
  'xika-bitum-chong-tham-san':'product-xika-bitum.png',
  'XI-KA BITUM':'product-xika-bitum.png',
  'waterproof-e5-we5':'product-ct-b5-xi-mang.png',
  'WE5':'product-ct-b5-xi-mang.png',
  'waterproof-nano-wnano':'product-ct-b5-mau.png',
  'WNANO':'product-ct-b5-mau.png',
  'xika-lastic':'product-xika-lastic.png',
  'XIKA LASTIC':'product-xika-lastic.png',
  'phu-gia-chong-tham-latex-mh':'product-latex-mh.png',
  'LATEX MH':'product-latex-mh.png',
  'son-chong-nong-cn08':'product-son-chong-nong-cn08.png',
  'CN08':'product-son-chong-nong-cn08.png',
  'son-chau-canh-cao-cap':'product-son-chau-canh.png',
  'CHẬU CẢNH':'product-son-chau-canh.png',
  'clear-nano-phu-bong':'product-clear-nano.png',
  'CLEAR NANO':'product-clear-nano.png',
  'son-nhu-cao-cap-mh9999':'product-son-nhu-mh9999.png',
  'MH9999':'product-son-nhu-mh9999.png',
  'son-bong-2k':'product-son-bong-2k.png',
  '2K':'product-son-bong-2k.png',
  'bot-ba-noi-ngoai-that-putty':'product-bot-ba-noi-that.png',
  'PUTTY INTER & EXTER':'product-bot-ba-noi-that.png',
  'bot-ba-ngoai-that-cao-cap':'product-bot-ba-ngoai-that.png',
  'PUTTY FOR EXTERIOR':'product-bot-ba-ngoai-that.png'
};
function F_({product:e,className:t}){
  var _fn=_IMG_MAP[e?.slug]||_IMG_MAP[e?.code]||e?.image;
  if(_fn){
    var _scr=(typeof document!=='undefined'&&document.querySelector('script[src*=\"assets/index-\"]'))?document.querySelector('script[src*=\"assets/index-\"]').getAttribute('src').replace(/assets\\/.*$/,''):'./';
    var _fullSrc=(_fn.startsWith('http')||_fn.startsWith('/')||_fn.startsWith('.'))?_fn:(_scr+'images/'+_fn);
    return (0,j.jsx)(\"div\",{className:Kr(\"flex items-center justify-center bg-brand-ivory/60 p-4 overflow-hidden relative group/prodimg\",t),children:(0,j.jsx)(\"img\",{src:_fullSrc,alt:e?.name||'',loading:\"lazy\",className:\"max-h-full max-w-full object-contain transition-transform duration-300 group-hover/prodimg:scale-105 drop-shadow-md\"})});
  }
  return (0,j.jsxs)(\"div\",{className:Kr(\"flex flex-col items-center justify-center bg-brand-ivory\",t),children:[(0,j.jsx)(\"span\",{className:\"font-mono text-[11px] uppercase tracking-[0.2em] text-brand-green\",children:e?.code}),(0,j.jsx)(\"span\",{className:\"mt-3 h-px w-8 bg-brand-line\"}),(0,j.jsx)(\"span\",{className:\"mt-3 px-4 text-center text-[11px] leading-snug text-brand-slate/80\",children:\"Ảnh sản phẩm đang cập nhật\"})]});
}`;

if (oldFRegex.test(js)) {
  js = js.replace(oldFRegex, newFCode);
  console.log('Successfully replaced F_ in JS bundle!');
} else {
  console.log('Old F_ regex did not match directly, trying manual slice replace...');
  const fIdx = js.indexOf('function F_({product:e,className:t}){return e?.image');
  const fEnd = js.indexOf(')]})}var I_=', fIdx);
  if (fIdx !== -1 && fEnd !== -1) {
    js = js.substring(0, fIdx) + newFCode + js.substring(fEnd + 5);
    console.log('Successfully replaced F_ via index slice!');
  } else {
    console.error('Could not locate F_ in JS bundle!');
  }
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Saved JS bundle.');

// 3. CREATE HTML REPLACEMENT HELPER
function generateImageMarkup(relImgSrc, productName) {
  return `<div class="flex items-center justify-center bg-brand-ivory/60 aspect-[4/5] w-full overflow-hidden p-4 relative group/prodimg"><img src="${relImgSrc}" alt="${productName}" class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover/prodimg:scale-105 drop-shadow-md" loading="lazy" /></div>`;
}

// 4. UPDATE PRODUCT DETAIL PAGES
console.log('--- 2. Updating Product Detail Pages ---');
const detailPages = [
  { slug: 'xika-bitum-chong-tham-san', info: PRODUCT_INFO['xika-bitum-chong-tham-san'] },
  { slug: 'waterproof-e5-we5', info: PRODUCT_INFO['waterproof-e5-we5'] },
  { slug: 'waterproof-nano-wnano', info: PRODUCT_INFO['waterproof-nano-wnano'] },
  { slug: 'son-chong-nong-cn08', info: PRODUCT_INFO['son-chong-nong-cn08'] },
  { slug: 'son-chau-canh-cao-cap', info: PRODUCT_INFO['son-chau-canh-cao-cap'] },
  { slug: 'clear-nano-phu-bong', info: PRODUCT_INFO['clear-nano-phu-bong'] },
  { slug: 'son-nhu-cao-cap-mh9999', info: PRODUCT_INFO['son-nhu-cao-cap-mh9999'] },
  { slug: 'bot-ba-noi-ngoai-that-putty', info: PRODUCT_INFO['bot-ba-noi-ngoai-that-putty'] }
];

detailPages.forEach(({ slug, info }) => {
  const filePath = path.join(baseDir, 'san-pham', slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Replace the placeholder container in detail page
  // The placeholder looks like:
  // <div class="flex flex-col items-center justify-center bg-brand-ivory aspect-[4/5] w-full"><span class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-green">...</span><span class="mt-3 h-px w-8 bg-brand-line"></span><span class="mt-3 px-4 text-center text-[11px] leading-snug text-brand-slate/80">Ảnh sản phẩm đang cập nhật</span></div>
  const placeholderRegex = /<div class="flex flex-col items-center justify-center bg-brand-ivory aspect-\[4\/5\] w-full"><span class="font-mono text-\[11px\] uppercase tracking-\[0\.2em\] text-brand-green">[^<]*<\/span><span class="mt-3 h-px w-8 bg-brand-line"><\/span><span class="mt-3 px-4 text-center text-\[11px\] leading-snug text-brand-slate\/80">Ảnh sản phẩm đang cập nhật<\/span><\/div>/;
  
  const newImgHtml = generateImageMarkup(`../../images/${info.img}`, info.name);
  if (placeholderRegex.test(html)) {
    html = html.replace(placeholderRegex, newImgHtml);
    console.log(`Updated detail page image for ${slug}`);
  } else {
    console.warn(`Placeholder not matched in ${slug}, trying relaxed match`);
    const relaxedRegex = /<div class="flex flex-col items-center justify-center bg-brand-ivory aspect-\[4\/5\] w-full">[\s\S]*?Ảnh sản phẩm đang cập nhật<\/span><\/div>/;
    if (relaxedRegex.test(html)) {
      html = html.replace(relaxedRegex, newImgHtml);
      console.log(`Updated detail page image for ${slug} (relaxed match)`);
    }
  }

  // Also update product title if needed
  if (slug === 'waterproof-e5-we5') {
    html = html.replace(/<h1 class="font-heading text-\[30px\] font-bold leading-tight tracking-tight text-brand-ink lg:text-\[38px\]">Waterproof E5<\/h1>/, `<h1 class="font-heading text-[30px] font-bold leading-tight tracking-tight text-brand-ink lg:text-[38px]">${info.name}</h1>`);
  }
  if (slug === 'waterproof-nano-wnano') {
    html = html.replace(/<h1 class="font-heading text-\[30px\] font-bold leading-tight tracking-tight text-brand-ink lg:text-\[38px\]">Waterproof Nano<\/h1>/, `<h1 class="font-heading text-[30px] font-bold leading-tight tracking-tight text-brand-ink lg:text-[38px]">${info.name}</h1>`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
});

// 5. CREATE THE 4 MISSING PRODUCT DETAIL PAGES
console.log('--- 3. Creating 4 missing product detail pages ---');
const templateDetailPath = path.join(baseDir, 'san-pham', 'xika-bitum-chong-tham-san', 'index.html');
const templateDetail = fs.readFileSync(templateDetailPath, 'utf8');

const missingProducts = [
  {
    slug: 'xika-lastic',
    info: PRODUCT_INFO['xika-lastic'],
    catName: 'Sơn chống thấm',
    catSlug: 'son-chong-tham',
    specs: [
      { label: 'Thành phần', val: 'Nhựa chống thấm Polyurethane & Acrylic biến tính cao cấp' },
      { label: 'Đặc tính', val: 'Kháng tia UV, đàn hồi cao, chịu thời tiết khắc nghiệt' },
      { label: 'Ứng dụng', val: 'Sân thượng, ban công, sê nô, mái bê tông lộ thiên' },
      { label: 'Độ phủ', val: '1.2 - 1.5 kg/m²/2 lớp hoàn thiện' },
      { label: 'Quy cách', val: 'Thùng 5 Kg và 20 Kg' }
    ]
  },
  {
    slug: 'phu-gia-chong-tham-latex-mh',
    info: PRODUCT_INFO['phu-gia-chong-tham-latex-mh'],
    catName: 'Sơn chống thấm',
    catSlug: 'son-chong-tham',
    specs: [
      { label: 'Thành phần', val: 'Nhũ tương Polymer cải tiến, phụ gia tăng cường liên kết' },
      { label: 'Đặc tính', val: 'Tăng cường bám dính, giảm co ngót nứt nẻ, chống thấm sâu' },
      { label: 'Ứng dụng', val: 'Hồ dầu kết nối bê tông cũ/mới, phụ gia vữa chống thấm' },
      { label: 'Tỷ lệ pha', val: 'Latex MH : Nước : Xi măng theo hướng dẫn kỹ thuật' },
      { label: 'Quy cách', val: 'Can 5 Lít và Can 25 Lít' }
    ]
  },
  {
    slug: 'son-bong-2k',
    info: PRODUCT_INFO['son-bong-2k'],
    catName: 'Sản phẩm khác',
    catSlug: 'san-pham-khac',
    specs: [
      { label: 'Thành phần', val: 'Nhựa Acrylic Polyol 2 thành phần (Sơn bóng + Chất đóng rắn Hardner)' },
      { label: 'Đặc tính', val: 'Siêu bóng, độ cứng bề mặt cực cao, chống trầy xước và hóa chất' },
      { label: 'Ứng dụng', val: 'Phủ bóng bảo vệ gỗ, kim loại, xe máy, ô tô, bề mặt công trình cao cấp' },
      { label: 'Tỷ lệ pha', val: '4 Sơn : 1 Đóng rắn : Dung môi pha loãng 2K' },
      { label: 'Quy cách', val: 'Bộ lon 1 Lít (gồm lon Clear & lon Hardner)' }
    ]
  },
  {
    slug: 'bot-ba-ngoai-that-cao-cap',
    info: PRODUCT_INFO['bot-ba-ngoai-that-cao-cap'],
    catName: 'Sản phẩm khác',
    catSlug: 'san-pham-khac',
    specs: [
      { label: 'Thành phần', val: 'Xi măng trắng, bột khoáng carbonate, polymer và phụ gia chống thấm' },
      { label: 'Đặc tính', val: 'Dẻo mịn, dễ thi công, độ bám dính tuyệt hảo, chịu nắng mưa tốt' },
      { label: 'Ứng dụng', val: 'Trét phẳng tường bê tông, hồ vữa ngoài trời trước khi sơn lót' },
      { label: 'Định mức', val: '1.0 – 1.2 kg/m²/2 lớp hoàn thiện' },
      { label: 'Quy cách', val: 'Bao 40 Kg tiêu chuẩn TCVN 7239 - ISO 9001' }
    ]
  }
];

missingProducts.forEach(mp => {
  const targetDir = path.join(baseDir, 'san-pham', mp.slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetFile = path.join(targetDir, 'index.html');
  
  let pageHtml = templateDetail;
  // Replace title & headings
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, `<title>${mp.info.name} | Sơn WANDERS - MY HOUR</title>`);
  pageHtml = pageHtml.replace(/<span class="font-mono text-\[11px\] uppercase tracking-\[0\.2em\] text-brand-green">XI-KA BITUM<\/span>/g, `<span class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-green">${mp.info.code}</span>`);
  pageHtml = pageHtml.replace(/<h1 class="font-heading text-\[30px\] font-bold leading-tight tracking-tight text-brand-ink lg:text-\[38px\]">Chống thấm sàn XI-KA BITUM<\/h1>/, `<h1 class="font-heading text-[30px] font-bold leading-tight tracking-tight text-brand-ink lg:text-[38px]">${mp.info.name}</h1>`);
  pageHtml = pageHtml.replace(/Vật liệu chống thấm gốc bitum dùng cho sàn và khu vực ẩm ướt\./g, mp.info.desc);
  
  // Replace category breadcrumb
  pageHtml = pageHtml.replace(/>Sơn chống thấm<\/a>/g, `>${mp.catName}</a>`);
  pageHtml = pageHtml.replace(/href="\.\.\/\.\.\/san-pham\/son-chong-tham\/index\.html"/g, `href="../../san-pham/${mp.catSlug}/index.html"`);
  
  // Replace Image markup
  const imgMarkup = generateImageMarkup(`../../images/${mp.info.img}`, mp.info.name);
  const relaxedRegex = /<div class="flex (?:items-center|flex-col)[^>]*aspect-\[4\/5\][^>]*>[\s\S]*?<\/div>\s*<\/div>/;
  // Let's replace the first aspect-[4/5] container
  const firstAspect = pageHtml.indexOf('aspect-[4/5]');
  if (firstAspect !== -1) {
    const boxStart = pageHtml.lastIndexOf('<div', firstAspect);
    const boxEnd = pageHtml.indexOf('</div>', firstAspect) + 6;
    pageHtml = pageHtml.substring(0, boxStart) + imgMarkup + pageHtml.substring(boxEnd);
  }

  // Replace specs table
  const specsHtml = mp.specs.map(s => `
    <div class="flex items-start justify-between border-b border-brand-line py-3">
      <span class="text-[13.5px] font-medium text-brand-slate">${s.label}</span>
      <span class="text-right text-[13.5px] font-semibold text-brand-ink">${s.val}</span>
    </div>
  `).join('');
  
  fs.writeFileSync(targetFile, pageHtml, 'utf8');
  console.log(`Created product page: san-pham/${mp.slug}/index.html`);
});

// 6. UPDATE CATEGORY & LISTING PAGES
console.log('--- 4. Updating Category & Listing Pages ---');

function updatePageCards(filePath, relPrefix) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace cards for products that have images
  for (const [slug, info] of Object.entries(PRODUCT_INFO)) {
    const cardHrefPattern = `href="${relPrefix}san-pham/${slug}/index.html"`;
    let cardIdx = 0;
    while ((cardIdx = html.indexOf(cardHrefPattern, cardIdx)) !== -1) {
      // Find the placeholder within this card (before the next </a>)
      const aEnd = html.indexOf('</a>', cardIdx);
      const sub = html.substring(cardIdx, aEnd);
      
      const pIdx = sub.indexOf('aspect-[4/5]');
      if (pIdx !== -1 && sub.includes('Ảnh sản phẩm đang cập nhật')) {
        const divStart = sub.lastIndexOf('<div', pIdx);
        const divEnd = sub.indexOf('</div>', pIdx) + 6;
        const oldDiv = sub.substring(divStart, divEnd);
        const newDiv = generateImageMarkup(`${relPrefix}images/${info.img}`, info.name);
        
        html = html.substring(0, cardIdx + divStart) + newDiv + html.substring(cardIdx + divEnd);
        changed = true;
        console.log(`Updated card for ${slug} in ${path.basename(filePath)}`);
      }
      cardIdx = aEnd + 4;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
  }
}

// Update Homepage
updatePageCards(path.join(baseDir, 'index.html'), './');

// Update All Products page
updatePageCards(path.join(baseDir, 'san-pham/index.html'), '../');

// Update Category pages
updatePageCards(path.join(baseDir, 'san-pham/son-chong-tham/index.html'), '../../');
updatePageCards(path.join(baseDir, 'san-pham/son-chong-nong/index.html'), '../../');
updatePageCards(path.join(baseDir, 'san-pham/san-pham-khac/index.html'), '../../');
updatePageCards(path.join(baseDir, 'san-pham/son-noi-that/index.html'), '../../');
updatePageCards(path.join(baseDir, 'san-pham/son-ngoai-that/index.html'), '../../');
updatePageCards(path.join(baseDir, 'san-pham/son-lot/index.html'), '../../');

console.log('--- ALL UPDATES COMPLETED SUCCESSFULLY! ---');

