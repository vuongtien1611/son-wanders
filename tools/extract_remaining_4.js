const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:/Users/Admin/Documents/sơn myhouse/Sơn WANDERS.xlsx');

['CT lộ thiên', '2K', 'Bột bả ngoại', 'Latex'].forEach(sh => {
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sh], { header: 1 });
  console.log('============================', sh);
  data.forEach(r => {
    if (r && r.length > 0) console.log(r.filter(Boolean).join(' | '));
  });
});

