const fs = require('fs');

function checkDetail(p) {
  const file = `C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/san-pham/${p}/index.html`;
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log(p, '-> H1:', titleMatch ? titleMatch[1] : 'no h1');
}

checkDetail('waterproof-e5-we5');
checkDetail('waterproof-nano-wnano');
checkDetail('xika-bitum-chong-tham-san');
checkDetail('son-chong-nong-cn08');
checkDetail('son-chau-canh-cao-cap');
checkDetail('clear-nano-phu-bong');
checkDetail('son-nhu-cao-cap-mh9999');
checkDetail('bot-ba-noi-ngoai-that-putty');

