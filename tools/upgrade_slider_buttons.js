const fs = require('fs');
const path = require('path');

const buildScriptPath = 'giao-dien/tools/build_cam_hung_page.js';
let script = fs.readFileSync(buildScriptPath, 'utf8');

// 1. Add CSS for room-slider-nav-btn in site-main-css
const cssRule = `
    /* Room Inspiration Slider Navigation Buttons */
    .room-slider-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #FFFFFF;
      color: #1E3A2F;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16), 0 1px 3px rgba(0, 0, 0, 0.08);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 25;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 0;
      outline: none;
    }
    .room-slider-nav-btn.prev-btn {
      left: 12px;
    }
    .room-slider-nav-btn.next-btn {
      right: 12px;
    }
    .room-slider-nav-btn:hover {
      background: #1E3A2F;
      color: #FFFFFF;
      border-color: #1E3A2F;
      transform: translateY(-50%) scale(1.08);
      box-shadow: 0 6px 18px rgba(30, 58, 47, 0.35);
    }
    .room-slider-nav-btn:active {
      transform: translateY(-50%) scale(0.96);
    }
    .room-slider-nav-btn svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      transition: transform 0.2s ease;
    }
    .room-slider-nav-btn.prev-btn:hover svg {
      transform: translateX(-1px);
    }
    .room-slider-nav-btn.next-btn:hover svg {
      transform: translateX(1px);
    }

    @media (max-width: 640px) {
      .room-slider-nav-btn {
        width: 40px;
        height: 40px;
      }
      .room-slider-nav-btn.prev-btn {
        left: 8px;
      }
      .room-slider-nav-btn.next-btn {
        right: 8px;
      }
      .room-slider-nav-btn svg {
        width: 18px;
        height: 18px;
      }
    }
`;

// Insert into <style id="site-main-css"> before </style>
script = script.replace('  </style>\n</head>', `${cssRule}  </style>\n</head>`);

// 2. Replace Room Image Container and Buttons
const oldHtmlPattern = /<!-- Room Image Container -->[\s\S]*?<\/div>\s*<!-- Collection Info -->/;
const newHtml = `<!-- Room Image Container -->
            <div id="roomSliderContainer" class="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-gray-100 group select-none">
              <img id="collectionRoomImg" src="\${p}images/room-purple-clean.jpg" alt="Không gian sắc màu MY HOUR" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102">
              
              <!-- Previous Arrow Button -->
              <button id="prevCollectionBtn" type="button" class="room-slider-nav-btn prev-btn" aria-label="Bộ sưu tập trước" title="Bộ sưu tập trước">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              
              <!-- Next Arrow Button -->
              <button id="nextCollectionBtn" type="button" class="room-slider-nav-btn next-btn" aria-label="Bộ sưu tập sau" title="Bộ sưu tập sau">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>

            <!-- Collection Info -->`;

script = script.replace(oldHtmlPattern, newHtml);

// 3. Update Event Listeners & Add Touch Swipe
const oldListeners = `    // 9. Event Listeners
    prevCollectionBtn.addEventListener('click', function() {
      switchCollection(currentCollectionIndex - 1);
    });
    nextCollectionBtn.addEventListener('click', function() {
      switchCollection(currentCollectionIndex + 1);
    });`;

const newListeners = `    // 9. Event Listeners
    prevCollectionBtn.addEventListener('click', function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      switchCollection(currentCollectionIndex - 1);
    });
    nextCollectionBtn.addEventListener('click', function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      switchCollection(currentCollectionIndex + 1);
    });

    // Touch swipe support on room slider container
    var roomSliderContainer = document.getElementById('roomSliderContainer');
    if (roomSliderContainer) {
      var touchStartX = 0;
      var touchStartY = 0;
      roomSliderContainer.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      roomSliderContainer.addEventListener('touchend', function(e) {
        if (e.changedTouches && e.changedTouches.length > 0) {
          var touchEndX = e.changedTouches[0].clientX;
          var touchEndY = e.changedTouches[0].clientY;
          var diffX = touchEndX - touchStartX;
          var diffY = touchEndY - touchStartY;
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
              switchCollection(currentCollectionIndex + 1);
            } else {
              switchCollection(currentCollectionIndex - 1);
            }
          }
        }
      }, { passive: true });
    }`;

script = script.replace(oldListeners, newListeners);

fs.writeFileSync(buildScriptPath, script, 'utf8');
console.log('build_cam_hung_page.js updated with upgraded slider buttons & swipe!');

// Also append the CSS rule to assets/index-BDqGYMxC.css
const cssPath = 'giao-dien/website_download/assets/index-BDqGYMxC.css';
let coreCss = fs.readFileSync(cssPath, 'utf8');
if (!coreCss.includes('.room-slider-nav-btn')) {
  coreCss += '\n' + cssRule;
  fs.writeFileSync(cssPath, coreCss, 'utf8');
  console.log('assets/index-BDqGYMxC.css updated with .room-slider-nav-btn!');
}

