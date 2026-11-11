const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('Sơn WANDERS.xlsx');
const products = JSON.parse(fs.readFileSync('giao-dien/website_download/data/wanders_products.json', 'utf8'));

function cleanText(str) {
  return String(str || '')
    .replace(/\u00a0/g, ' ')
    .replace(/MY\s*HOUR/gi, 'WANDERS')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSheet(sheetName) {
  const ws = wb.Sheets[sheetName];
  if (!ws) return null;
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
  const lines = rows
    .map(r => (r || []).map(c => cleanText(c)).filter(Boolean).join(' '))
    .filter(Boolean);

  let section = 'intro';
  const data = {
    features: [],
    specs: [],
    usage: [],
    warnings: []
  };

  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper.includes('MÔ TẢ SẢN PHẨM')) { section = 'desc'; continue; }
    if (upper.includes('ĐẶC ĐIỂM SẢN PHẨM')) { section = 'features'; continue; }
    if (upper.includes('THÔNG SỐ KỸ THUẬT')) { section = 'specs'; continue; }
    if (upper.includes('HƯỚNG DẪN SỬ DỤNG') || upper.includes('HƯỚNG DẪN THI CÔNG')) { section = 'usage'; continue; }
    if (upper.includes('THÔNG TIN CẢNH BÁO') || upper.includes('AN TOÀN')) { section = 'warnings'; continue; }

    const cleaned = line.replace(/^[+•\-–*]\s*/, '').trim();
    if (!cleaned) continue;

    if (section === 'features') data.features.push(cleaned);
    else if (section === 'specs') data.specs.push(cleaned);
    else if (section === 'usage') data.usage.push(cleaned);
    else if (section === 'warnings') data.warnings.push(cleaned);
  }
  return data;
}

products.forEach(p => {
  const parsed = parseSheet(p.sheet);
  console.log(`\n[${p.code}] (${p.sheet}) -> features:${parsed?.features.length} specs:${parsed?.specs.length} usage:${parsed?.usage.length} warn:${parsed?.warnings.length}`);
  if (parsed && parsed.specs.length > 0) {
    console.log('  Sample specs:', parsed.specs.slice(0, 4).join(' || '));
  }
});

