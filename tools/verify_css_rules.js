const fs = require('fs');

const css = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');

const checks = [
  '740px !important',
  'min-width: 680px',
  'repeat(2, minmax(0, 1fr))',
  'white-space: nowrap',
  'white-space: normal',
  'z-index: 999999',
  '.nav-dropdown::after',
  'overflow: visible !important'
];

let allPassed = true;
checks.forEach(c => {
  const ok = css.includes(c);
  console.log(`Checking "${c}":`, ok ? 'PASS ✅' : 'FAIL ❌');
  if (!ok) allPassed = false;
});

console.log('CSS Verification Result:', allPassed ? 'ALL PASSED ✅' : 'SOME CHECKS FAILED ❌');

