const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../website_download');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wanders_products.json'), 'utf8'));

function fixFooterAndLinks(html, prefix) {
  let out = html;
  out = out.replace(
    /Facebook · Instagram · YouTube — kênh đang cập nhật/g,
    'Hotline: 0937.760.688 · Email: wanderspaint@gmail.com'
  );
  const catMap = {
    'noi-that': 'son-noi-that',
    'ngoai-that': 'son-ngoai-that',
    'chong-tham': 'son-chong-tham',
    'son-lot': 'son-lot',
    'chong-nong': 'son-chong-nong',
    'khac': 'san-pham-khac',
  };
  for (const [nhom, folder] of Object.entries(catMap)) {
    out = out.replace(
      new RegExp(`href="(?:\\.\\.?/)?san-pham\\?nhom=${nhom}"`, 'g'),
      `href="${prefix}san-pham/${folder}/index.html"`
    );
  }
  out = out.replace(/<img loading="lazy" class="w-full h-full inset-0 absolute object-contain" alt="Logo WANDERS"/g, '<img class="w-full h-full inset-0 absolute object-contain" alt="Logo WANDERS"');
  return out;
}

function fixSubdirSrcset(html, isSubdir) {
  if (!isSubdir) return html;
  return html
    .replace(/srcset="\.\/images\//g, 'srcset="../images/')
    .replace(/, \.\/images\//g, ', ../images/');
}

function ensureOgMeta(html, { title, description, urlPath, prefix }) {
  if (html.includes('property="og:title"')) return html;
  const ogBlock = `  <meta property="og:type" content="website">
  <meta property="og:site_name" content="WANDERS">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
  <meta property="og:image" content="${prefix}images/base44/2c9aa4c1c_generated_be64a0c2.png">
  <link rel="canonical" href="https://wanders.vn/${urlPath}">`;
  return html.replace('</head>', `${ogBlock}\n</head>`);
}

// ------------------------------------------------------------------
// 1. GIOI-THIEU (gioi-thieu.html & gioi-thieu/index.html)
// ------------------------------------------------------------------
function patchGioiThieu(relPath, isSubdir) {
  const fullPath = path.join(ROOT, relPath);
  const prefix = isSubdir ? '../' : './';
  let html = fs.readFileSync(fullPath, 'utf8');

  // Remove placeholder sentence inside Câu chuyện section
  html = html.replace(
    /<p class="text-\[13\.5px\] leading-\[1\.75\] text-ink">Nội dung về lịch sử doanh nghiệp, năng lực sản xuất và tiêu chuẩn sẽ được cập nhật khi có tài liệu chính thức từ WANDERS\.<\/p>/g,
    ''
  );

  // Replace generic "Ảnh minh hoạ" captions on studio images with factual architectural labels
  html = html.replace(
    /<span>Colour studio<\/span><span>Ảnh minh hoạ<\/span>/g,
    '<span>Colour studio</span><span>Không gian trưng bày màu sắc</span>'
  );
  html = html.replace(
    /<span>Khu pha màu<\/span><span>Ảnh minh hoạ<\/span>/g,
    '<span>Khu pha màu</span><span>Kiểm định sắc độ chuẩn</span>'
  );

  // Remove unverified Factory / Partners / Certificates dark section ("Thông tin sản xuất đang được xác minh")
  html = html.replace(
    /<section class="bg-charcoal py-16 text-bone lg:py-20">[\s\S]*?<\/section>/,
    ''
  );

  // Remove unfinished Video thương hiệu section ("Phim giới thiệu đang được hoàn thiện")
  html = html.replace(
    /<section id="video"[\s\S]*?<\/section>/,
    ''
  );

  html = fixFooterAndLinks(html, prefix);
  html = fixSubdirSrcset(html, isSubdir);
  html = ensureOgMeta(html, {
    title: 'Giới thiệu WANDERS — Deine Wand mal anders',
    description: 'Khám phá WANDERS: định hướng màu sắc, định hướng sản phẩm và giải pháp sơn kiến trúc hiện đại.',
    urlPath: 'gioi-thieu.html',
    prefix,
  });

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log('Patched:', relPath);
}

// ------------------------------------------------------------------
// 2. INDEX.HTML (Homepage Clean Assembly + Production Cleanup + Cinematic Intro)
// ------------------------------------------------------------------
function patchIndex() {
  const fullPath = path.join(ROOT, 'index.html');
  const AUDIT_DIR = path.resolve(__dirname, '../audit_base44');
  let html = fs.readFileSync(fullPath, 'utf8');

  // Reassemble clean <main> from raw section_0..7 + section_10 (omitting s8 Trust/Video & s9 unfinished Journal)
  if (fs.existsSync(path.join(AUDIT_DIR, 'section_0.html'))) {
    const readSec = (i) => {
      let s = fs.readFileSync(path.join(AUDIT_DIR, `section_${i}.html`), 'utf8');
      s = s.replace(/https:\/\/media\.base44\.com\/images\/public\/6af1c6a51658eb0baedcd4af\/([a-zA-Z0-9_.-]+\.(?:png|jpg|jpeg|webp))\/v1\/fill\/[^\s"]+/g, './images/base44/$1');
      s = s.replace(/https:\/\/media\.base44\.com\/images\/public\/6af1c6a51658eb0baedcd4af\/([a-zA-Z0-9_.-]+\.(?:png|jpg|jpeg|webp))/g, './images/base44/$1');
      s = s.replace(/href="\/(?!\/)([^"]*)"/g, (m, p1) => {
        if (!p1) return 'href="./index.html"';
        if (p1.startsWith('du-an/')) return `href="./${p1}/index.html"`;
        if (p1.startsWith('san-pham?')) return `href="./${p1}"`;
        return `href="./${p1}.html"`;
      });
      s = s.replace(/\[Cập nhật hotline\]/g, '<a href="tel:0937760688" class="hover:underline">0937.760.688</a>');
      s = s.replace(/\[Cập nhật email\]/g, '<a href="mailto:wanderspaint@gmail.com" class="hover:underline">wanderspaint@gmail.com</a>');
      s = s.replace(/<img loading="lazy" /g, '<img ');
      return s;
    };

    const pick = (code, cat, fallback) => {
      const p = products.find((x) => x.code === code) || fallback;
      return {
        code: p.code,
        name: p.name,
        desc: (p.desc || fallback.desc).slice(0, 95),
        packaging: p.packaging || '5L & 18L',
        image: './' + p.image,
        link: './' + p.link,
        cat: cat || p.category,
      };
    };
    const featured = [
      pick('EX999', 'son-ngoai-that', { desc: 'Chống tia cực tím, chống phai màu vượt trội.' }),
      pick('IN3*', 'son-noi-that', { desc: 'Màng sơn láng mịn, thân thiện môi trường.' }),
      pick('CT B5', 'chong-tham', products.find(x => x.category === 'chong-tham')),
      pick('LĐN 515', 'son-lot', { desc: 'Tăng cường bám dính, kháng kiềm hóa tối ưu.' }),
    ];
    const cardsHtml = featured.map(p => `
    <a class="group block b44-card" href="${p.link}" data-cat="${p.cat}">
      <div class="relative aspect-[4/5] w-full overflow-hidden border border-line bg-gradient-to-br from-[#F5EFE6] to-[#EAE0D0] flex items-center justify-center p-4">
        <span class="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 z-10">
          <span class="text-[9.5px] uppercase tracking-[0.18em] text-charcoal/70 font-mono font-bold">${p.code}</span>
          <span class="text-[9px] uppercase tracking-[0.14em] text-terracotta font-semibold">${p.packaging}</span>
        </span>
        <img src="${p.image}" class="product-image h-full w-full object-contain object-center drop-shadow-md group-hover:scale-105 transition-transform duration-300 p-2" style="width:100%;height:100%;object-fit:contain;object-position:center;" alt="${p.name}">
        <span class="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center border border-charcoal/20 bg-bone/40 text-charcoal opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-4 w-4"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
        </span>
      </div>
      <h3 class="mt-4 text-[15.5px] font-semibold leading-snug text-charcoal group-hover:text-terracotta transition-colors">${p.name}</h3>
      <p class="mt-2 text-[13px] leading-relaxed text-ink line-clamp-2">${p.desc}</p>
      <span class="mt-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-terracotta">Xem chi tiết<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-3.5 w-3.5"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span>
    </a>`).join('');

    let s0 = readSec(0).replace(/<img loading="lazy" /g, '<img ');
    let s1 = readSec(1)
      .replace(
        /data-base44-image-src="\.\/images\/base44\/[^"]+"/g,
        'data-base44-image-src="./images/ChatGPT Image Nov 11, 2026, 10_50_14 AM-1.png"'
      )
      .replace(/\s*srcset="[^"]*"/g, '')
      .replace(
        /src="\.\/images\/base44\/[^"]+"/g,
        'src="./images/ChatGPT Image Nov 11, 2026, 10_50_14 AM-1.png"'
      )
      .replace(
        /class="w-full h-full inset-0 absolute object-cover"/g,
        'class="w-full h-full inset-0 absolute object-cover object-center"'
      );
    let s2 = readSec(2);
    let s3 = readSec(3).replace(
      /<div class="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" id="homeCatalogueGrid">${cardsHtml}</div></div></section>`
    );
    let s4 = readSec(4);
    let s5 = readSec(5);
    let s6 = readSec(6);
    let s7 = readSec(7);
    let s10 = readSec(10);

    const rebuiltMain = `<main>\n    ${[s0, s1, s2, s3, s4, s5, s6, s7, s10].join('\n')}\n  </main>`;
    html = html.replace(/<main>[\s\S]*?<\/main>/, rebuiltMain);
  }

  // Clean Color Explorer notice
  html = html.replace(
    /Mã màu hiển thị mang tính minh hoạ cho tới khi bảng màu WANDERS chính thức được công bố\./g,
    'Hệ màu tham khảo gồm 120 mã tiêu chuẩn — khám phá đầy đủ mã màu và thông số HEX tại Color Studio.'
  );

  // Clean Catalogue subtitle
  html = html.replace(
    /Danh mục sản phẩm theo bề mặt sử dụng\. Hình ảnh và thông số chính thức sẽ được cập nhật từ tài liệu WANDERS\./g,
    'Danh mục sản phẩm WANDERS được phân loại theo bề mặt thi công và điều kiện sử dụng thực tế.'
  );

  // Clean Living with Colour notice
  html = html.replace(
    /Ảnh minh hoạ cho định hướng phối màu\. Bảng màu chính thức của WANDERS sẽ được cập nhật sau\./g,
    'Gợi ý phối màu theo bốn phong cách kiến trúc — sử dụng Color Studio để tra cứu mã màu chi tiết.'
  );

  // Clean Project Journal label & note (accurate non-fake disclosure without "chờ cập nhật")
  html = html.replace(/>Hình ảnh minh hoạ<\/span>/g, '>Định hướng màu sắc</span>');
  html = html.replace(
    /Hình ảnh trong mục này là minh hoạ cho định hướng màu sắc, không phải công trình đã sử dụng sơn WANDERS\./g,
    'Phối cảnh tham khảo định hướng màu sắc và vật liệu cho từng loại hình kiến trúc.'
  );

  // Clean Why Wanders notice
  html = html.replace(
    /<p class="mt-6 text-\[12px\] leading-relaxed text-ink">Các cam kết về chứng nhận và thông số kỹ thuật sẽ được công bố khi có tài liệu chính thức từ WANDERS\.<\/p>/g,
    ''
  );

  // Clean About Wanders notice + caption
  html = html.replace(
    /<p class="mt-4 max-w-\[52ch\] text-\[15px\] leading-\[1\.8\] text-bone\/70">Câu chuyện thương hiệu, năng lực sản xuất và các tiêu chuẩn đã xác minh sẽ được giới thiệu đầy đủ tại trang Giới thiệu khi tài liệu chính thức được cập nhật\.<\/p>/g,
    ''
  );
  html = html.replace(
    /<span>Colour Studio<\/span><span>Ảnh minh hoạ<\/span>/g,
    '<span>Colour Studio</span><span>WANDERS Paint</span>'
  );

  // Integrate Cinematic Paint Explosion Intro (CSS, anti-flash pre-check, mount div, JS)
  const preCheckScript = `  <link rel="stylesheet" href="./assets/wanders-intro.css">
  <script>
    (function () {
      try {
        var qs = window.location.search || '';
        var force = qs.indexOf('intro=1') !== -1;
        var skip = qs.indexOf('intro=0') !== -1;
        var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!skip && (force || !reduced)) {
          document.documentElement.classList.add('wi-active');
          setTimeout(function () { document.documentElement.classList.remove('wi-active'); }, 5200);
        }
      } catch (e) {}
    })();
  </script>`;
  if (/<link[^>]+wanders-intro\.css[^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/\s*<link[^>]+wanders-intro\.css[^>]*>[\s\S]*?<\/script>/i, `\n${preCheckScript}`);
  } else if (!html.includes('wanders-intro.css')) {
    html = html.replace('</head>', `${preCheckScript}\n</head>`);
  }

  if (!html.includes('id="wanders-intro"')) {
    html = html.replace(
      '<body class="bg-bone text-charcoal font-body antialiased">',
      '<body class="bg-bone text-charcoal font-body antialiased">\n  <div id="wanders-intro" class="wi-overlay" aria-hidden="true"></div>'
    );
  }

  if (!html.includes('wanders-intro.js')) {
    html = html.replace(
      '<script src="./assets/wanders_nav_dropdown.js"></script>',
      '<script src="./assets/wanders_nav_dropdown.js"></script>\n  <script src="./assets/wanders-intro.js"></script>'
    );
  }

  // Fix Color Explorer & Living with Colour JS so EVERY group button, swatch button, catalogue tab, and style tab truly works!
  const newHomeInteractiveJs = `<script>
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Color Explorer Switching (5 groups + 8 individual swatches)
      const expSection = document.querySelector('section:nth-of-type(2)');
      if (expSection) {
        const groupWrap = expSection.querySelector('.border-y.border-line');
        const groupButtons = groupWrap ? Array.from(groupWrap.querySelectorAll('button[type="button"]')) : [];
        const swatchGrid = expSection.querySelector('.mt-7.grid.grid-cols-4');
        const swatchButtons = swatchGrid ? Array.from(swatchGrid.querySelectorAll('button[type="button"]')) : [];
        const imgs = expSection.querySelectorAll('img');
        const imgContainer = expSection.querySelector('.relative.overflow-hidden.bg-sand');
        const outerSpan = imgContainer ? imgContainer.querySelector('[data-base44-image]') : null;
        const primaryImg = imgs[0] || null;
        const imgWrap = primaryImg ? primaryImg.parentElement : null;
        const subtitle = expSection.querySelector('.bg-gradient-to-t p:first-child');
        const colorName = expSection.querySelector('.bg-gradient-to-t p:last-child');
        const colorBox = expSection.querySelector('.bg-gradient-to-t span[style*="background-color"]');
        const colorHex = expSection.querySelector('.bg-gradient-to-t span.font-mono');
        const descEl = swatchGrid ? swatchGrid.nextElementSibling : null;

        const groups = [
          {
            name: 'Warm Neutral — Trung tính ấm',
            alt: 'Biệt thự màu kem, beige phong cách Trung tính ấm (Warm Neutral)',
            desc: 'Tông be, ngà và cát ấm — nền tảng an toàn cho không gian sống nhiều ánh sáng tự nhiên.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_14 AM-1.png',
            swatches: [
              { name: 'Trắng ngà', hex: '#F3EADB' },
              { name: 'Be cát', hex: '#EADFCB' },
              { name: 'Cát ấm', hex: '#DFD0B8' },
              { name: 'Đá mật', hex: '#CDB99C' },
              { name: 'Hạt dẻ nhạt', hex: '#B9A489' },
              { name: 'Nâu tro', hex: '#A78E72' },
              { name: 'Nâu đất', hex: '#8C7660' },
              { name: 'Nâu cà phê', hex: '#6F5B49' }
            ]
          },
          {
            name: 'Earth Tone — Tông đất',
            alt: 'Biệt thự màu đất nung, terracotta phong cách Tông đất (Earth Tone)',
            desc: 'Sắc đất nung, hổ phách và nâu sẫm mang đến chiều sâu mộc mạc, ấm áp cho kiến trúc.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_16 AM-2.png',
            swatches: [
              { name: 'Cát sa mạc', hex: '#EADFCB' },
              { name: 'Đất nung nhạt', hex: '#D7A48C' },
              { name: 'Ánh đất nung', hex: '#C58A63' },
              { name: 'Hổ phách cháy', hex: '#B1714B' },
              { name: 'Đất đỏ bazan', hex: '#95583A' },
              { name: 'Nâu gạch mộc', hex: '#7C4730' },
              { name: 'Hạt dẻ nướng', hex: '#6F5443' },
              { name: 'Nâu sẫm', hex: '#4A3528' }
            ]
          },
          {
            name: 'Sage Green — Xanh xô thơm',
            alt: 'Biệt thự màu xanh sage phong cách Xanh xô thơm (Sage Green)',
            desc: 'Gam xanh thảo mộc dịu mắt tạo cảm giác thư giãn, cân bằng cho phòng ngủ và không gian nghỉ ngơi.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_17 AM-3.png',
            swatches: [
              { name: 'Sương ban mai', hex: '#E8EDE0' },
              { name: 'Sương xô thơm', hex: '#CFD8C2' },
              { name: 'Xô thơm mộc', hex: '#B7BEA3' },
              { name: 'Thảo mộc dịu', hex: '#9DA787' },
              { name: 'Lá ô-liu', hex: '#83906F' },
              { name: 'Rêu Bắc Âu', hex: '#6B7859' },
              { name: 'Thông xanh', hex: '#556145' },
              { name: 'Rừng trầm', hex: '#3F4A33' }
            ]
          },
          {
            name: 'Modern Blue — Xanh hiện đại',
            alt: 'Biệt thự màu xanh lam, xanh ghi phong cách Xanh hiện đại (Modern Blue)',
            desc: 'Sắc xanh dương pha ghi thanh lịch, giữ sự tỉnh táo và thoáng đãng cho phòng làm việc.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_19 AM-4.png',
            swatches: [
              { name: 'Sương biển', hex: '#D9E4E8' },
              { name: 'Xanh băng nhạt', hex: '#C3D3D9' },
              { name: 'Gió biển mờ', hex: '#A2B4BB' },
              { name: 'Biển sương mai', hex: '#8098A1' },
              { name: 'Xanh thép', hex: '#637C87' },
              { name: 'Chàm hiện đại', hex: '#4C6470' },
              { name: 'Biển đêm', hex: '#344954' },
              { name: 'Xanh than sâu', hex: '#24343D' }
            ]
          },
          {
            name: 'Soft White — Trắng mềm',
            alt: 'Biệt thự màu trắng ngà, ivory phong cách Trắng mềm (Soft White)',
            desc: 'Các sắc trắng ấm và trắng ngà tinh khiết giúp khuếch tán ánh sáng tự nhiên mềm mại.',
            img: './images/ChatGPT Image Nov 11, 2026, 10_50_21 AM-5.png',
            swatches: [
              { name: 'Trắng sứ ấm', hex: '#FAF8F3' },
              { name: 'Trắng ngọc trai', hex: '#F6F3EC' },
              { name: 'Trắng ngà', hex: '#F1ECE0' },
              { name: 'Kem lanh', hex: '#EBE4D5' },
              { name: 'Sứ mịn', hex: '#E2DACB' },
              { name: 'Be phấn nhẹ', hex: '#D6CCBA' },
              { name: 'Đá phấn ấm', hex: '#C9BEB0' },
              { name: 'Ghi đá sáng', hex: '#BDB4A6' }
            ]
          }
        ];

        // Preload all 5 architectural villa images for zero-flicker switching
        const preloaded = {};
        groups.forEach((g) => {
          const pre = new Image();
          pre.decoding = 'async';
          pre.src = g.img;
          preloaded[g.img] = pre;
        });

        let currentImgSrc = groups[0].img;
        let switchTimer = null;
        let switchSeq = 0;

        function swapExplorerImage(nextSrc, nextAlt) {
          if (!primaryImg) return;
          if (outerSpan) outerSpan.setAttribute('data-base44-image-src', nextSrc);
          if (nextSrc === currentImgSrc) {
            primaryImg.alt = nextAlt || primaryImg.alt;
            return;
          }
          const seq = ++switchSeq;
          const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const prevSrc = currentImgSrc;
          currentImgSrc = nextSrc;

          const applyTransition = () => {
            if (seq !== switchSeq) return;
            primaryImg.removeAttribute('srcset');
            if (switchTimer) {
              clearTimeout(switchTimer);
              switchTimer = null;
            }
            if (reduced) {
              if (imgWrap) imgWrap.style.backgroundImage = '';
              primaryImg.style.transition = 'none';
              primaryImg.style.opacity = '1';
              primaryImg.style.transform = 'scale(1)';
              primaryImg.src = nextSrc;
              primaryImg.alt = nextAlt || '';
              return;
            }
            if (imgWrap && prevSrc) {
              imgWrap.style.backgroundImage = 'url("' + encodeURI(prevSrc) + '")';
              imgWrap.style.backgroundSize = 'cover';
              imgWrap.style.backgroundPosition = 'center';
            }
            primaryImg.style.transition = 'none';
            primaryImg.style.opacity = '0';
            primaryImg.style.transform = 'scale(1.025)';
            primaryImg.style.objectPosition = 'center center';
            primaryImg.src = nextSrc;
            primaryImg.alt = nextAlt || '';
            void primaryImg.offsetWidth;
            requestAnimationFrame(() => {
              if (seq !== switchSeq) return;
              primaryImg.style.transition = 'opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)';
              primaryImg.style.opacity = '1';
              primaryImg.style.transform = 'scale(1)';
              switchTimer = setTimeout(() => {
                if (seq === switchSeq && imgWrap) {
                  imgWrap.style.backgroundImage = '';
                }
              }, 440);
            });
          };

          const cached = preloaded[nextSrc];
          if (cached && cached.complete && cached.naturalWidth > 0) {
            applyTransition();
          } else {
            const loader = cached || new Image();
            loader.addEventListener('load', applyTransition, { once: true });
            loader.addEventListener('error', applyTransition, { once: true });
            if (!cached) {
              loader.src = nextSrc;
              preloaded[nextSrc] = loader;
            }
          }
        }

        const CHECK_SVG = '<span class="absolute inset-0 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check h-5 w-5 text-white mix-blend-difference"><path d="M20 6 9 17l-5-5"></path></svg></span>';

        let activeGroup = groups[0];

        function selectSwatch(sIdx) {
          const sw = activeGroup.swatches[sIdx] || activeGroup.swatches[0];
          swatchButtons.forEach((b, i) => {
            b.innerHTML = i === sIdx ? CHECK_SVG : '';
            b.classList.toggle('border-charcoal', i === sIdx);
            b.classList.toggle('border-line', i !== sIdx);
          });
          if (colorName) colorName.textContent = sw.name;
          if (colorHex) colorHex.textContent = sw.hex;
          if (colorBox) colorBox.style.backgroundColor = sw.hex;
        }

        groupButtons.forEach((btn, idx) => {
          btn.addEventListener('click', () => {
            groupButtons.forEach(b => {
              b.classList.remove('text-charcoal');
              b.classList.add('text-ink');
            });
            btn.classList.add('text-charcoal');
            btn.classList.remove('text-ink');

            activeGroup = groups[idx] || groups[0];
            if (subtitle) subtitle.textContent = activeGroup.name;
            if (descEl) descEl.textContent = activeGroup.desc;
            swapExplorerImage(activeGroup.img, activeGroup.alt);
            swatchButtons.forEach((sb, sIdx) => {
              const sw = activeGroup.swatches[sIdx];
              if (sw) {
                sb.style.backgroundColor = sw.hex;
                sb.setAttribute('aria-label', 'Chọn màu ' + sw.name);
              }
            });
            selectSwatch(2);
          });
        });

        swatchButtons.forEach((sb, sIdx) => {
          sb.addEventListener('click', () => selectSwatch(sIdx));
        });
      }

      // 2. Catalogue Tab Switching
      const catSection = document.querySelector('section:nth-of-type(4)');
      if (catSection) {
        const tabs = catSection.querySelectorAll('button[type="button"]');
        const cards = catSection.querySelectorAll('.b44-card');

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => {
              t.classList.remove('text-charcoal');
              t.classList.add('text-ink');
              const bar = t.querySelector('span');
              if (bar) bar.classList.replace('opacity-100', 'opacity-0');
            });
            tab.classList.add('text-charcoal');
            tab.classList.remove('text-ink');
            const activeBar = tab.querySelector('span');
            if (activeBar) activeBar.classList.replace('opacity-0', 'opacity-100');

            const text = tab.innerText.toLowerCase();
            let cat = 'all';
            if (text.includes('ngoại thất')) cat = 'son-ngoai-that';
            else if (text.includes('nội thất')) cat = 'son-noi-that';
            else if (text.includes('chống thấm')) cat = 'chong-tham';
            else if (text.includes('lót')) cat = 'son-lot';

            cards.forEach(card => {
              card.style.display = (cat === 'all' || card.getAttribute('data-cat') === cat) ? '' : 'none';
            });
          });
        });
      }

      // 3. Living with Colour Tabs (Image + Title + Subtitle + Description + 4 Palette Swatches)
      const livingSection = document.querySelector('section:nth-of-type(5)');
      if (livingSection) {
        const tabs = livingSection.querySelectorAll('button[type="button"]');
        const imgs = livingSection.querySelectorAll('img');
        const title = livingSection.querySelector('.bg-gradient-to-t p:last-child');
        const subtitle = livingSection.querySelector('.bg-gradient-to-t p:first-child');
        const desc = livingSection.querySelector('p[class*="text-charcoal/85"]');
        const paletteBlocks = livingSection.querySelectorAll('.mt-4.flex > div');

        const styles = [
          {
            subtitle: 'Modern Minimal',
            title: 'Tối giản hiện đại',
            img: './images/base44/edf841af7_generated_77536f0e.png',
            desc: 'Bề mặt sáng, ít chi tiết, đường nét kiến trúc được giữ lại làm nhân vật chính. Một sắc nhấn duy nhất đủ để căn phòng có điểm dừng.',
            palette: ['#EDE7DC', '#D6CDBE', '#283235', '#C56E4F']
          },
          {
            subtitle: 'Warm Living',
            title: 'Sống ấm',
            img: './images/base44/8099d7d28_generated_8abc6bed.png',
            desc: 'Bảng màu cát ấm, kem lanh và gỗ tự nhiên giúp không gian tiếp khách giữ được sự gần gũi, dễ chịu suốt cả ngày.',
            palette: ['#F3EADB', '#DFD0B8', '#A78E72', '#6F5B49']
          },
          {
            subtitle: 'Nature Inspired',
            title: 'Cảm hứng thiên nhiên',
            img: './images/base44/7f7b7d76e_generated_2a17cf56.png',
            desc: 'Sự kết hợp giữa xanh xô thơm dịu mát và trắng ngà mang hơi thở vườn cây vào không gian nghỉ ngơi yên tĩnh.',
            palette: ['#F1ECE0', '#CFD8C2', '#9DA787', '#556145']
          },
          {
            subtitle: 'Contemporary Luxury',
            title: 'Sang trọng đương đại',
            img: './images/base44/0cff00e0d_generated_6094395e.png',
            desc: 'Đối thoại tương phản giữa trắng ngà, ghi đá sâu và đất nung trầm tạo nên diện mạo tinh tế cho biệt thự và căn hộ cao cấp.',
            palette: ['#F1ECE0', '#C58A63', '#4C585C', '#283235']
          }
        ];

        tabs.forEach((tab, idx) => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => {
              t.classList.remove('border-charcoal', 'bg-charcoal', 'text-bone');
              t.classList.add('border-line', 'text-ink');
            });
            tab.classList.add('border-charcoal', 'bg-charcoal', 'text-bone');
            tab.classList.remove('border-line', 'text-ink');

            const s = styles[idx] || styles[0];
            if (title) title.textContent = s.title;
            if (subtitle) subtitle.textContent = s.subtitle;
            if (desc) desc.textContent = s.desc;
            imgs.forEach((im) => {
              im.src = s.img;
              im.srcset = s.img;
            });
            paletteBlocks.forEach((blk, pIdx) => {
              const hex = s.palette[pIdx];
              if (!hex) return;
              const box = blk.querySelector('div');
              const hexTxt = blk.querySelector('p');
              if (box) box.style.backgroundColor = hex;
              if (hexTxt) hexTxt.textContent = hex;
            });
          });
        });
      }
    });
  </script>`;

  html = html.replace(
    /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*\/\/ 1\. Color Explorer Switching[\s\S]*?<\/script>/,
    newHomeInteractiveJs
  );

  html = fixFooterAndLinks(html, './');
  html = ensureOgMeta(html, {
    title: 'WANDERS — Sơn trang trí & Color Studio',
    description: 'Sơn trang trí và giải pháp màu sắc WANDERS cho không gian sống hiện đại — mỗi bức tường, một dấu ấn riêng.',
    urlPath: '',
    prefix: './',
  });

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log('Patched: index.html');
}

// ------------------------------------------------------------------
// 3. SAN-PHAM (san-pham.html & san-pham/index.html)
// ------------------------------------------------------------------
function patchSanPham(relPath, isSubdir) {
  const fullPath = path.join(ROOT, relPath);
  const prefix = isSubdir ? '../' : './';
  let html = fs.readFileSync(fullPath, 'utf8');

  // Fix meta description (Excel uses Germany technology, avoid leftover MY HOUR copy)
  html = html.replace(
    /Danh mục 24 dòng sơn WANDERS: nội thất, ngoại thất, chống thấm, sơn lót và sơn chống nóng công nghệ Anh Quốc\./g,
    'Danh mục 24 dòng sơn WANDERS chính thức: sơn nội thất, ngoại thất, chống thấm, sơn lót, sơn chống nóng và sản phẩm chuyên dụng.'
  );

  // Fix Hero subtitle
  html = html.replace(
    /Danh mục sản phẩm được tổ chức theo bề mặt thi công và điều kiện sử dụng\. Thông số chính thức sẽ được cập nhật từ tài liệu WANDERS\./g,
    'Danh mục 24 dòng sản phẩm WANDERS được tổ chức theo bề mặt thi công và điều kiện sử dụng.'
  );

  // Fix count "12<!-- --> sản phẩm" -> dynamic span showing "24 sản phẩm" and add live search bar
  html = html.replace(
    /<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 class="text-\[22px\] font-semibold tracking-\[-0\.01em\] text-charcoal sm:text-\[26px\]">Tất cả sản phẩm<\/h2><p class="text-\[12px\] uppercase tracking-\[0\.18em\] text-ink">12<!-- --> sản phẩm<\/p><\/div><p class="mt-3 max-w-\[62ch\] text-\[14px\] leading-\[1\.7\] text-ink">Danh mục đầy đủ các nhóm sơn và sản phẩm phụ trợ của WANDERS\.<\/p>/,
    `<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-4">
            <h2 id="productsSectionTitle" class="text-[22px] font-semibold tracking-[-0.01em] text-charcoal sm:text-[26px]">Tất cả sản phẩm</h2>
            <p id="productsCountLabel" class="text-[12px] uppercase tracking-[0.18em] text-ink">${products.length} sản phẩm</p>
          </div>
          <p class="mt-2 max-w-[62ch] text-[14px] leading-[1.7] text-ink">Danh mục đầy đủ các nhóm sơn và sản phẩm phụ trợ chính thức của WANDERS.</p>
        </div>
        <div class="w-full lg:w-[340px]">
          <input id="productSearchInput" type="search" aria-label="Tìm kiếm sản phẩm" placeholder="Tìm tên hoặc mã sản phẩm (VD: IN525, EX9000)..." class="w-full border border-line bg-cream px-4 py-3 text-[13.5px] text-charcoal outline-none transition-colors placeholder:text-ink/55 focus:border-charcoal">
        </div>
      </div>`
  );

  // Add empty state message after #allProductsGrid if missing
  if (!html.includes('id="productsEmptyState"')) {
    html = html.replace(
      '    </div>\n  </div></section>',
      `    </div>
    <div id="productsEmptyState" class="hidden border border-line bg-cream px-6 py-12 text-center mt-6">
      <p class="text-[15px] font-medium text-charcoal">Không tìm thấy sản phẩm phù hợp với từ khoá tìm kiếm.</p>
      <button type="button" id="btnResetProductSearch" class="mt-4 inline-flex items-center gap-2 border border-charcoal bg-charcoal px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-bone hover:bg-terracotta hover:border-terracotta transition-colors">Hiển thị toàn bộ ${products.length} sản phẩm</button>
    </div>
  </div></section>`
    );
  }

  // Upgrade interactive filtering + live search + query param script
  const upgradedProductFilterJs = `<script>
    document.addEventListener('DOMContentLoaded', () => {
      const mainEl = document.querySelector('main');
      const allBtn = Array.from(mainEl.querySelectorAll('button')).find(b => b.textContent.trim() === 'Tất cả sản phẩm');
      const tileBtns = Array.from(mainEl.querySelectorAll('.grid button[type="button"]'));
      const cards = Array.from(document.querySelectorAll('.sp-product-card'));
      const searchInput = document.getElementById('productSearchInput');
      const countEl = document.getElementById('productsCountLabel');
      const titleEl = document.getElementById('productsSectionTitle');
      const emptyEl = document.getElementById('productsEmptyState');
      const resetEmptyBtn = document.getElementById('btnResetProductSearch');

      const catLabels = {
        'all': 'Tất cả sản phẩm',
        'son-noi-that': 'Sơn nội thất',
        'son-ngoai-that': 'Sơn ngoại thất',
        'chong-tham': 'Sơn chống thấm',
        'son-lot': 'Sơn lót',
        'son-chong-nong': 'Sơn chống nóng',
        'san-pham-khac': 'Sản phẩm khác'
      };

      const nhomMap = {
        'noi-that': 'son-noi-that',
        'ngoai-that': 'son-ngoai-that',
        'chong-tham': 'chong-tham',
        'son-lot': 'son-lot',
        'chong-nong': 'son-chong-nong',
        'khac': 'san-pham-khac'
      };

      let activeCat = 'all';
      let searchQuery = '';

      function applyFilter() {
        const q = searchQuery.trim().toLowerCase();
        let visible = 0;

        cards.forEach(card => {
          const cat = card.getAttribute('data-cat');
          const catOk = activeCat === 'all' || cat === activeCat;
          const text = (card.textContent + ' ' + (card.getAttribute('href') || '')).toLowerCase();
          const searchOk = !q || text.includes(q);
          const show = catOk && searchOk;
          card.style.display = show ? '' : 'none';
          if (show) visible++;
        });

        if (countEl) countEl.textContent = visible + ' sản phẩm';
        if (titleEl) titleEl.textContent = catLabels[activeCat] || 'Tất cả sản phẩm';
        if (emptyEl) emptyEl.classList.toggle('hidden', visible > 0);

        if (allBtn) {
          allBtn.classList.toggle('bg-charcoal', activeCat === 'all');
          allBtn.classList.toggle('text-bone', activeCat === 'all');
          allBtn.classList.toggle('border-charcoal', activeCat === 'all');
          allBtn.classList.toggle('text-charcoal', activeCat !== 'all');
          allBtn.classList.toggle('border-line', activeCat !== 'all');
        }

        tileBtns.forEach(btn => {
          const label = btn.textContent.trim().toLowerCase();
          const matchedCat = Object.entries(catLabels).find(([k, v]) => k !== 'all' && label.includes(v.toLowerCase()))?.[0];
          const isSelected = matchedCat && matchedCat === activeCat;
          btn.style.outline = isSelected ? '2px solid #C56E4F' : '';
          btn.style.outlineOffset = isSelected ? '2px' : '';
        });
      }

      if (allBtn) {
        allBtn.addEventListener('click', () => {
          activeCat = 'all';
          applyFilter();
        });
      }

      tileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.innerText.toLowerCase();
          let target = 'all';
          if (text.includes('nội thất')) target = 'son-noi-that';
          else if (text.includes('ngoại thất')) target = 'son-ngoai-that';
          else if (text.includes('chống thấm')) target = 'chong-tham';
          else if (text.includes('lót')) target = 'son-lot';
          else if (text.includes('chống nóng')) target = 'son-chong-nong';
          else if (text.includes('khác')) target = 'san-pham-khac';
          activeCat = target;
          applyFilter();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value || '';
          applyFilter();
        });
      }

      if (resetEmptyBtn) {
        resetEmptyBtn.addEventListener('click', () => {
          activeCat = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          applyFilter();
        });
      }

      const urlParams = new URLSearchParams(window.location.search);
      const nhom = urlParams.get('nhom');
      if (nhom) {
        activeCat = nhomMap[nhom] || nhom;
        applyFilter();
        const gridEl = document.getElementById('allProductsGrid');
        if (gridEl) {
          setTimeout(() => gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
      } else {
        applyFilter();
      }
    });
  </script>`;

  html = html.replace(
    /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*(?:const surfaceBtns =|const mainEl = document\.querySelector\('main'\);)[\s\S]*?<\/script>/,
    upgradedProductFilterJs
  );

  html = fixFooterAndLinks(html, prefix);
  html = fixSubdirSrcset(html, isSubdir);
  html = ensureOgMeta(html, {
    title: 'Sản phẩm — WANDERS',
    description: 'Danh mục 24 dòng sơn WANDERS chính thức theo bề mặt thi công và công năng bảo vệ.',
    urlPath: 'san-pham.html',
    prefix,
  });

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log('Patched:', relPath);
}

// ------------------------------------------------------------------
// 4. LIEN-HE (lien-he.html & lien-he/index.html) - REAL /api/contact
// ------------------------------------------------------------------
function patchLienHe(relPath, isSubdir) {
  const fullPath = path.join(ROOT, relPath);
  const prefix = isSubdir ? '../' : './';
  let html = fs.readFileSync(fullPath, 'utf8');

  // Remove "đang được cập nhật" & fake map placeholder
  html = html.replace(
    /<p class="mt-5 text-\[12px\] leading-relaxed text-ink">Thông tin liên hệ chính thức của WANDERS đang được cập nhật\. Nội dung hiển thị sẽ được thay bằng dữ liệu do doanh nghiệp xác nhận\.<\/p>/g,
    ''
  );
  html = html.replace(
    /<div class="mt-8 border border-line bg-cream p-5"><p class="text-\[10px\] uppercase tracking-\[0\.2em\] text-ink">Chỉ đường<\/p><p class="mt-2 text-[^"]*">Bản đồ showroom sẽ được hiển thị khi có địa chỉ chính thức\.<\/p><\/div>/,
    `<div class="mt-8 border border-line bg-cream p-5"><p class="text-[10px] uppercase tracking-[0.2em] text-ink">Hỗ trợ trực tiếp</p><p class="mt-2 text-[13px] leading-relaxed text-charcoal/75">Đội ngũ kỹ thuật WANDERS tiếp nhận yêu cầu tư vấn màu sắc, báo giá công trình và mẫu thử trực tiếp qua hotline <a href="tel:0937760688" class="font-semibold text-charcoal hover:underline">0937.760.688</a>.</p></div>`
  );

  // Add accessible status alert container + replace fake alert() with real POST /api/contact
  if (!html.includes('id="contactFormStatus"')) {
    html = html.replace(
      '<p class="mt-4 text-[11.5px] leading-relaxed text-ink">Thông tin của bạn chỉ được dùng để liên hệ tư vấn và không hiển thị công khai.</p>',
      '<div id="contactFormStatus" class="hidden mt-4 border p-4 text-[13px] leading-relaxed" role="status" aria-live="polite"></div>\n<p class="mt-4 text-[11.5px] leading-relaxed text-ink">Thông tin của bạn chỉ được dùng để liên hệ tư vấn và không hiển thị công khai.</p>'
    );
  }

  const realContactScript = `<script>
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form');
      if (!form) return;
      const statusBox = document.getElementById('contactFormStatus');
      const submitBtn = form.querySelector('button[type="submit"]');

      function showStatus(type, msg) {
        if (!statusBox) return;
        statusBox.classList.remove('hidden');
        if (type === 'ok') {
          statusBox.style.borderColor = '#166534';
          statusBox.style.backgroundColor = '#F0FDF4';
          statusBox.style.color = '#14532D';
        } else {
          statusBox.style.borderColor = '#B91C1C';
          statusBox.style.backgroundColor = '#FEF2F2';
          statusBox.style.color = '#7F1D1D';
        }
        statusBox.textContent = msg;
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const full_name = (document.getElementById('full_name')?.value || '').trim();
        const phone = (document.getElementById('phone')?.value || '').trim();
        const email = (document.getElementById('email')?.value || '').trim();
        const need = (document.getElementById('need')?.value || '').trim();
        const message = (document.getElementById('message')?.value || '').trim();

        if (full_name.length < 2) {
          showStatus('err', 'Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự).');
          document.getElementById('full_name')?.focus();
          return;
        }
        if (!/^[0-9+\\-\\s().]{8,20}$/.test(phone)) {
          showStatus('err', 'Vui lòng nhập số điện thoại liên hệ hợp lệ.');
          document.getElementById('phone')?.focus();
          return;
        }
        if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
          showStatus('err', 'Địa chỉ email chưa đúng định dạng.');
          document.getElementById('email')?.focus();
          return;
        }
        if (message.length < 5) {
          showStatus('err', 'Vui lòng mô tả ngắn gọn nhu cầu tư vấn (tối thiểu 5 ký tự).');
          document.getElementById('message')?.focus();
          return;
        }

        if (window.location.protocol === 'file:') {
          showStatus('err', 'Bạn đang xem trang ở chế độ tệp cục bộ (file:///) chưa kết nối máy chủ gửi biểu mẫu. Vui lòng truy cập qua máy chủ web (HTTP/HTTPS) hoặc liên hệ trực tiếp Hotline 0937.760.688.');
          return;
        }

        const origLabel = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'ĐANG GỬI YÊU CẦU...';
        }

        try {
          const resp = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, phone, email, need, message })
          });
          const data = await resp.json().catch(() => ({}));
          if (!resp.ok || !data.ok) {
            showStatus('err', data.error || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc gọi Hotline 0937.760.688.');
          } else {
            showStatus('ok', 'Đã tiếp nhận yêu cầu tư vấn (Mã #' + data.id + '). Đội ngũ kỹ thuật WANDERS sẽ liên hệ qua số ' + phone + ' trong giờ làm việc.');
            form.reset();
          }
        } catch (err) {
          showStatus('err', 'Kết nối máy chủ gián đoạn. Vui lòng gọi trực tiếp Hotline 0937.760.688 hoặc email wanderspaint@gmail.com.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origLabel;
          }
        }
      });
    });
  </script>`;

  html = html.replace(
    /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*const form = document\.querySelector\('form'\);[\s\S]*?<\/script>/,
    realContactScript
  );

  html = fixFooterAndLinks(html, prefix);
  html = fixSubdirSrcset(html, isSubdir);
  html = ensureOgMeta(html, {
    title: 'Liên hệ — WANDERS',
    description: 'Liên hệ WANDERS: Hotline 0937.760.688, Email wanderspaint@gmail.com, Lam Điền, Xã Quảng Bị, Thành phố Hà Nội.',
    urlPath: 'lien-he.html',
    prefix,
  });

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log('Patched:', relPath);
}

// ------------------------------------------------------------------
// 5. LEGACY UN-MIGRATED MY HOUR SNAPSHOTS (Clean WANDERS Redirects)
// ------------------------------------------------------------------
function replaceLegacyWithRedirect(relPath, targetRel, title, desc) {
  const depth = relPath.split(/[\\/]/).length - 1;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  const fullPath = path.join(ROOT, relPath);
  const targetHref = `${prefix}${targetRel}`;
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="${prefix}images/base44/a963c52b6_image.png">
  <title>${title} — WANDERS</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url=${targetHref}">
  <link rel="stylesheet" href="${prefix}assets/base44.css">
</head>
<body class="bg-bone text-charcoal font-body antialiased flex min-h-screen items-center justify-center p-6">
  <div class="max-w-md border border-line bg-cream p-8 text-center">
    <p class="text-[11px] uppercase tracking-[0.22em] text-ink">WANDERS Paint</p>
    <h1 class="mt-3 text-[22px] font-semibold text-charcoal">${title}</h1>
    <p class="mt-3 text-[14px] leading-relaxed text-ink">${desc}</p>
    <a href="${targetHref}" class="mt-6 inline-flex items-center gap-2 bg-charcoal px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-bone hover:bg-terracotta transition-colors">
      Tiếp tục tới WANDERS →
    </a>
  </div>
  <script>
    window.location.replace(${JSON.stringify(targetHref)});
  </script>
</body>
</html>`;
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log('Replaced legacy MY HOUR file with WANDERS redirect:', relPath, '->', targetRel);
}

