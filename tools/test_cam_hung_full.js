const fs = require('fs');

const rootFile = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html';
const subFile = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac/index.html';

[rootFile, subFile].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log('Testing file:', f.split('website_download/')[1]);
  
  // Check 276 colors data
  const has276 = content.includes('MH0824') && content.includes('PRAIRIE GENTIAN') && content.includes('DDB3D8');
  console.log('  - Master 276 colors dataset present:', has276);

  // Check Swatch CSS rules
  const hasGridCss = content.includes('paint-swatches-grid') && content.includes('repeat(5, minmax(0, 1fr))');
  console.log('  - 5-column Swatches Grid CSS:', hasGridCss);

  const hasSwatchCellCss = content.includes('paint-swatch-cell') && content.includes('height: 48px');
  console.log('  - Swatch Cell 48px height CSS (No more horizontal lines!):', hasSwatchCellCss);

  // Check Floating Tooltip
  const hasTooltip = content.includes('id="swatchFloatingTooltip"') && content.includes('id="tooltipCode"');
  console.log('  - Swatch Floating Tooltip element:', hasTooltip);

  // Check Selected Color Banner
  const hasSelectedBox = content.includes('id="selectedColorBox"') && content.includes('selected-color-showcase');
  console.log('  - Selected Color Showcase Box (145px clean layout):', hasSelectedBox);

  // Check Pagination
  const hasPagination = content.includes('id="paginationContainer"') && content.includes('renderPagination');
  console.log('  - Pagination system (< [1] 2 3 ... 14 >):', hasPagination);

  // Check Hover vs Click handlers
  const hasHoverLogic = content.includes('el.addEventListener(\'mouseenter\'') && content.includes('renderSelectedBox(selectedColor);');
  console.log('  - Hover preview vs Click confirmation logic:', hasHoverLogic);

  // Check Base44 cleanup
  const hasBase44 = content.includes('id="base44-edit-badge"');
  console.log('  - Base44 badge markup present:', hasBase44 ? 'FAIL' : 'CLEAN');
});

