/**
 * WANDERS HEADER MEGA DROPDOWN ENGINE
 * Enhances "Sản phẩm" link in header with 6-category visual mega dropdown on hover
 */
(function () {
  'use strict';

  function detectPrefix() {
    const prodLink = document.querySelector('header nav a[href*="san-pham"]');
    if (prodLink) {
      const href = prodLink.getAttribute('href') || '';
      const m = href.match(/^((?:\.\.\/)+|\.\/)/);
      if (m) return m[1];
    }
    const cssLink = document.querySelector('link[href*="base44.css"]');
    if (cssLink) {
      const href = cssLink.getAttribute('href') || '';
      const m = href.match(/^((?:\.\.\/)+|\.\/)/);
      if (m) return m[1];
    }
    return './';
  }

  function initDropdown() {
    const header = document.querySelector('header');
    if (!header) return;

    const nav = header.querySelector('nav');
    if (!nav) return;

    const prodLink = Array.from(nav.querySelectorAll('a')).find(a => {
      const href = a.getAttribute('href') || '';
      return href.includes('san-pham');
    });
    if (!prodLink || prodLink.closest('.wanders-nav-dropdown-wrap')) return;

    const prefix = detectPrefix();

    const CATEGORIES = [
      {
        title: 'SƠN NỘI THẤT',
        slug: 'noi-that',
        img: `${prefix}images/base44/7f7b7d76e_generated_2a17cf56.png`
      },
      {
        title: 'SƠN NGOẠI THẤT',
        slug: 'ngoai-that',
        img: `${prefix}images/base44/85e7f93c0_generated_2df1c9b3.png`
      },
      {
        title: 'SƠN CHỐNG THẤM',
        slug: 'chong-tham',
        img: `${prefix}images/base44/5d10e1c6d_generated_213965c5.png`
      },
      {
        title: 'SƠN LÓT',
        slug: 'son-lot',
        img: `${prefix}images/base44/7f6a476c9_generated_9cbd24f3.png`
      },
      {
        title: 'SƠN CHỐNG NÓNG',
        slug: 'chong-nong',
        img: `${prefix}images/base44/11ef022d2_generated_ea4a85fa.png`
      },
      {
        title: 'SẢN PHẨM KHÁC',
        slug: 'khac',
        img: `${prefix}images/base44/f8b86d905_generated_509a0b06.png`
      }
    ];

    // 1. Wrap "Sản phẩm" link & add subtle chevron
    const wrap = document.createElement('div');
    wrap.className = 'wanders-nav-dropdown-wrap';
    prodLink.parentNode.insertBefore(wrap, prodLink);
    wrap.appendChild(prodLink);

    // Insert chevron icon before underline span (if any)
    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.setAttribute('fill', 'none');
    chevron.setAttribute('stroke', 'currentColor');
    chevron.setAttribute('stroke-width', '2');
    chevron.setAttribute('stroke-linecap', 'round');
    chevron.setAttribute('stroke-linejoin', 'round');
    chevron.setAttribute('class', 'wanders-nav-chevron');
    chevron.innerHTML = '<path d="m6 9 6 6 6-6"></path>';

    const underlineSpan = prodLink.querySelector('span');
    if (underlineSpan) {
      prodLink.insertBefore(chevron, underlineSpan);
    } else {
      prodLink.appendChild(chevron);
    }

    // 2. Build Mega Dropdown Panel
    const dropdown = document.createElement('div');
    dropdown.id = 'wandersProductsDropdown';
    dropdown.className = 'wanders-mega-dropdown';
    dropdown.setAttribute('role', 'region');
    dropdown.setAttribute('aria-label', 'Danh mục sản phẩm WANDERS');

    dropdown.innerHTML = `
      <div class="wanders-mega-inner">
        <div class="wanders-mega-top">
          <span class="wanders-mega-label">
            <span class="wanders-mega-label-line"></span>
            Sáu nhóm sản phẩm WANDERS
          </span>
          <a href="${prefix}san-pham.html" class="wanders-mega-all">
            <span>Xem tất cả sản phẩm</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
        </div>
        <div class="wanders-mega-grid">
          ${CATEGORIES.map(cat => `
            <a href="${prefix}san-pham.html?nhom=${cat.slug}" class="wanders-mega-card">
              <img src="${cat.img}" alt="${cat.title}" class="wanders-mega-card-img" loading="lazy">
              <div class="wanders-mega-card-overlay"></div>
              <span class="wanders-mega-card-title">${cat.title}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    header.appendChild(dropdown);

    // 3. Hover Intent Logic (Zero flicker across nav padding)
    let closeTimer = null;

    function openMenu() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      wrap.classList.add('is-open');
      dropdown.classList.add('is-open');
    }

    function scheduleClose() {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        wrap.classList.remove('is-open');
        dropdown.classList.remove('is-open');
      }, 130);
    }

    wrap.addEventListener('mouseenter', openMenu);
    wrap.addEventListener('mouseleave', scheduleClose);
    dropdown.addEventListener('mouseenter', openMenu);
    dropdown.addEventListener('mouseleave', scheduleClose);

    // Keyboard accessibility
    prodLink.addEventListener('focus', openMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        wrap.classList.remove('is-open');
        dropdown.classList.remove('is-open');
      }
    });

    // 4. Enhance Mobile Drawer if present
    const mobileNav = document.querySelector('#b44MobileMenuDrawer nav');
    if (mobileNav && !mobileNav.querySelector('.wanders-mobile-subcats')) {
      const mobileProdLink = Array.from(mobileNav.querySelectorAll('a')).find(a => (a.getAttribute('href') || '').includes('san-pham'));
      if (mobileProdLink) {
        const subGrid = document.createElement('div');
        subGrid.className = 'wanders-mobile-subcats';
        subGrid.innerHTML = CATEGORIES.map(cat => `
          <a href="${prefix}san-pham.html?nhom=${cat.slug}" class="wanders-mobile-subcat-link">
            <span>${cat.title}</span>
          </a>
        `).join('');
        mobileProdLink.insertAdjacentElement('afterend', subGrid);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdown);
  } else {
    initDropdown();
  }
})();

