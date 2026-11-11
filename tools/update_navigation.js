const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', 'website_download');

// 1. Update index-BG3fZPr5.js
const jsPath = path.join(ROOT_DIR, 'assets', 'index-BG3fZPr5.js');
if (fs.existsSync(jsPath)) {
  let js = fs.readFileSync(jsPath, 'utf8');
  const oldMenuRegex = /qg=\[\{label:`Trang chủ`,to:`\/`\},\{label:`Giới thiệu`,to:`\/gioi-thieu`\},\{label:`Sản phẩm`,to:`\/san-pham`,hasProducts:!0\},\{label:`Dự án`,to:`\/du-an`\},\{label:`Cảm hứng màu sắc`,to:`\/cam-hung-mau-sac`\},\{label:`Tin tức`,to:`\/tin-tuc`\},\{label:`Nhà phân phối`,to:`\/nha-phan-phoi`\},\{label:`Liên hệ`,to:`\/lien-he`\}\]/;
  const newMenuCode = 'qg=[{label:`Giới thiệu`,to:`/gioi-thieu`},{label:`Sản phẩm`,to:`/san-pham`,hasProducts:!0},{label:`Dự án`,to:`/du-an`},{label:`Cảm hứng màu sắc`,to:`/cam-hung-mau-sac`},{label:`Tin tức`,to:`/tin-tuc`}]';
  
  if (oldMenuRegex.test(js)) {
    js = js.replace(oldMenuRegex, newMenuCode);
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('Updated qg array in index-BG3fZPr5.js');
  } else {
    console.log('qg pattern not found directly, checking partial replacement...');
    const targetStr = '{label:`Trang chủ`,to:`/`},';
    if (js.includes(targetStr)) {
      js = js.replace(targetStr, '');
      js = js.replace(',{label:`Nhà phân phối`,to:`/nha-phan-phoi`},{label:`Liên hệ`,to:`/lien-he`}', '');
      fs.writeFileSync(jsPath, js, 'utf8');
      console.log('Replaced qg items in index-BG3fZPr5.js');
    }
  }
}

// 2. Add dropdown CSS to index-BDqGYMxC.css
const cssPath = path.join(ROOT_DIR, 'assets', 'index-BDqGYMxC.css');
const dropdownCssRule = `
/* Navigation dropdown styles */
.nav-dropdown { position: relative; }
.nav-dropdown:hover .nav-dropdown-menu,
.nav-dropdown:focus-within .nav-dropdown-menu {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
`;
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('.nav-dropdown:hover')) {
    css += dropdownCssRule;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Added dropdown CSS to index-BDqGYMxC.css');
  }
}

function getRelativePrefix(filePath) {
  const rel = path.relative(ROOT_DIR, path.dirname(filePath));
  if (!rel || rel === '.') return './';
  const depth = rel.split(path.sep).length;
  return '../'.repeat(depth);
}

