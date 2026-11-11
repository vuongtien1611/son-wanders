const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = xlsx.readFile('Sơn WANDERS.xlsx', { bookFiles: true });
const files = wb.files;

// 1. Parse workbook.xml to get sheet names and their r:id
const wbXml = files['xl/workbook.xml'].content.toString('utf8');
const wbRelsXml = files['xl/_rels/workbook.xml.rels'].content.toString('utf8');

// Parse rId -> sheet target
const rIdToTarget = {};
const relsRegex = /<Relationship[^>]+Id="([^"]+)"[^>]+Target="([^"]+)"/g;
let m;
while ((m = relsRegex.exec(wbRelsXml)) !== null) {
  rIdToTarget[m[1]] = m[2];
}

// Parse sheet name -> r:id
const sheetNameToRId = {};
const sheetOrder = [];
const sheetRegex = /<sheet[^>]+name="([^"]+)"[^>]+sheetId="([^"]+)"[^>]+r:id="([^"]+)"/g;
while ((m = sheetRegex.exec(wbXml)) !== null) {
  const name = m[1];
  const rId = m[3];
  sheetNameToRId[name] = rId;
  sheetOrder.push({ name, rId, target: rIdToTarget[rId] });
}

console.log('--- STEP 1: SHEETS IN WORKBOOK ---');
console.log(`Found ${sheetOrder.length} sheets.`);

// 2. Trace each sheet to its drawing
const outDir = path.join(__dirname, '../website_download/images/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const mapping = [];

sheetOrder.forEach((sh, idx) => {
  // target is typically "worksheets/sheet1.xml"
  const sheetFile = 'xl/' + sh.target;
  const sheetRelFile = 'xl/worksheets/_rels/' + path.basename(sh.target) + '.rels';

  let drawingFile = null;
  if (files[sheetRelFile]) {
    const sRelData = files[sheetRelFile].content.toString('utf8');
    const drawM = sRelData.match(/Target="\.\.\/(drawings\/drawing\d+\.xml)"/);
    if (drawM) {
      drawingFile = 'xl/' + drawM[1];
    }
  }

  let imageFile = null;
  if (drawingFile) {
    const drawingRelFile = 'xl/drawings/_rels/' + path.basename(drawingFile) + '.rels';
    if (files[drawingRelFile]) {
      const dRelData = files[drawingRelFile].content.toString('utf8');
      const imgM = dRelData.match(/Target="\.\.\/(media\/image\d+\.(?:jpeg|png|jpg))"/);
      if (imgM) {
        imageFile = 'xl/' + imgM[1];
      }
    }
  }

  // Extract the image buffer
  let savedLocalPath = null;
  let fileSize = 0;
  if (imageFile && files[imageFile]) {
    const ext = path.extname(imageFile);
    // Standardize slug name for file
    const safeSheetName = sh.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const outFilename = `wanders-${safeSheetName}${ext}`;
    const outFullPath = path.join(outDir, outFilename);

    const rawBuffer = files[imageFile].content;
    fs.writeFileSync(outFullPath, rawBuffer);
    fileSize = rawBuffer.length;
    savedLocalPath = `images/products/${outFilename}`;
  }

  mapping.push({
    index: idx + 1,
    sheetName: sh.name,
    sheetFile: sh.target,
    drawingFile,
    imageFile,
    savedLocalPath,
    fileSize
  });
});

console.log('\n--- STEP 2: EXACT MAPPING SUMMARY ---');
console.table(mapping.map(m => ({
  '#': m.index,
  'Sheet': m.sheetName,
  'Media In Excel': m.imageFile || 'NONE',
  'Extracted File': m.savedLocalPath || 'NONE',
  'Size (B)': m.fileSize
})));

fs.writeFileSync(path.join(__dirname, 'excel_image_mapping.json'), JSON.stringify(mapping, null, 2));
