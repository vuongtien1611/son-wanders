const fs = require('fs');

const css = fs.readFileSync('giao-dien/website_download/assets/index-BDqGYMxC.css', 'utf8');
const matches = css.match(/\.nav-dropdown[\s\S]{0,400}/g);
console.log(matches ? matches.slice(0, 5) : 'None');
