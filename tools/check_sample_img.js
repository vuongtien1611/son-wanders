const fs = require('fs');

const imgPath = 'C:/Users/Admin/.gemini/antigravity/brain/cfab6cee-0d29-42b2-9b09-bea16f5d5c63/.user_uploaded/media_1793928054392_733a4a21.jpg';
console.log('Exists:', fs.existsSync(imgPath));
const stats = fs.statSync(imgPath);
console.log('Size:', stats.size);

