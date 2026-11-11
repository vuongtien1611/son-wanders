const fs = require('fs');

const html = fs.readFileSync('giao-dien/website_download/san-pham.html', 'utf8');
const testCodes = ['IN3*', 'EX555', 'WATERPROOF-CT B5', 'LĐN 515', 'CK818', 'CN08', 'PRIMER NANOTECH', 'MH 9999', 'CLEAR NANO', 'PHỦ BÓNG 2K', 'PUTTY INTER', 'PUTTY EXTER'];

const results = testCodes.map(c => ({ code: c, found: html.includes(c) }));
console.log('Authentic Excel Product Verification in san-pham.html:');
console.table(results);

const count = (html.match(/sp-product-card/g) || []).length;
console.log('Total Product Cards in san-pham.html:', count);

// Check that no unauthorized fake codes like KL01 or EX2* exist
console.log('Contains unauthorized KL01:', html.includes('KL01'));
console.log('Contains unauthorized EX2*:', html.includes('EX2*'));

