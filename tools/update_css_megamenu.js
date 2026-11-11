const fs = require('fs');

const cssPath = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/assets/index-BDqGYMxC.css';
let css = fs.readFileSync(cssPath, 'utf8');

const megaMenuCss = `
/* ==========================================================================
   MY HOUR LUXURY MEGA MENU DROPDOWN SYSTEM
   ========================================================================== */

/* Parent header overflow reset to prevent clipping */
header, 
header > div, 
.shell {
  overflow: visible !important;
}

/* Nav Dropdown Parent Item */
.nav-dropdown {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  height: 100% !important;
}

/* Invisible Hover Bridge to prevent premature closing */
.nav-dropdown::after {
  content: '';
  position: absolute;
  top: 100%;
  left: -20px;
  right: -20px;
  height: 20px;
  background: transparent;
  z-index: 99998;
}

/* Mega Menu Dropdown Container */
.nav-dropdown-menu,
.nav-dropdown .nav-mega-menu,
.nav-dropdown > div.absolute {
  position: absolute !important;
  top: calc(100% - 2px) !important;
  left: -15px !important;
  width: 740px !important;
  min-width: 680px !important;
  max-width: calc(100vw - 32px) !important;
  box-sizing: border-box !important;
  background: #FFFFFF !important;
  border: 1px solid #E8E6E1 !important;
  border-top: 3px solid #C5A880 !important;
  border-radius: 6px !important;
  box-shadow: 0 20px 45px -12px rgba(26, 36, 33, 0.22), 0 4px 16px rgba(0, 0, 0, 0.06) !important;
  z-index: 999999 !important;
  padding: 16px 18px !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateY(8px) !important;
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s !important;
  pointer-events: none !important;
}

/* Trigger on hover & focus-within */
.nav-dropdown:hover .nav-dropdown-menu,
.nav-dropdown:hover > div.absolute,
.nav-dropdown:focus-within .nav-dropdown-menu,
.nav-dropdown:focus-within > div.absolute {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
  pointer-events: auto !important;
  display: block !important;
}

/* Also support hover on dropdown itself */
.nav-dropdown-menu:hover,
.nav-dropdown > div.absolute:hover {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
  pointer-events: auto !important;
  display: block !important;
}

/* Mega Menu Grid Layout */
.nav-mega-grid,
.nav-dropdown-menu .grid,
.nav-dropdown > div.absolute .grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 10px 14px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  background: transparent !important;
}

/* Mega Menu Item Card */
.nav-mega-item,
.nav-dropdown-menu .grid > a,
.nav-dropdown > div.absolute .grid > a {
  display: flex !important;
  align-items: flex-start !important;
  gap: 12px !important;
  padding: 10px 12px !important;
  border-radius: 6px !important;
  border: 1px solid transparent !important;
  background: #FFFFFF !important;
  text-decoration: none !important;
  transition: all 0.18s ease-in-out !important;
  box-sizing: border-box !important;
  width: 100% !important;
  min-width: 0 !important;
}

.nav-mega-item:hover,
.nav-dropdown-menu .grid > a:hover,
.nav-dropdown > div.absolute .grid > a:hover {
  background: #FAF8F5 !important;
  border-color: #EFECE6 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(26, 36, 33, 0.05) !important;
}

/* Mega Menu Icon Container */
.nav-mega-icon {
  width: 38px !important;
  height: 38px !important;
  border-radius: 6px !important;
  background: rgba(197, 168, 128, 0.12) !important;
  color: #C5A880 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  font-size: 16px !important;
  transition: all 0.2s ease !important;
}

.nav-mega-item:hover .nav-mega-icon,
.nav-dropdown-menu .grid > a:hover .nav-mega-icon,
.nav-dropdown > div.absolute .grid > a:hover .nav-mega-icon {
  background: #C5A880 !important;
  color: #FFFFFF !important;
}

/* Text Content Container */
.nav-mega-content,
.nav-dropdown-menu .grid > a > span,
.nav-dropdown > div.absolute .grid > a > span {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Category Title */
.nav-mega-title,
.nav-dropdown-menu .grid > a .font-semibold,
.nav-dropdown-menu .grid > a span:first-child,
.nav-dropdown > div.absolute .grid > a span:first-child {
  font-family: inherit !important;
  font-size: 13.5px !important;
  font-weight: 600 !important;
  color: #1A2421 !important;
  line-height: 1.35 !important;
  margin: 0 !important;
  white-space: nowrap !important;
  transition: color 0.15s ease !important;
}

.nav-mega-item:hover .nav-mega-title,
.nav-dropdown-menu .grid > a:hover .font-semibold,
.nav-dropdown > div.absolute .grid > a:hover span:first-child {
  color: #1E3A2F !important;
}

/* Category Description */
.nav-mega-desc,
.nav-dropdown-menu .grid > a span:last-child,
.nav-dropdown > div.absolute .grid > a span:last-child {
  font-size: 11.5px !important;
  color: #64748B !important;
  line-height: 1.45 !important;
  margin-top: 3px !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow: visible !important;
  display: block !important;
}

/* Mega Menu Bottom Bar */
.nav-mega-footer,
.nav-dropdown-menu > div:last-child,
.nav-dropdown > div.absolute > a:last-child,
.nav-dropdown > div.absolute > div:last-child {
  margin-top: 14px !important;
  padding-top: 12px !important;
  border-top: 1px solid #ECEAE4 !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.nav-mega-footer-text {
  font-size: 11.5px !important;
  color: #64748B !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.nav-mega-footer-link {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #1E3A2F !important;
  text-decoration: none !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  transition: all 0.15s ease !important;
}

.nav-mega-footer-link:hover {
  color: #C5A880 !important;
  transform: translateX(2px) !important;
}

/* Responsive adjustments for screens under 1200px */
@media (max-width: 1200px) {
  .nav-dropdown-menu,
  .nav-dropdown > div.absolute {
    width: 660px !important;
    min-width: 600px !important;
  }
}

@media (max-width: 1024px) {
  .nav-dropdown-menu,
  .nav-dropdown > div.absolute {
    width: min(600px, calc(100vw - 32px)) !important;
    left: 50% !important;
    transform: translateX(-50%) translateY(8px) !important;
  }
  .nav-dropdown:hover .nav-dropdown-menu,
  .nav-dropdown:hover > div.absolute {
    transform: translateX(-50%) translateY(0) !important;
  }
}
`;

// Replace old nav-dropdown block with new megaMenuCss
if (css.includes('/* Navigation dropdown styles */')) {
  css = css.replace(/\/\* Navigation dropdown styles \*\/[\s\S]*?opacity: 1 !important;\s*\}/, megaMenuCss);
} else {
  css += '\n' + megaMenuCss;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated assets/index-BDqGYMxC.css with Mega Menu rules!');

