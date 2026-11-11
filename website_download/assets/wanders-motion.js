/**
 * WANDERS CINEMATIC MOTION SYSTEM
 * - Synchronized Intro -> Hero reveal
 * - Sticky header elevation
 * - IntersectionObserver + Scroll-sync Section & Image reveal (zero stuck-hidden sections)
 */
(function () {
  'use strict';

  function revealHero() {
    document.documentElement.classList.add('wi-hero-enter');
  }

  function initHeroSync() {
    var html = document.documentElement;
    var hasIntro = !!document.getElementById('wanders-intro') && html.classList.contains('wi-active');
    if (!hasIntro) {
      requestAnimationFrame(revealHero);
      return;
    }

    window.addEventListener('wanders:intro-wipe', revealHero, { once: true });
    window.addEventListener('wanders:intro-done', revealHero, { once: true });

    setTimeout(function () {
      if (!html.classList.contains('wi-active')) {
        revealHero();
      }
    }, 5300);
  }

  function initStickyHeader() {
    var header = document.querySelector('header.w-header');
    if (!header) return;
    function update() {
      if (window.scrollY > 12) {
        header.classList.add('w-header--scrolled');
      } else {
        header.classList.remove('w-header--scrolled');
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initScrollReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.w-reveal, .w-reveal-img'));
    if (!els.length) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      els.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    function checkVisible() {
      var vh = window.innerHeight || 900;
      els.forEach(function (el) {
        if (el.classList.contains('is-revealed')) return;
        var rect = el.getBoundingClientRect();
        // Reveal if inside viewport OR already scrolled past above the viewport
        if (rect.top <= vh * 0.98) {
          el.classList.add('is-revealed');
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -24px 0px' }
      );
      els.forEach(function (el) { observer.observe(el); });
    }

    var rafPending = false;
    window.addEventListener(
      'scroll',
      function () {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(function () {
          rafPending = false;
          checkVisible();
        });
      },
      { passive: true }
    );

    window.addEventListener('resize', checkVisible, { passive: true });
    window.addEventListener('load', checkVisible);
    checkVisible();
  }

  function boot() {
    initHeroSync();
    initStickyHeader();
    initScrollReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
