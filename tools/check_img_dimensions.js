const fs = require('fs');

// We can inspect JPEG header to get width and height
function getJpegSize(buffer) {
  let i = 0;
  if (buffer[i] !== 0xFF || buffer[i + 1] !== 0xD8) return null;
  i += 2;
  while (i < buffer.length) {
    if (buffer[i] !== 0xFF) return null;
    let marker = buffer[i + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      return {
        height: buffer.readUInt16BE(i + 5),
        width: buffer.readUInt16BE(i + 7)
      };
    }
    let len = buffer.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

const f1 = fs.readFileSync('giao-dien/website_download/images/collection-purple-room.jpg');
console.log('collection-purple-room.jpg size:', getJpegSize(f1));

const f2 = fs.readFileSync('giao-dien/website_download/images/room-purple-clean.jpg');
console.log('room-purple-clean.jpg size:', getJpegSize(f2));

