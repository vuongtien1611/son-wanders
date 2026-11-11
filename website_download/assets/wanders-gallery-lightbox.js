/**
 * WANDERS FULLSCREEN GALLERY LIGHTBOX
 * Shared component across all project detail pages and galleries reading [data-gallery-src].
 */
(function () {
  'use strict';

  var MAX_LOW_RES_SCALE = 3.2;
  var LOW_RES_THRESHOLD = 640;

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function escapeText(str) {
    return String(str || '').trim();
  }

  function createSvg(paths) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < paths.length; i++) {
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', paths[i]);
      svg.appendChild(p);
    }
    return svg;
  }

  function buildDom() {
    var root = document.createElement('div');
    root.id = 'wandersLightbox';
    root.className = 'wlb-root';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Thư viện ảnh dự án');
    root.setAttribute('aria-hidden', 'true');

    // Top bar
    var topbar = document.createElement('div');
    topbar.className = 'wlb-topbar';

    var meta = document.createElement('div');
    meta.className = 'wlb-meta';

    var counter = document.createElement('span');
    counter.className = 'wlb-counter';
    counter.textContent = '01 / 01';

    var sep = document.createElement('span');
    sep.className = 'wlb-sep';

    var projectTitle = document.createElement('span');
    projectTitle.className = 'wlb-project-title';

    meta.appendChild(counter);
    meta.appendChild(sep);
    meta.appendChild(projectTitle);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'wlb-close';
    closeBtn.setAttribute('aria-label', 'Đóng thư viện ảnh');
    closeBtn.appendChild(createSvg(['M18 6 6 18', 'm6 6 12 12']));

    topbar.appendChild(meta);
    topbar.appendChild(closeBtn);

    // Stage
    var stage = document.createElement('div');
    stage.className = 'wlb-stage';

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'wlb-nav wlb-nav--stage wlb-nav--prev';
    prevBtn.setAttribute('aria-label', 'Ảnh trước');
    prevBtn.appendChild(createSvg(['m15 18-6-6 6-6']));

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'wlb-nav wlb-nav--stage wlb-nav--next';
    nextBtn.setAttribute('aria-label', 'Ảnh tiếp theo');
    nextBtn.appendChild(createSvg(['m9 18 6-6-6-6']));

    var spinner = document.createElement('div');
    spinner.className = 'wlb-spinner';
    spinner.setAttribute('aria-hidden', 'true');

    var frame = document.createElement('div');
    frame.className = 'wlb-frame';

    var img = document.createElement('img');
    img.id = 'wandersLightboxImg';
    img.className = 'wanders-lightbox-image';
    img.alt = '';

    var errorCard = document.createElement('div');
    errorCard.className = 'wlb-error-card';
    errorCard.innerHTML =
      '<p class="wlb-error-title">Không thể tải hình ảnh</p>' +
      '<p class="wlb-error-desc">Hình ảnh không khả dụng hoặc đường dẫn bị gián đoạn. Bạn có thể chuyển ảnh khác hoặc đóng cửa sổ này.</p>';

    frame.appendChild(img);
    frame.appendChild(errorCard);

    stage.appendChild(prevBtn);
    stage.appendChild(spinner);
    stage.appendChild(frame);
    stage.appendChild(nextBtn);

    // Bottom bar
    var bottom = document.createElement('div');
    bottom.className = 'wlb-bottom';

    var caption = document.createElement('p');
    caption.className = 'wlb-caption';

    var mobileControls = document.createElement('div');
    mobileControls.className = 'wlb-mobile-controls';

    var mPrevBtn = document.createElement('button');
    mPrevBtn.type = 'button';
    mPrevBtn.className = 'wlb-nav wlb-nav--mobile-prev';
    mPrevBtn.setAttribute('aria-label', 'Ảnh trước');
    mPrevBtn.appendChild(createSvg(['m15 18-6-6 6-6']));

    var mCounter = document.createElement('span');
    mCounter.className = 'wlb-mobile-hint';
    mCounter.textContent = '01 / 01';

    var mNextBtn = document.createElement('button');
    mNextBtn.type = 'button';
    mNextBtn.className = 'wlb-nav wlb-nav--mobile-next';
    mNextBtn.setAttribute('aria-label', 'Ảnh tiếp theo');
    mNextBtn.appendChild(createSvg(['m9 18 6-6-6-6']));

    mobileControls.appendChild(mPrevBtn);
    mobileControls.appendChild(mCounter);
    mobileControls.appendChild(mNextBtn);

    var thumbs = document.createElement('div');
    thumbs.className = 'wlb-thumbs';

    bottom.appendChild(caption);
    bottom.appendChild(mobileControls);
    bottom.appendChild(thumbs);

    root.appendChild(topbar);
    root.appendChild(stage);
    root.appendChild(bottom);
    document.body.appendChild(root);

    return {
      root: root,
      topbar: topbar,
      counter: counter,
      sep: sep,
      projectTitle: projectTitle,
      closeBtn: closeBtn,
      stage: stage,
      frame: frame,
      img: img,
      spinner: spinner,
      errorCard: errorCard,
      prevBtn: prevBtn,
      nextBtn: nextBtn,
      bottom: bottom,
      caption: caption,
      mobileControls: mobileControls,
      mPrevBtn: mPrevBtn,
      mNextBtn: mNextBtn,
      mCounter: mCounter,
      thumbs: thumbs,
    };
  }

  function init() {
    var allTriggers = Array.prototype.slice.call(document.querySelectorAll('button[data-gallery-src]'));
    if (!allTriggers.length) return;

    var ui = buildDom();
    var state = {
      open: false,
      items: [],
      index: 0,
      projectTitle: '',
      renderToken: 0,
      lastFocusedEl: null,
      scrollLocked: false,
      prevBodyOverflow: '',
      prevHtmlOverflow: '',
      prevBodyPaddingRight: '',
      naturalW: 0,
      naturalH: 0,
    };

    var preloaded = {};
    function preloadUrl(url) {
      if (!url || preloaded[url]) return;
      preloaded[url] = true;
      var pre = new Image();
      pre.src = url;
    }

    function computeStageAvailableBox() {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var isDesktopUp = vw >= 640;

      var rect = ui.stage.getBoundingClientRect();
      var padX = vw >= 1024 ? 192 : (isDesktopUp ? 168 : 28);
      var padY = isDesktopUp ? 36 : 24;

      var maxCssW = isDesktopUp ? Math.min(vw * 0.92, 1600) : (vw - 28);
      var maxCssH = isDesktopUp ? (vh * 0.85) : (vh * 0.76);

      var stageW = rect.width > 0 ? Math.max(180, rect.width - padX) : maxCssW;
      var stageH = rect.height > 0 ? Math.max(180, rect.height - padY) : maxCssH;

      return {
        availW: Math.min(stageW, maxCssW),
        availH: Math.min(stageH, maxCssH),
      };
    }

    function applyResponsiveSize() {
      if (!state.open || !state.naturalW || !state.naturalH) return;
      var box = computeStageAvailableBox();
      var natW = state.naturalW;
      var natH = state.naturalH;
      var aspect = natW / natH;

      var fitW = box.availW;
      var fitH = fitW / aspect;
      if (fitH > box.availH) {
        fitH = box.availH;
        fitW = fitH * aspect;
      }

      // If original source is low-resolution (<640px), scale cleanly up to stage size
      // capped at 3.2x natural pixels so it opens spaciously without extreme blur.
      var targetW = fitW;
      var targetH = fitH;
      if (natW < LOW_RES_THRESHOLD && natH < LOW_RES_THRESHOLD) {
        var maxQualityW = natW * MAX_LOW_RES_SCALE;
        if (targetW > maxQualityW) {
          targetW = maxQualityW;
          targetH = targetW / aspect;
        }
      }

      ui.img.style.width = Math.round(targetW) + 'px';
      ui.img.style.height = Math.round(targetH) + 'px';
    }

    function lockScroll() {
      if (state.scrollLocked) return;
      state.scrollLocked = true;
      state.prevBodyOverflow = document.body.style.overflow;
      state.prevHtmlOverflow = document.documentElement.style.overflow;
      state.prevBodyPaddingRight = document.body.style.paddingRight;

      var scrollbarW = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarW > 0) {
        document.body.style.paddingRight = scrollbarW + 'px';
      }
      document.documentElement.classList.add('wlb-scroll-locked');
      document.body.classList.add('wlb-scroll-locked');
    }

    function unlockScroll() {
      if (!state.scrollLocked) return;
      state.scrollLocked = false;
      document.documentElement.classList.remove('wlb-scroll-locked');
      document.body.classList.remove('wlb-scroll-locked');
      document.body.style.overflow = state.prevBodyOverflow;
      document.documentElement.style.overflow = state.prevHtmlOverflow;
      document.body.style.paddingRight = state.prevBodyPaddingRight;
    }

    function syncThumbnails() {
      var many = state.items.length > 1;
      ui.prevBtn.style.display = many ? '' : 'none';
      ui.nextBtn.style.display = many ? '' : 'none';
      ui.mobileControls.style.display = many ? '' : 'none';
      ui.thumbs.classList.toggle('has-many', many);

      ui.thumbs.innerHTML = '';
      if (!many) return;

      for (var i = 0; i < state.items.length; i++) {
        (function (idx, item) {
          var tBtn = document.createElement('button');
          tBtn.type = 'button';
          tBtn.className = 'wlb-thumb' + (idx === state.index ? ' is-active' : '');
          tBtn.setAttribute('aria-label', 'Xem ảnh ' + (idx + 1));

          var tImg = document.createElement('img');
          tImg.src = item.thumbSrc;
          tImg.alt = '';
          tImg.loading = 'eager';
          tBtn.appendChild(tImg);

          tBtn.addEventListener('click', function () {
            showIndex(idx);
          });
          ui.thumbs.appendChild(tBtn);
        })(i, state.items[i]);
      }
    }

    function updateActiveThumb() {
      var buttons = ui.thumbs.querySelectorAll('.wlb-thumb');
      for (var i = 0; i < buttons.length; i++) {
        var active = i === state.index;
        buttons[i].classList.toggle('is-active', active);
        if (active && typeof buttons[i].scrollIntoView === 'function') {
          try {
            buttons[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } catch (err) {
            buttons[i].scrollIntoView();
          }
        }
      }
    }

    function showIndex(nextIdx) {
      if (!state.items.length) return;
      var total = state.items.length;
      state.index = ((nextIdx % total) + total) % total;

      var item = state.items[state.index];
      var counterText = pad2(state.index + 1) + ' / ' + pad2(total);
      ui.counter.textContent = counterText;
      ui.mCounter.textContent = counterText;

      ui.caption.textContent = item.caption || '';
      var hasBottomContent = Boolean(item.caption) || total > 1;
      ui.bottom.classList.toggle('is-empty', !hasBottomContent);

      updateActiveThumb();

      var token = ++state.renderToken;
      state.naturalW = 0;
      state.naturalH = 0;
      ui.errorCard.classList.remove('is-visible');
      ui.img.style.display = 'block';
      ui.img.classList.add('is-switching');
      ui.spinner.classList.add('is-visible');

      var loader = new Image();
      loader.onload = function () {
        if (token !== state.renderToken) return;
        state.naturalW = loader.naturalWidth || 0;
        state.naturalH = loader.naturalHeight || 0;
        ui.img.src = item.src;
        ui.img.alt = item.alt || state.projectTitle;
        applyResponsiveSize();
        ui.spinner.classList.remove('is-visible');
        requestAnimationFrame(function () {
          if (token !== state.renderToken) return;
          ui.img.classList.remove('is-switching');
        });
      };
      loader.onerror = function () {
        if (token !== state.renderToken) return;
        ui.spinner.classList.remove('is-visible');
        ui.img.classList.remove('is-switching');
        ui.img.style.display = 'none';
        ui.errorCard.classList.add('is-visible');
      };
      loader.src = item.src;

      if (total > 1) {
        preloadUrl(state.items[(state.index + 1) % total].src);
        preloadUrl(state.items[(state.index - 1 + total) % total].src);
      }
    }

    function openFromTrigger(triggerBtn) {
      var groupEl = triggerBtn.closest('[data-wanders-gallery]');
      var nodes = groupEl
        ? Array.prototype.slice.call(groupEl.querySelectorAll('button[data-gallery-src]'))
        : Array.prototype.slice.call(document.querySelectorAll('button[data-gallery-src]'));

      state.items = [];
      var startIdx = 0;
      nodes.forEach(function (btn) {
        var rawSrc = btn.getAttribute('data-gallery-src');
        if (!rawSrc) return;
        var hdSrc = btn.getAttribute('data-gallery-hd') || btn.getAttribute('data-lightbox-src') || rawSrc;
        var captionAttr = btn.getAttribute('data-gallery-caption') || '';
        var altAttr = btn.getAttribute('data-gallery-alt') || '';
        if (btn === triggerBtn) {
          startIdx = state.items.length;
        }
        state.items.push({
          src: hdSrc,
          thumbSrc: rawSrc,
          alt: escapeText(altAttr),
          caption: escapeText(captionAttr),
        });
      });

      if (!state.items.length) return;

      var titleFromGroup = groupEl ? groupEl.getAttribute('data-wanders-gallery') : '';
      var h1 = document.querySelector('main h1');
      state.projectTitle = escapeText(titleFromGroup || (h1 ? h1.textContent : '') || '');

      ui.projectTitle.textContent = state.projectTitle;
      ui.sep.style.display = state.projectTitle ? '' : 'none';
      ui.projectTitle.style.display = state.projectTitle ? '' : 'none';

      state.lastFocusedEl = triggerBtn;
      state.open = true;
      ui.img.style.width = '';
      ui.img.style.height = '';

      lockScroll();
      syncThumbnails();

      ui.root.classList.add('is-open');
      ui.root.setAttribute('aria-hidden', 'false');

      showIndex(startIdx);

      requestAnimationFrame(function () {
        applyResponsiveSize();
        try {
          ui.closeBtn.focus({ preventScroll: true });
        } catch (err) {
          ui.closeBtn.focus();
        }
      });
    }

    function close() {
      if (!state.open) return;
      state.open = false;
      state.renderToken++;
      ui.root.classList.remove('is-open');
      ui.root.setAttribute('aria-hidden', 'true');
      ui.spinner.classList.remove('is-visible');
      unlockScroll();

      if (state.lastFocusedEl && typeof state.lastFocusedEl.focus === 'function') {
        try {
          state.lastFocusedEl.focus({ preventScroll: true });
        } catch (err) {}
      }
    }

    function next() {
      if (!state.open || state.items.length <= 1) return;
      showIndex(state.index + 1);
    }

    function prev() {
      if (!state.open || state.items.length <= 1) return;
      showIndex(state.index - 1);
    }

    // Attach click triggers via event delegation so any gallery buttons work reliably
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button[data-gallery-src]') : null;
      if (btn) {
        e.preventDefault();
        openFromTrigger(btn);
      }
    });

    ui.closeBtn.addEventListener('click', close);
    ui.prevBtn.addEventListener('click', prev);
    ui.nextBtn.addEventListener('click', next);
    ui.mPrevBtn.addEventListener('click', prev);
    ui.mNextBtn.addEventListener('click', next);

    // Close when clicking dark backdrop outside image/buttons/thumbs
    ui.root.addEventListener('click', function (e) {
      if (e.target === ui.root || e.target === ui.stage || e.target === ui.frame) {
        close();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!state.open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    });

    // Mobile/Tablet Touch Swipe
    var touchState = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    ui.stage.addEventListener(
      'touchstart',
      function (e) {
        if (!state.open || state.items.length <= 1) return;
        if (!e.touches || e.touches.length !== 1) {
          touchState.active = false;
          return;
        }
        touchState.active = true;
        touchState.startX = e.touches[0].clientX;
        touchState.startY = e.touches[0].clientY;
        touchState.dx = 0;
        touchState.dy = 0;
      },
      { passive: true }
    );

    ui.stage.addEventListener(
      'touchmove',
      function (e) {
        if (!touchState.active || !e.touches || e.touches.length !== 1) return;
        touchState.dx = e.touches[0].clientX - touchState.startX;
        touchState.dy = e.touches[0].clientY - touchState.startY;
        if (Math.abs(touchState.dx) > Math.abs(touchState.dy) * 1.15 && Math.abs(touchState.dx) > 10) {
          var clamped = Math.max(-70, Math.min(70, touchState.dx * 0.45));
          ui.img.style.transform = 'translate3d(' + clamped + 'px, 0, 0)';
        }
      },
      { passive: true }
    );

    function finishTouch() {
      if (!touchState.active) return;
      ui.img.style.transform = '';
      var absX = Math.abs(touchState.dx);
      var absY = Math.abs(touchState.dy);
      if (absX >= 44 && absX > absY * 1.15) {
        if (touchState.dx < 0) next();
        else prev();
      }
      touchState.active = false;
    }

    ui.stage.addEventListener('touchend', finishTouch, { passive: true });
    ui.stage.addEventListener('touchcancel', finishTouch, { passive: true });

    window.addEventListener('resize', applyResponsiveSize, { passive: true });

    window.WandersLightbox = {
      open: openFromTrigger,
      close: close,
      next: next,
      prev: prev,
      goTo: showIndex,
      getState: function () {
        return { open: state.open, index: state.index, total: state.items.length };
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