function buildNavHtml(prefix, currentSlug) {
  const isGioiThieu = currentSlug === 'gioi-thieu';
  const isSanPham = currentSlug.startsWith('san-pham');
  const isDuAn = currentSlug === 'du-an';
  const isCamHung = currentSlug === 'cam-hung-mau-sac';
  const isTinTuc = currentSlug.startsWith('tin-tuc');

  return `<nav class="hidden items-center lg:flex gap-1" aria-label="Điều hướng chính">
      <a class="px-3 py-2 text-[13px] font-medium transition-colors ${isGioiThieu ? 'text-brand-green font-semibold' : 'text-brand-ink hover:text-brand-green'}" href="${prefix}gioi-thieu/index.html" data-discover="true">Giới thiệu</a>
      <div class="relative group flex h-[72px] items-center nav-dropdown">
        <a class="px-3 py-2 text-[13px] font-medium transition-colors ${isSanPham ? 'text-brand-green font-semibold' : 'text-brand-ink hover:text-brand-green'} flex items-center gap-1.5" href="${prefix}san-pham/index.html" data-discover="true">
          <span>Sản phẩm</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"></path></svg>
        </a>
        <div class="nav-dropdown-menu absolute left-0 top-[68px] hidden group-hover:block group-focus-within:block w-[520px] border border-brand-line bg-white p-3 shadow-[0_24px_50px_-30px_rgba(37,44,48,0.45)] z-50 rounded-[3px]">
          <div class="grid grid-cols-2 gap-2">
            <a href="${prefix}san-pham/son-noi-that/index.html" class="flex flex-col p-2.5 rounded-[3px] transition-colors hover:bg-brand-canvas">
              <span class="text-[13px] font-semibold text-brand-ink">Sơn nội thất</span>
              <span class="text-[11.5px] text-brand-slate mt-0.5">Mịn bóng, bền màu cho tường trong nhà</span>
            </a>
            <a href="${prefix}san-pham/son-ngoai-that/index.html" class="flex flex-col p-2.5 rounded-[3px] transition-colors hover:bg-brand-canvas">
              <span class="text-[13px] font-semibold text-brand-ink">Sơn ngoại thất</span>
              <span class="text-[11.5px] text-brand-slate mt-0.5">Chống chịu thời tiết khắc nghiệt</span>
            </a>
            <a href="${prefix}san-pham/son-chong-tham/index.html" class="flex flex-col p-2.5 rounded-[3px] transition-colors hover:bg-brand-canvas">
              <span class="text-[13px] font-semibold text-brand-ink">Sơn chống thấm</span>
              <span class="text-[11.5px] text-brand-slate mt-0.5">Ngăn chặn ẩm mốc, dột và nứt nẻ</span>
            </a>
            <a href="${prefix}san-pham/son-lot/index.html" class="flex flex-col p-2.5 rounded-[3px] transition-colors hover:bg-brand-canvas">
              <span class="text-[13px] font-semibold text-brand-ink">Sơn lót</span>
              <span class="text-[11.5px] text-brand-slate mt-0.5">Kháng kiềm, tăng độ bám dính</span>
            </a>
            <a href="${prefix}san-pham/son-chong-nong/index.html" class="flex flex-col p-2.5 rounded-[3px] transition-colors hover:bg-brand-canvas">
              <span class="text-[13px] font-semibold text-brand-ink">Sơn chống nóng</span>
              <span class="text-[11.5px] text-brand-slate mt-0.5">Cách nhiệt, phản xạ ánh nắng</span>
            </a>
            <a href="${prefix}san-pham/san-pham-khac/index.html" class="flex flex-col p-2.5 rounded-[3px] transition-colors hover:bg-brand-canvas">
              <span class="text-[13px] font-semibold text-brand-ink">Sản phẩm khác</span>
              <span class="text-[11.5px] text-brand-slate mt-0.5">Sơn chậu cảnh, phủ bóng, bột bả</span>
            </a>
          </div>
          <div class="border-t border-brand-line mt-2.5 pt-2 flex justify-between items-center px-2">
            <span class="text-[11px] text-brand-slate">Hơn 20 dòng sản phẩm chất lượng cao</span>
            <a href="${prefix}san-pham/index.html" class="text-[12px] font-medium text-brand-green hover:underline">Xem tất cả sản phẩm →</a>
          </div>
        </div>
      </div>
      <a class="px-3 py-2 text-[13px] font-medium transition-colors ${isDuAn ? 'text-brand-green font-semibold' : 'text-brand-ink hover:text-brand-green'}" href="${prefix}du-an/index.html" data-discover="true">Dự án</a>
      <a class="px-3 py-2 text-[13px] font-medium transition-colors ${isCamHung ? 'text-brand-green font-semibold' : 'text-brand-ink hover:text-brand-green'}" href="${prefix}cam-hung-mau-sac/index.html" data-discover="true">Cảm hứng màu sắc</a>
      <a class="px-3 py-2 text-[13px] font-medium transition-colors ${isTinTuc ? 'text-brand-green font-semibold' : 'text-brand-ink hover:text-brand-green'}" href="${prefix}tin-tuc/index.html" data-discover="true">Tin tức</a>
    </nav>`;
}

function updateHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const prefix = getRelativePrefix(filePath);
  
  // Determine current page slug from path
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  let currentSlug = '';
  if (relPath !== 'index.html') {
    currentSlug = relPath.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  }

  // 1. Replace <nav ...>...</nav>
  const navRegex = /<nav class="hidden items-center lg:flex" aria-label="Điều hướng chính">[\s\S]*?<\/nav>/i;
  const newNav = buildNavHtml(prefix, currentSlug);
  
  if (navRegex.test(html)) {
    html = html.replace(navRegex, newNav);
  }

  // 2. Ensure "Nhận tư vấn" button links to contact page
  html = html.replace(
    /<a class="([^"]*)rounded-\[3px\] bg-brand-green([^"]*)" href="[^"]*" data-discover="true">Nhận tư vấn<\/a>/g,
    `<a class="$1rounded-[3px] bg-brand-green$2" href="${prefix}lien-he/index.html" data-discover="true">Nhận tư vấn</a>`
  );

  // 3. Ensure dropdown CSS is present in inlined <style id="site-main-css">
  if (html.includes('id="site-main-css"') && !html.includes('.nav-dropdown:hover')) {
    html = html.replace('id="site-main-css">', `id="site-main-css">\n${dropdownCssRule}`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function walkDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'images' && item !== 'assets' && item !== 'static') {
        walkDir(fullPath);
      }
    } else if (item.endsWith('.html')) {
      updateHtmlFile(fullPath);
    }
  }
}

walkDir(ROOT_DIR);
console.log('Navigation menu successfully updated in all HTML files!');

