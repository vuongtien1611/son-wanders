const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';

function generateMegaMenu(prefix) {
  return `<div class="relative group flex h-[72px] items-center nav-dropdown">
        <a class="px-3 py-2 text-[13px] font-medium transition-colors text-brand-ink hover:text-brand-green flex items-center gap-1.5" href="${prefix}san-pham/index.html" data-discover="true">
          <span>Sản phẩm</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"></path></svg>
        </a>
        <div class="nav-dropdown-menu nav-mega-menu absolute left-0 top-[68px] hidden group-hover:block group-focus-within:block border border-brand-line bg-white shadow-[0_24px_50px_-30px_rgba(37,44,48,0.45)] z-50 rounded-[4px]">
          <div class="nav-mega-grid">
            <a href="${prefix}san-pham/son-noi-that/index.html" class="nav-mega-item group/item">
              <div class="nav-mega-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div class="nav-mega-content">
                <span class="nav-mega-title">Sơn nội thất cao cấp</span>
                <span class="nav-mega-desc">Mịn bóng sang trọng, kháng khuẩn, lau chùi vượt trội &amp; bền màu dài lâu</span>
              </div>
            </a>
            <a href="${prefix}san-pham/son-ngoai-that/index.html" class="nav-mega-item group/item">
              <div class="nav-mega-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="nav-mega-content">
                <span class="nav-mega-title">Sơn ngoại thất bảo vệ</span>
                <span class="nav-mega-desc">Chống tia cực tím UV, kháng kiềm muối hóa &amp; chịu thời tiết khắc nghiệt</span>
              </div>
            </a>
            <a href="${prefix}san-pham/son-chong-tham/index.html" class="nav-mega-item group/item">
              <div class="nav-mega-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
              <div class="nav-mega-content">
                <span class="nav-mega-title">Sơn chống thấm đa năng</span>
                <span class="nav-mega-desc">Ngăn ẩm mốc, co giãn đàn hồi cao chống nứt dột trần, tường &amp; sàn</span>
              </div>
            </a>
            <a href="${prefix}san-pham/son-lot/index.html" class="nav-mega-item group/item">
              <div class="nav-mega-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7"/><path d="M14 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3z"/></svg>
              </div>
              <div class="nav-mega-content">
                <span class="nav-mega-title">Sơn lót kháng kiềm chuyên sâu</span>
                <span class="nav-mega-desc">Kháng kiềm hóa vượt trội, chống loang màu &amp; tăng liên kết lớp phủ</span>
              </div>
            </a>
            <a href="${prefix}san-pham/son-chong-nong/index.html" class="nav-mega-item group/item">
              <div class="nav-mega-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </div>
              <div class="nav-mega-content">
                <span class="nav-mega-title">Sơn chống nóng cách nhiệt</span>
                <span class="nav-mega-desc">Phản xạ nhiệt bức xạ mặt trời, hạ nhiệt bề mặt công trình 5-8°C</span>
              </div>
            </a>
            <a href="${prefix}san-pham/san-pham-khac/index.html" class="nav-mega-item group/item">
              <div class="nav-mega-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <div class="nav-mega-content">
                <span class="nav-mega-title">Sản phẩm đặc dụng &amp; Bột bả</span>
                <span class="nav-mega-desc">Sơn chậu cảnh, phủ bóng Clear Nano, chống thấm &amp; bột bả nội ngoại thất</span>
              </div>
            </a>
          </div>
          <div class="nav-mega-footer">
            <div class="nav-mega-footer-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #166534;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Công nghệ Anh Quốc • Tiêu chuẩn ISO 9001:2015 &amp; QCVN 16:2014/BXD</span>
            </div>
            <a href="${prefix}san-pham/index.html" class="nav-mega-footer-link">
              <span>Xem toàn bộ sản phẩm</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>`;
}

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Determine prefix based on file relative depth
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const depth = (rel.match(/\//g) || []).length;
  let prefix = './';
  if (depth === 1) prefix = '../';
  else if (depth === 2) prefix = '../../';
  else if (depth >= 3) prefix = '../../../';

  const newMarkup = generateMegaMenu(prefix);

  // Pattern to match existing nav-dropdown block
  const oldRegex = /<div class="relative group flex h-\[72px\] items-center nav-dropdown">[\s\S]*?<\/div>\s*<\/div>/;
  if (oldRegex.test(content)) {
    content = content.replace(oldRegex, newMarkup);
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walk(dir) {
  let count = 0;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      count += walk(full);
    } else if (item.endsWith('.html')) {
      if (processHtmlFile(full)) count++;
    }
  }
  return count;
}

const totalUpdated = walk(rootDir);
console.log('Total HTML files updated with Luxury Mega Menu:', totalUpdated);

// Update React JS bundle (assets/index-BG3fZPr5.js)
const jsPath = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BG3fZPr5.js';
let js = fs.readFileSync(jsPath, 'utf8');

// Target React dropdown
const oldJsSnippet = 'hasProducts?(0,j.jsxs)(`div`,{className:`relative flex h-[72px] items-center`,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),children:[(0,j.jsx)(_c,{to:e.to,className:a,children:(0,j.jsxs)(`span`,{className:`inline-flex items-center gap-1.5`,children:[e.label,(0,j.jsx)(an,{className:`h-3.5 w-3.5`})]})}),n?(0,j.jsxs)(`div`,{className:`absolute left-0 top-[70px] w-[600px] border border-brand-line bg-white p-2 shadow-[0_24px_50px_-30px_rgba(37,44,48,0.45)]`';

const newJsSnippet = 'hasProducts?(0,j.jsxs)(`div`,{className:`relative flex h-[72px] items-center nav-dropdown`,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),children:[(0,j.jsx)(_c,{to:e.to,className:a,children:(0,j.jsxs)(`span`,{className:`inline-flex items-center gap-1.5`,children:[e.label,(0,j.jsx)(an,{className:`h-3.5 w-3.5`})]})}),n?(0,j.jsxs)(`div`,{className:`nav-dropdown-menu nav-mega-menu absolute left-0 top-[70px] w-[740px] border border-brand-line bg-white p-4 shadow-2xl rounded-[4px]`';

if (js.includes(oldJsSnippet)) {
  js = js.replace(oldJsSnippet, newJsSnippet);
  fs.writeFileSync(jsPath, js, 'utf8');
  console.log('Successfully updated React JS bundle dropdown classes!');
} else {
  console.log('Note: oldJsSnippet not matched exactly in index-BG3fZPr5.js (already updated or variant).');
}

