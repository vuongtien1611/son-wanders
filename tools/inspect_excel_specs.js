const xlsx = require('xlsx');
const wb = xlsx.readFile('Sơn WANDERS.xlsx');
console.log('Sheets:', wb.SheetNames);
['IN 525', 'EX 555', 'CT xi măng', 'Chống nóng'].forEach(name => {
  console.log('\n=== SHEET:', name, '===');
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[name], { header: 1 });
  rows.forEach((r, i) => {
    const t = (r || []).map(x => String(x || '').trim()).filter(Boolean).join(' | ');
    if (t) console.log(i + ':', t);
  });
});

