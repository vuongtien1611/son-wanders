const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const {
  renderHead,
  renderHeader,
  renderConsultationCta,
  renderFooter,
  renderMobileDrawer,
  renderCoreScripts,
} = require('./wanders_layout');

const ROOT = 'giao-dien/website_download';
const wb = xlsx.readFile('Sơn WANDERS.xlsx');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wanders_products.json'), 'utf8'));

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cleanText(str) {
  return String(str || '')
    .replace(/\u00a0/g, ' ')
    .replace(/MY\s*HOUR/gi, 'WANDERS')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseExcelDetails(product) {
  const ws = wb.Sheets[product.sheet];
  const rawFeatures = [];
  const rawSpecs = [];
  const rawUsage = [];

  if (ws) {
    const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
    const lines = rows
      .map(r => (r || []).map(c => cleanText(c)).filter(Boolean).join(' '))
      .filter(Boolean);

    let section = 'intro';
    for (const rawLine of lines) {
      // Split inline "+ Key: Val" occurrences into separate lines
      const subLines = rawLine.split(/\s*\+\s*(?=[A-ZÀ-Ỹ])/);
      for (const piece of subLines) {
        const line = piece.trim();
        if (!line) continue;
        const upper = line.toUpperCase();
        if (upper.includes('MÔ TẢ SẢN PHẨM')) { section = 'desc'; continue; }
        if (upper.includes('ĐẶC ĐIỂM SẢN PHẨM') || upper.includes('TÍNH NĂNG')) { section = 'features'; continue; }
        if (upper.includes('THÔNG SỐ KỸ THUẬT')) { section = 'specs'; continue; }
        if (upper.includes('HƯỚNG DẪN SỬ DỤNG') || upper.includes('HƯỚNG DẪN THI CÔNG')) { section = 'usage'; continue; }
        if (upper.includes('THÔNG TIN CẢNH BÁO') || upper.includes('AN TOÀN')) { section = 'warnings'; continue; }

        const cleaned = line.replace(/^[+•\-–*]\s*/, '').trim();
        if (!cleaned || cleaned.length < 4) continue;
        if (section === 'features') rawFeatures.push(cleaned);
        else if (section === 'specs') rawSpecs.push(cleaned);
        else if (section === 'usage') rawUsage.push(cleaned);
      }
    }
  }

  // Convert specs array into clean { label, value } pairs
  const specPairs = [];
  const seenLabels = new Set();
  for (const s of rawSpecs) {
    if (/^(TT|Các thông số|Các chỉ tiêu|Sản phẩm sản xuất theo)/i.test(s)) continue;
    const colonIdx = s.indexOf(':');
    if (colonIdx > 1 && colonIdx < 48) {
      let label = s.slice(0, colonIdx).trim();
      let val = s.slice(colonIdx + 1).trim();
      if (!val || label.toLowerCase().includes('xuất xứ') && val.length < 3) continue;
      if (/^(thành phần cấu tạo|thành phần)$/i.test(label)) label = 'Thành phần';
      if (/^(kích thước bao bì|quy cách)$/i.test(label)) label = 'Quy cách đóng gói';
      if (/^(độ phủ|độ phủ lý thuyết)$/i.test(label)) label = 'Độ phủ lý thuyết';
      if (!seenLabels.has(label.toLowerCase()) && val) {
        seenLabels.add(label.toLowerCase());
        specPairs.push({ label, value: val });
      }
    }
  }

  // Ensure standard core specs always exist cleanly (only add ISO/QCVN when verified in Excel sheet)
  const sheetTextAll = ws ? xlsx.utils.sheet_to_json(ws, { header: 1 }).map(r => (r || []).join(' ')).join(' ') : '';
  const hasIsoVerified = /ISO\s*9001/i.test(sheetTextAll);
  if (!seenLabels.has('mã sản phẩm')) specPairs.unshift({ label: 'Mã sản phẩm', value: product.code });
  if (!seenLabels.has('quy cách đóng gói')) specPairs.push({ label: 'Quy cách đóng gói', value: product.packaging });
  if (hasIsoVerified && !seenLabels.has('tiêu chuẩn')) specPairs.push({ label: 'Tiêu chuẩn chất lượng', value: 'ISO 9001:2015 & QCVN 16:2014/BXD' });

  // Clean features (ensure 4 concise points)
  const features = rawFeatures.filter(f => !f.includes(':') || f.length < 110).slice(0, 4);
  const categoryDefaultFeatures = {
    'son-noi-that': [
      'Màng sơn mịn đẹp, màu sắc bền lâu và thân thiện môi trường',
      'Hàm lượng VOC thấp, mùi nhẹ dễ chịu khi thi công',
      'Kháng kiềm, hạn chế nấm mốc và dễ vệ sinh bề mặt',
      'Độ che phủ cao, bám dính tốt trên tường và trần nhà'
    ],
    'son-ngoai-that': [
      'Màng sơn bền thời tiết, chống chịu nắng mưa khắc nghiệt',
      'Hạn chế bám bụi, chống rêu mốc và kiềm hóa hiệu quả',
      'Độ bền màu cao dưới bức xạ UV mặt trời',
      'Phù hợp bề mặt tường xây, vữa trát và bê tông ngoại thất'
    ],
    'son-lot': [
      'Kháng kiềm và chống muối hóa vượt trội từ bên trong tường',
      'Tăng cường độ bám dính giữa bề mặt tường và lớp sơn phủ',
      'Giúp màu sơn hoàn thiện lên chuẩn xác và đồng đều hơn',
      'Ngăn ngừa hiện tượng loang màu, bong tróc màng sơn'
    ],
    'chong-tham': [
      'Ngăn chặn nước mưa thấm xuyên kết cấu tường và sàn mái',
      'Độ bám dính cao trên bề mặt xi măng, bê tông và vữa trát',
      'Màng chống thấm đàn hồi, che phủ vết nứt chân chim nhỏ',
      'Bền bỉ trước điều kiện khí hậu nóng ẩm mưa nhiều'
    ],
    'son-chong-nong': [
      'Phản xạ bức xạ nhiệt mặt trời, giảm nhiệt độ bề mặt hiệu quả',
      'Bám dính tốt trên mái tôn, vách tôn và tường đứng bê tông',
      'Giảm tiếng ồn trên mái tôn khi trời mưa lớn',
      'Kéo dài tuổi thọ kết cấu mái và tiết kiệm điện năng làm mát'
    ],
    'san-pham-khac': [
      'Công thức chuyên dụng đáp ứng từng hạng mục hoàn thiện đặc thù',
      'Độ bám dính ổn định, dễ thi công trên nhiều loại vật liệu',
      'Thân thiện môi trường, không chứa chì và thủy ngân',
      'Sản xuất theo quy trình kiểm soát chất lượng ISO 9001:2015'
    ]
  };
  const finalFeatures = features.length >= 2 ? features : (categoryDefaultFeatures[product.category] || categoryDefaultFeatures['san-pham-khac']);

  // Clean usage steps
  const usageSteps = rawUsage
    .filter(u => u.length > 10 && !/^HƯỚNG DẪN/i.test(u))
    .slice(0, 6);
  const finalUsage = usageSteps.length >= 2 ? usageSteps : [
    'Làm sạch bề mặt cần thi công, đảm bảo khô ráo, không còn bụi bẩn, dầu mỡ hoặc rêu mốc.',
    'Tường mới cần để khô và ổn định kết cấu ít nhất 21 ngày trước khi sơn.',
    'Khuấy đều trước khi sử dụng; có thể pha tối đa 5% nước sạch nếu cần và thi công 2 lớp đạt chuẩn.'
  ];

  // Category applications
  const appsMap = {
    'son-noi-that': ['Tường phòng khách, phòng ngủ và khu vực sinh hoạt', 'Trần thạch cao, bề mặt vữa trát và bê tông nội thất'],
    'son-ngoai-that': ['Mặt tiền nhà phố, biệt thự và công trình thương mại', 'Tường bao, ban công và các bề mặt ngoại thất tiếp xúc thời tiết'],
    'son-lot': ['Lớp lót bảo vệ tường mới trước khi sơn phủ màu hoàn thiện', 'Xử lý bề mặt bê tông, hồ vữa có độ kiềm cao hoặc tường cải tạo'],
    'chong-tham': ['Tường đứng ngoại thất, vách hông tiếp xúc mưa tạt', 'Sàn mái, ban công, sê nô, nhà vệ sinh và khu vực ẩm ướt'],
    'son-chong-nong': ['Mái tôn nhà xưởng, nhà ở và các công trình dân dụng', 'Tường hướng Tây, mái bê tông chịu bức xạ nhiệt cao'],
    'san-pham-khac': ['Làm phẳng, hoàn thiện hoặc bảo vệ chuyên sâu cho từng bề mặt vật liệu', 'Ứng dụng linh hoạt cho công trình dân dụng, trang trí và cải tạo']
  };

  return {
    features: finalFeatures,
    specs: specPairs.slice(0, 9),
    hasIsoVerified,
    usage: finalUsage,
    applications: appsMap[product.category] || appsMap['san-pham-khac']
  };
}

function renderCardHtml(p, prefix) {
  return `
      <a class="sp-product-card" href="${prefix}${escapeHtml(p.link)}" data-cat="${escapeHtml(p.category)}">
        <div class="wpc-top">
          <span class="wpc-code">${escapeHtml(p.code)}</span>
          <span class="wpc-badge">${escapeHtml(p.packaging)}</span>
        </div>
        <div class="wpc-media">
          <img src="${prefix}${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="wpc-img" decoding="async">
        </div>
        <div class="wpc-body">
          <p class="wpc-cat">${escapeHtml(p.categoryName)}</p>
          <h3 class="wpc-title">${escapeHtml(p.name)}</h3>
          <p class="wpc-desc">${escapeHtml(p.desc)}</p>
          <div class="wpc-footer">
            <span class="wpc-cta">
              <span>Xem chi tiết</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wpc-cta-arrow">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
        </div>
      </a>`;
}

function nhomSlugForCategory(cat) {
  const map = {
    'son-noi-that': 'noi-that',
    'son-ngoai-that': 'ngoai-that',
    'chong-tham': 'chong-tham',
    'son-lot': 'son-lot',
    'son-chong-nong': 'chong-nong',
    'san-pham-khac': 'khac'
  };
  return map[cat] || 'noi-that';
}

function buildProductDetailHtml(product, prefix) {
  const details = parseExcelDetails(product);
  const nhomSlug = nhomSlugForCategory(product.category);

  // Pick 4 related products (prioritize same category, then pad if needed)
  let related = products.filter(x => x.category === product.category && x.code !== product.code);
  if (related.length < 4) {
    const others = products.filter(x => x.category !== product.category);
    related = related.concat(others.slice(0, 4 - related.length));
  }
  related = related.slice(0, 4);

  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: `${product.name} (${product.code}) — WANDERS`,
  description: product.desc.slice(0, 155),
  ogImage: product.image,
  canonicalPath: product.link,
  extraCss: ['wanders_product_card.css'],
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'san-pham')}

  <main>
    <!-- Breadcrumb Bar -->
    <div class="border-b border-[#E2DDD2] w-bg-white">
      <div class="wanders-container flex flex-wrap items-center gap-2 py-4 text-[11.5px] text-[#5A6468]">
        <a class="transition-colors hover:text-[#073B2E]" href="${prefix}san-pham.html">Sản phẩm</a>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg>
        <a class="transition-colors hover:text-[#073B2E]" href="${prefix}san-pham.html?nhom=${nhomSlug}">${escapeHtml(product.categoryName)}</a>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg>
        <span class="text-[#073B2E] font-medium">${escapeHtml(product.name)}</span>
      </div>
    </div>

    <!-- Product Hero Section (Warm Ivory) -->
    <section class="w-bg-ivory py-14 lg:py-20">
      <div class="wanders-container">
        <div class="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 items-start">

          <!-- Left: Real WANDERS Product Bucket Showcase -->
          <div class="min-w-0 w-reveal">
            <div class="wpd-showcase-card">
              <div class="wpc-top">
                <span class="wpc-code">${escapeHtml(product.code)}</span>
                <span class="wpc-badge">${escapeHtml(product.packaging)}</span>
              </div>
              <div class="wpd-showcase-stage">
                <img src="${prefix}${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="wpd-showcase-img" decoding="async">
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-[#E2DDD2] text-[11px] uppercase tracking-[0.14em] text-[#5A6468]">
                <span>WANDERS Paint</span>
                <span>${details.hasIsoVerified ? 'ISO 9001:2015' : escapeHtml(product.code)}</span>
              </div>
            </div>
            <p class="mt-3 text-[11.5px] leading-relaxed text-[#5A6468]">Hình ảnh bao bì chính thức của sản phẩm ${escapeHtml(product.code)} thương hiệu WANDERS.</p>
          </div>

          <!-- Right: Product Identity, Description & Key Features -->
          <div class="min-w-0 w-reveal w-reveal-delay-1">
            <p class="w-eyebrow"><span class="w-eyebrow-line"></span>${escapeHtml(product.categoryName)}</p>
            <h1 class="w-subhero-title mt-4 text-[#073B2E]">
              ${escapeHtml(product.name)}
            </h1>
            <p class="mt-3 font-mono text-[11.5px] uppercase tracking-[0.12em] text-[#5A6468]">
              Mã: ${escapeHtml(product.code)} · Quy cách: ${escapeHtml(product.packaging)}
            </p>
            <p class="mt-6 max-w-[60ch] text-[15.5px] leading-[1.8] text-[#273238]/88">
              ${escapeHtml(product.desc)}
            </p>

            <!-- Features Grid -->
            <div class="mt-8 border-t border-[#E2DDD2] pt-6">
              <p class="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#073B2E]">Đặc điểm nổi bật</p>
              <ul class="mt-4 grid gap-3 sm:grid-cols-2">
                ${details.features.map(f => `
                  <li class="flex gap-2.5 text-[14px] leading-relaxed text-[#273238]/85">
                    <span class="mt-2 h-1.5 w-1.5 shrink-0 bg-[#D6AD45] rounded-full"></span>
                    <span>${escapeHtml(f)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Action CTAs -->
            <div class="mt-9 flex flex-col gap-3 sm:flex-row">
              <a class="w-btn w-btn-forest w-full sm:w-auto" href="${prefix}lien-he.html">
                <span>Nhận tư vấn sản phẩm</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
              <a class="w-btn w-btn-outline-forest w-full sm:w-auto" href="${prefix}bang-mau.html">
                <span>Xem bảng màu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-btn-arrow h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Applications, Usage Guide & Technical Specifications (White) -->
    <section class="border-t border-[#E2DDD2] w-bg-white py-14 lg:py-20">
      <div class="wanders-container">
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">

          <div class="min-w-0 w-reveal">
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#073B2E]">Ứng dụng</p>
            <ul class="mt-5 divide-y divide-[#E2DDD2] border-y border-[#E2DDD2]">
              ${details.applications.map(a => `
                <li class="py-4 text-[14.5px] leading-relaxed text-[#273238]/88">${escapeHtml(a)}</li>
              `).join('')}
            </ul>

            <p class="mt-10 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#073B2E]">Hướng dẫn thi công</p>
            <ol class="mt-5 space-y-4">
              ${details.usage.map((step, i) => `
                <li class="flex gap-4 text-[14px] leading-[1.7] text-[#273238]/88">
                  <span class="font-mono text-[11.5px] font-bold text-[#D6AD45] shrink-0">0${i + 1}</span>
                  <span>${escapeHtml(step)}</span>
                </li>
              `).join('')}
            </ol>
          </div>

          <div class="min-w-0 w-reveal w-reveal-delay-1">
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-[#073B2E]">Thông số kỹ thuật</p>
            <dl class="mt-5 divide-y divide-[#E2DDD2] border-y border-[#E2DDD2]">
              ${details.specs.map(s => `
                <div class="flex items-baseline justify-between gap-6 py-4">
                  <dt class="text-[13.5px] font-medium text-[#273238]/85 shrink-0">${escapeHtml(s.label)}</dt>
                  <dd class="text-right text-[13px] text-[#5A6468]">${escapeHtml(s.value)}</dd>
                </div>
              `).join('')}
            </dl>
            <p class="mt-4 text-[12px] leading-relaxed text-[#5A6468]">
              Sản phẩm WANDERS được sản xuất theo hệ thống quản lý chất lượng ISO 9001:2015, đảm bảo an toàn sức khỏe và thân thiện môi trường.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- Related Products (Warm Ivory) -->
    <section class="border-t border-[#E2DDD2] w-bg-ivory py-14 lg:py-20">
      <div class="wanders-container">
        <div class="flex items-end justify-between gap-6 mb-8 w-reveal">
          <h2 class="w-section-title text-[#073B2E]">Sản phẩm liên quan</h2>
          <a class="w-text-link shrink-0" href="${prefix}san-pham.html">
            <span>Tất cả sản phẩm</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
        <div class="wanders-products-grid w-reveal" id="relatedProductsGrid">
          ${related.map(r => renderCardHtml(r, prefix)).join('\n')}
        </div>
      </div>
    </section>

    ${renderConsultationCta(prefix)}
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}
  ${renderCoreScripts(prefix)}
</body>
</html>`;
}

function buildCategoryPageHtml(catInfo, prefix) {
  const catProducts = products.filter(p => p.category === catInfo.category);
  return `<!DOCTYPE html>
<html lang="vi">
${renderHead({
  prefix,
  title: `${catInfo.title} — WANDERS`,
  description: catInfo.desc,
  ogImage: 'images/base44/85e7f93c0_generated_2df1c9b3.png',
  canonicalPath: `san-pham/${catInfo.slug}/index.html`,
  extraCss: ['wanders_product_card.css'],
})}
<body class="font-body antialiased">
  ${renderHeader(prefix, 'san-pham')}

  <main>
    <div class="border-b border-[#E2DDD2] w-bg-white">
      <div class="wanders-container flex flex-wrap items-center gap-2 py-4 text-[11.5px] text-[#5A6468]">
        <a class="transition-colors hover:text-[#073B2E]" href="${prefix}san-pham.html">Sản phẩm</a>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg>
        <span class="text-[#073B2E] font-medium">${escapeHtml(catInfo.title)}</span>
      </div>
    </div>

    <section class="w-bg-ivory py-14 lg:py-20">
      <div class="wanders-container">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10 w-reveal">
          <div>
            <p class="w-eyebrow"><span class="w-eyebrow-line"></span>Danh mục sản phẩm</p>
            <h1 class="w-subhero-title mt-3 text-[#073B2E]">${escapeHtml(catInfo.title)}</h1>
            <p class="mt-3 max-w-[58ch] text-[15px] leading-[1.7] text-[#5A6468]">${escapeHtml(catInfo.desc)}</p>
          </div>
          <a class="w-text-link shrink-0" href="${prefix}san-pham.html">
            <span>Xem tất cả ${products.length} sản phẩm</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>

        <div class="wanders-products-grid w-reveal">
          ${catProducts.map(p => renderCardHtml(p, prefix)).join('\n')}
        </div>
      </div>
    </section>

    ${renderConsultationCta(prefix)}
  </main>

  ${renderFooter(prefix)}
  ${renderMobileDrawer(prefix)}
  ${renderCoreScripts(prefix)}
</body>
</html>`;
}

// 1. Compile all 24 Product Detail Pages (both san-pham/<slug>/index.html & root san-pham_<slug>.html if exists)
let compiledProducts = 0;
for (const p of products) {
  const subdirPath = path.join(ROOT, p.link); // san-pham/<slug>/index.html
  fs.mkdirSync(path.dirname(subdirPath), { recursive: true });
  fs.writeFileSync(subdirPath, buildProductDetailHtml(p, '../../'), 'utf8');
  compiledProducts++;

  // Also update root alias san-pham_<slug>.html if it exists
  const slug = p.link.replace('san-pham/', '').replace('/index.html', '');
  const rootAlias = path.join(ROOT, `san-pham_${slug}.html`);
  if (fs.existsSync(rootAlias)) {
    fs.writeFileSync(rootAlias, buildProductDetailHtml(p, './'), 'utf8');
  }
}

// 2. Compile 6 Category Pages
const CATEGORIES = [
  { slug: 'son-noi-that', category: 'son-noi-that', title: 'Sơn nội thất WANDERS', desc: 'Dòng sơn phủ nội thất bề mặt mịn bóng sang trọng, hàm lượng VOC thấp và dễ vệ sinh.' },
  { slug: 'son-ngoai-that', category: 'son-ngoai-that', title: 'Sơn ngoại thất WANDERS', desc: 'Giải pháp sơn ngoại thất bền màu vượt trội, chống rêu mốc và chịu nắng mưa khắc nghiệt.' },
  { slug: 'son-lot', category: 'son-lot', title: 'Sơn lót kháng kiềm WANDERS', desc: 'Lớp lót bảo vệ chuyên sâu giúp kháng kiềm, kháng muối và tăng cường độ bám dính lớp phủ.' },
  { slug: 'son-chong-tham', category: 'chong-tham', title: 'Sơn chống thấm WANDERS', desc: 'Hệ thống vật liệu chống thấm đàn hồi cao bảo vệ tường đứng, sàn mái và ban công.' },
  { slug: 'son-chong-nong', category: 'son-chong-nong', title: 'Sơn chống nóng WANDERS', desc: 'Sơn cách nhiệt phản xạ tia UV, giúp hạ nhiệt bề mặt mái tôn và tường công trình.' },
  { slug: 'san-pham-khac', category: 'san-pham-khac', title: 'Sản phẩm phụ trợ & Đặc dụng', desc: 'Bột bả nội ngoại thất, sơn phủ bóng bảo vệ, sơn nhũ vàng, phụ gia kết nối và sơn chậu cảnh.' }
];

let compiledCats = 0;
for (const c of CATEGORIES) {
  const catSubdir = path.join(ROOT, 'san-pham', c.slug, 'index.html');
  fs.mkdirSync(path.dirname(catSubdir), { recursive: true });
  fs.writeFileSync(catSubdir, buildCategoryPageHtml(c, '../../'), 'utf8');
  compiledCats++;

  const rootCatAlias = path.join(ROOT, `san-pham_${c.slug}.html`);
  if (fs.existsSync(rootCatAlias)) {
    fs.writeFileSync(rootCatAlias, buildCategoryPageHtml(c, './'), 'utf8');
  }
}

console.log(`Compiled ${compiledProducts} product detail pages and ${compiledCats} category pages in WANDERS Architectural style!`);

