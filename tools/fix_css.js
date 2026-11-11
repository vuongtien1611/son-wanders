const fs = require('fs');

const cssPath = 'giao-dien/website_download/assets/index-BDqGYMxC.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Fix nav-dropdown and nav-dropdown::after
css = css.replace(
  /\.nav-dropdown\s*\{[\s\S]*?display:\s*inline-flex\s*!important;[\s\S]*?\}/,
  `.nav-dropdown {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}`
);

css = css.replace(
  /\.nav-dropdown::after\s*\{[\s\S]*?z-index:\s*99998;[\s\S]*?\}/,
  `.nav-dropdown::after {
  content: '';
  position: absolute;
  top: 100%;
  left: -20px;
  right: -20px;
  height: 20px;
  background: transparent;
  z-index: 99998;
  pointer-events: none;
}
.nav-dropdown:hover::after {
  pointer-events: auto;
}`
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Updated index-BDqGYMxC.css successfully');

