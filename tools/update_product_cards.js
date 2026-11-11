const fs = require('fs');
const path = require('path');

const products = JSON.parse(
  fs.readFileSync('giao-dien/website_download/data/wanders_products.json', 'utf8')
);

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCardsHtml(prefix) {
  return products.map(p => {
    const href = prefix + p.link;
    const imgSrc = prefix + p.image;
    const code = escapeHtml(p.code);
    const packaging = escapeHtml(p.packaging);
    const catName = escapeHtml(p.categoryName);
    const name = escapeHtml(p.name);
    const desc = escapeHtml(p.desc);
    const catSlug = escapeHtml(p.category);

    return `
      <a class="sp-product-card" href="${href}" data-cat="${catSlug}">
        <div class="wpc-top">
          <span class="wpc-code">${code}</span>
          <span class="wpc-badge">${packaging}</span>
        </div>
        <div class="wpc-media">
          <img src="${imgSrc}" alt="${name}" class="wpc-img" loading="lazy">
        </div>
        <div class="wpc-body">
          <p class="wpc-cat">${catName}</p>
          <h3 class="wpc-title">${name}</h3>
          <p class="wpc-desc">${desc}</p>
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
  }).join('\n');
}

function updateFile(filePath, isSubdir) {
  const prefix = isSubdir ? '../' : './';
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add CSS link if not already present
  const cssTag = `<link rel="stylesheet" href="${prefix}assets/wanders_product_card.css">`;
  if (!html.includes('wanders_product_card.css')) {
    html = html.replace(
      `<link rel="stylesheet" href="${prefix}assets/base44.css">`,
      `<link rel="stylesheet" href="${prefix}assets/base44.css">\n  ${cssTag}`
    );
  }

  // 2. Replace #allProductsGrid block
  const startMarkerRegex = /<div class="[^"]*" id="allProductsGrid">/;
  const startMatch = html.match(startMarkerRegex);
  if (!startMatch) {
    throw new Error(`Could not find #allProductsGrid in ${filePath}`);
  }
  const startIdx = html.indexOf(startMatch[0]);
  const endMarker = '\n    </div>\n  </div></section>';
  const endIdx = html.indexOf(endMarker, startIdx);
  if (endIdx === -1) {
    throw new Error(`Could not find closing marker after #allProductsGrid in ${filePath}`);
  }

  const newGridBlock = `<div class="mt-10 wanders-products-grid" id="allProductsGrid">\n${buildCardsHtml(prefix)}\n    </div>`;
  html = html.slice(0, startIdx) + newGridBlock + html.slice(endIdx + '\n    </div>'.length);

  // 3. Fix filter script display mode so Flexbox card alignment is preserved
  html = html.replace(/c\.style\.display = 'block';/g, "c.style.display = '';");
  html = html.replace(/card\.style\.display = 'block';/g, "card.style.display = '';");

  // 4. For subdirectory index.html, ensure ALL relative ./images/, ./assets/, ./data/ paths (including inside srcset) use ../
  if (isSubdir) {
    html = html.replace(/(["'\s,])\.\/(images|assets|data)\//g, '$1../$2/');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated product cards in:', filePath);
}

updateFile('giao-dien/website_download/san-pham.html', false);
updateFile('giao-dien/website_download/san-pham/index.html', true);

