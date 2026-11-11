const fs = require('fs');

function getPngSize(buf) {
  if (buf.toString('ascii', 1, 4) !== 'PNG') return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20)
  };
}

const dir = 'giao-dien/website_download/images/base44';
fs.readdirSync(dir).filter(f => f.endsWith('.png')).forEach(f => {
  const buf = fs.readFileSync(dir + '/' + f);
  console.log(f, getPngSize(buf));
});

