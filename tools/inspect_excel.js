const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:/Users/Admin/Documents/sơn myhouse/Sơn WANDERS.xlsx');
console.log('Sheets in Excel:', workbook.SheetNames);
workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log('---', sheetName, '---');
  for (let i = 0; i < Math.min(json.length, 5); i++) {
    if (json[i] && json[i].length > 0) {
      console.log(json[i].slice(0, 3));
    }
  }
});