// ------------------------------------------------------------------
// 6. UPDATE PAGES_INDEX.JSON, ROBOTS.TXT, SITEMAP.XML
// ------------------------------------------------------------------
function writeSeoAndManifests() {
  // Clean pages_index.json
  const wandersPages = [
    { route: '/', title: 'WANDERS — Sơn trang trí & Color Studio' },
    { route: '/gioi-thieu.html', title: 'Giới thiệu WANDERS — Deine Wand mal anders' },
    { route: '/san-pham.html', title: 'Sản phẩm — WANDERS' },
    { route: '/bang-mau.html', title: 'Bảng màu & Color Studio — WANDERS' },
    { route: '/du-an.html', title: 'Dự án & Công trình — WANDERS' },
    { route: '/lien-he.html', title: 'Liên hệ — WANDERS' },
    ...products.map((p) => ({ route: '/' + p.link, title: `${p.name} (${p.code}) — WANDERS` })),
  ];
  fs.writeFileSync(path.join(ROOT, 'pages_index.json'), JSON.stringify(wandersPages, null, 2), 'utf8');

  // robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /data/

Sitemap: https://wanders.vn/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), robotsTxt, 'utf8');

  // sitemap.xml
  const base = 'https://wanders.vn';
  const urls = [
    '/',
    '/gioi-thieu.html',
    '/san-pham.html',
    '/san-pham/son-noi-that/index.html',
    '/san-pham/son-ngoai-that/index.html',
    '/san-pham/son-chong-tham/index.html',
    '/san-pham/son-lot/index.html',
    '/san-pham/son-chong-nong/index.html',
    '/san-pham/san-pham-khac/index.html',
    '/bang-mau.html',
    '/du-an.html',
    '/du-an/biet-thu-mai-bang/index.html',
    '/du-an/can-ho-trung-tam/index.html',
    '/du-an/quan-ca-phe-studio/index.html',
    '/du-an/sanh-lam-viec/index.html',
    '/du-an/nha-vuon-mot-tang/index.html',
    '/lien-he.html',
    ...products.map((p) => '/' + p.link),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  console.log('Generated: pages_index.json, robots.txt, sitemap.xml (' + urls.length + ' URLs)');
}

function main() {
  const { execFileSync } = require('child_process');
  const { buildMasterPages } = require('./build_master_pages');
  const { buildAllProjectDetailPages } = require('./build_project_detail_pages');

  buildMasterPages();
  buildAllProjectDetailPages();
  execFileSync(process.execPath, [path.join(__dirname, 'build_color_pages_master.js')], { stdio: 'inherit' });
  execFileSync(process.execPath, [path.join(__dirname, 'build_product_detail_pages.js')], { stdio: 'inherit' });

  const legacyRedirects = [
    ['tin-tuc.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['tin-tuc/index.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['tin-tuc/gia-son-nha/index.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['tin-tuc/quy-trinh-son-nha/index.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['tin-tuc/cac-loai-son-nha/index.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['tin-tuc_gia-son-nha.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['tin-tuc_quy-trinh-son-nha.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['tin-tuc_cac-loai-son-nha.html', 'du-an.html', 'Dự án & Định hướng màu sắc', 'Khám phá chuyên mục Dự án & Công trình WANDERS.'],
    ['dang-ky-dai-ly.html', 'lien-he.html', 'Liên hệ hợp tác đại lý', 'Chuyển tới trang Liên hệ WANDERS để đăng ký tư vấn hợp tác đại lý & nhà phân phối.'],
    ['dang-ky-dai-ly/index.html', 'lien-he.html', 'Liên hệ hợp tác đại lý', 'Chuyển tới trang Liên hệ WANDERS để đăng ký tư vấn hợp tác đại lý & nhà phân phối.'],
    ['nha-phan-phoi.html', 'lien-he.html', 'Liên hệ nhà phân phối', 'Chuyển tới trang Liên hệ WANDERS để nhận thông tin hợp tác phân phối.'],
    ['nha-phan-phoi/index.html', 'lien-he.html', 'Liên hệ nhà phân phối', 'Chuyển tới trang Liên hệ WANDERS để nhận thông tin hợp tác phân phối.'],
  ];
  for (const [rel, target, title, desc] of legacyRedirects) {
    replaceLegacyWithRedirect(rel, target, title, desc);
  }

  writeSeoAndManifests();
}

main();

