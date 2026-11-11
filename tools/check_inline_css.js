const fs = require('fs');

const f = fs.readFileSync('c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/cam-hung-mau-sac.html', 'utf8');

const m = f.match(/<style id="site-main-css">([\s\S]*?)<\/style>/);
if (m) {
  const css = m[1];
  console.log('site-main-css has nav-dropdown:', css.includes('nav-dropdown'));
  if (css.includes('nav-dropdown')) {
    let idx = css.indexOf('nav-dropdown');
    console.log(css.substring(idx - 20, idx + 200));
  }
} else {
  console.log('site-main-css not found');
}

