const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:/Users/Admin/Documents/sơn myhouse/Sơn WANDERS.xlsx');

const sheets = [
  'CT xi măng',
  'CT màu',
  'CT Bitum',
  'CT lộ thiên',
  'Chống nóng',
  'Nhũ vàng',
  'Bóng Clear',
  '2K',
  'Bột bả nội',
  'Bột bả ngoại',
  'Latex',
  'Sheet1'
];

const result = {};
sheets.forEach(sh => {
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sh], { header: 1 });
  result[sh] = data.filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== ''));
});

console.log(JSON.stringify(result, null, 2).substring(0, 4000));

