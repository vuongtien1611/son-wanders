const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../website_download/images/introl');
const files = fs.readdirSync(dir);
console.log('Directory:', dir);
console.log('Total files:', files.length);

for (const name of files) {
  const full = path.join(dir, name);
  const stat = fs.statSync(full);
  const buf = fs.readFileSync(full);
  let info = 'unknown';
  // Check PNG signature
  if (buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const bitDepth = buf[24];
    const colorType = buf[25]; // 6 = RGBA (has alpha), 2 = RGB, 3 = indexed
    const hasTRNS = buf.includes(Buffer.from('tRNS'));
    info = `PNG ${w}x${h} bit=${bitDepth} colorType=${colorType} (alpha=${colorType === 6 || colorType === 4 || hasTRNS})`;
  } else if (buf[0] === 0xff && buf[1] === 0xd8) {
    info = 'JPEG';
  } else if (buf.slice(0, 4).toString() === 'RIFF') {
    info = 'WEBP';
  }
  console.log(`- ${name} | ${(stat.size / 1024).toFixed(1)} KB | ${info}`);
}

