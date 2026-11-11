const fs = require('fs');

const html = fs.readFileSync('giao-dien/website_download/cam-hung-mau-sac/index.html', 'utf8');

const sliderMatch = html.match(/<!-- Room Image Container -->[\s\S]*?<!-- Collection Info -->/);
console.log("=== SLIDER HTML IN CAM-HUNG-MAU-SAC/INDEX.HTML ===");
console.log(sliderMatch ? sliderMatch[0] : 'Not found');

const hasSwipe = html.includes('roomSliderContainer.addEventListener(\'touchstart\'');
console.log("Has Touch Swipe logic:", hasSwipe);

const hasBtnCss = html.includes('.room-slider-nav-btn');
console.log("Has .room-slider-nav-btn CSS:", hasBtnCss);

