const fs = require('fs');

const glob = [
  'san-pham/bronze-for-interior-in3000/index.html',
  'san-pham/silver-for-interior-in5000/index.html',
  'san-pham/silk-for-interior-in6000/index.html',
  'san-pham/gold-for-interior-in8000/index.html',
  'san-pham/diamond-for-interior-in9000/index.html',
  'san-pham/satin-for-exterior-ex5000/index.html',
  'san-pham/titan-for-exterior-ex7000/index.html',
  'san-pham/anti-uv-exterior-ex9000/index.html',
  'san-pham/sealer-super-sp5000/index.html',
  'san-pham/sealer-pro-sp8000/index.html',
  'san-pham/sealer-nano-sn8000/index.html',
  'san-pham/primer-nanotech-khang-muoi/index.html',
  'san-pham/waterproof-nano-wnano/index.html',
  'san-pham/waterproof-e5-we5/index.html',
  'san-pham/xika-bitum-chong-tham-san/index.html',
  'san-pham/xika-lastic/index.html',
  'san-pham/son-chong-nong-cn08/index.html',
  'san-pham/son-nhu-cao-cap-mh9999/index.html',
  'san-pham/clear-nano-phu-bong/index.html',
  'san-pham/son-bong-2k/index.html',
  'san-pham/bot-ba-noi-ngoai-that-putty/index.html',
  'san-pham/bot-ba-ngoai-that-cao-cap/index.html',
  'san-pham/phu-gia-chong-tham-latex-mh/index.html',
  'san-pham/son-chau-canh-cao-cap/index.html'
];

glob.forEach(f => {
  const p = 'giao-dien/website_download/' + f;
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const m = html.match(/src="([^"]*(?:ChatGPT|product-|images\/)[^"]*)"/i);
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    console.log(f.split('/')[1]);
    console.log('   Title:', titleMatch ? titleMatch[1].trim() : 'N/A');
    console.log('   Image:', m ? m[1] : 'N/A');
  } else {
    console.log(f, 'MISSING');
  }
});

