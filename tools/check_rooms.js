const fs = require('fs');

// Check available room images in images/
const imgs = [
  'giao-dien/website_download/images/collection-purple-room.jpg',
  'giao-dien/website_download/images/room-purple-clean.jpg',
  'giao-dien/website_download/images/base44/8099d7d28_generated_8abc6bed.png',
  'giao-dien/website_download/images/base44/7f7b7d76e_generated_2a17cf56.png',
  'giao-dien/website_download/images/base44/85e7f93c0_generated_2df1c9b3.png',
  'giao-dien/website_download/images/base44/edf841af7_generated_77536f0e.png',
  'giao-dien/website_download/images/base44/08867f386_generated_9bb6eef6.png',
  'giao-dien/website_download/images/base44/7266e0bc1_generated_27f36fa1.png'
];

imgs.forEach(p => {
  if (fs.existsSync(p)) {
    const s = fs.statSync(p);
    console.log(p, (s.size / 1024).toFixed(1) + ' KB');
  } else {
    console.log(p, 'MISSING');
  }
});

