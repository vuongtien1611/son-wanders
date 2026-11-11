const fs = require('fs');

const f1 = 'giao-dien/website_download/images/collection-purple-room.jpg';
const f2 = 'giao-dien/website_download/images/room-purple-clean.jpg';
console.log('f1 size:', fs.statSync(f1).size);
console.log('f2 size:', fs.statSync(f2).size);

