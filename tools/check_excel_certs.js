const xlsx = require('xlsx');
const wb = xlsx.readFile('Sơn WANDERS.xlsx');
for (const s of wb.SheetNames) {
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[s], { header: 1 });
  const text = rows.map(r => (r || []).join(' ')).join('\n');
  const iso = text.match(/ISO[^\n]*/i);
  const qcvn = text.match(/QCVN[^\n]*/i);
  const anh = text.match(/Vương quốc Anh|Anh Quốc|Germany/i);
  console.log(`${s}: ISO=${!!iso} (${iso ? iso[0].slice(0,40) : ''}) | QCVN=${!!qcvn} (${qcvn ? qcvn[0].slice(0,40) : ''}) | origin=${anh ? anh[0] : 'none'}`);
}

