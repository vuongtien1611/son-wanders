/**
 * WANDERS CINEMATIC PAINT EXPLOSION INTRO
 * Concept: WANDERS – THE POWER OF COLOR ("Sắc màu kiến tạo không gian sống")
 * Modular Architecture:
 *   - PaintParticles  (Canvas physics: drop acceleration, shockwave rings, ballistic droplets)
 *   - PaintSplash     (Scene 01 Impact & Scene 02 Explosion image choreography)
 *   - LiquidRibbons   (Scene 02-03 Viscous Bezier ribbons + 03_liquid_ribbons.png sweep)
 *   - LogoReveal      (Proportional 7-letter glyph alignment & sequential paint reveal)
 *   - PageTransition  (Scene 05 04_paint_transition.png curtain wipe -> Hero unveil)
 *   - IntroTimeline   (RAF master timeline, session gating, safety timeout, clean teardown)
 */
(function () {
  'use strict';

  var SESSION_KEY = 'wanders_intro_seen';
  var ASSET_BASE = './images/introl/';
  var TOTAL_DURATION = 3845; // ms (2860ms wipe start + 950ms upward glide + 35ms settle)
  var HARD_SAFETY_TIMEOUT = 5200;

  // Exact measured bounding-box glyph geometry inside PNGs (W uniformly scaled 1028/662 to match A-S cap-height)
  var LETTER_SPECS = [
    { ch: 'W', file: '01_W.png', cs: 1863.44, tx: 133.55, ty: 416.17, gw: 1597, gh: 1028 },
    { ch: 'A', file: '02_A.png', cs: 1200, tx: 222, ty: 86, gw: 754, gh: 1028 },
    { ch: 'N', file: '03_N.png', cs: 1200, tx: 186, ty: 86, gw: 826, gh: 1028 },
    { ch: 'D', file: '04_D.png', cs: 1200, tx: 150, ty: 86, gw: 898, gh: 1028 },
    { ch: 'E', file: '05_E.png', cs: 1200, tx: 210, ty: 86, gw: 778, gh: 1028 },
    { ch: 'R', file: '06_R.png', cs: 1200, tx: 214, ty: 86, gw: 772, gh: 1028 },
    { ch: 'S', file: '07_S.png', cs: 1200, tx: 140, ty: 86, gw: 918, gh: 1028 },
  ];

  var FX_FILES = [
    '01_paint_impact.png',
    '02_paint_explosion.png',
    '03_liquid_ribbons.png',
  ];

  var COLORS = {
    forest: '#0F4C3A',
    deep: '#073B2E',
    emerald: '#1A7A5E',
    gold: '#D6AD45',
    ivory: '#FAF9F5',
    charcoal: '#2F383E',
  };

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  }

  function easeOutExpo(t) {
    t = clamp(t, 0, 1);
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function easeInQuad(t) {
    t = clamp(t, 0, 1);
    return t * t;
  }

  function easeInOutCubic(t) {
    t = clamp(t, 0, 1);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ---------------------------------------------------------------------------
  // 1. PaintParticles — HTML5 Canvas Physics Engine
  // ---------------------------------------------------------------------------
  function PaintParticles(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.isLowPower =
      window.innerWidth < 768 ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4);
    this.w = 0;
    this.h = 0;
    this.droplets = [];
    this.rings = [];
    this.impactFired = false;
    this.explosionBurstFired = false;
    this.letterBursts = {};
    this.canvasIdle = false;
    this.resize();
  }

  PaintParticles.prototype.resize = function () {
    if (!this.canvas) return;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.max(1, Math.floor(this.w * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(this.h * this.dpr));
    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
  };

  PaintParticles.prototype.emitRadialBurst = function (cx, cy, count, speedScale, palette) {
    var scale = this.isLowPower ? 0.55 : 1;
    var total = Math.max(8, Math.round(count * scale));
    var baseSpeed = Math.min(this.w, this.h) * speedScale;
    for (var i = 0; i < total; i++) {
      var angle = (Math.PI * 2 * i) / total + (Math.random() - 0.5) * 0.35;
      var spd = baseSpeed * (0.45 + Math.random() * 0.95);
      this.droplets.push({
        x: cx + (Math.random() - 0.5) * 14,
        y: cy + (Math.random() - 0.5) * 14,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 1.6 + Math.random() * (this.isLowPower ? 3.5 : 5.2),
        color: palette[i % palette.length],
        alpha: 0.95,
        drag: 0.92 + Math.random() * 0.04,
        gravity: 220 + Math.random() * 140,
        life: 0,
        maxLife: 0.65 + Math.random() * 0.55,
      });
    }
  };

  PaintParticles.prototype.emitRing = function (cx, cy, maxR, color, lineWidth) {
    this.rings.push({
      x: cx,
      y: cy,
      r: 8,
      maxR: maxR,
      color: color,
      lineWidth: lineWidth,
      alpha: 0.9,
      life: 0,
      maxLife: 0.62,
    });
  };

  PaintParticles.prototype.triggerLetterSpark = function (idx, ratioX) {
    if (this.letterBursts[idx]) return;
    this.letterBursts[idx] = true;
    var cx = this.w * ratioX;
    var cy = this.h * 0.49;
    this.emitRadialBurst(cx, cy, 12, 0.24, [COLORS.gold, COLORS.ivory, COLORS.emerald]);
  };

  PaintParticles.prototype.updateAndDraw = function (elapsedMs, dtSec) {
    var ctx = this.ctx;
    if (!ctx) return;

    if (elapsedMs > 2350 && this.droplets.length === 0 && this.rings.length === 0) {
      if (!this.canvasIdle) {
        ctx.clearRect(0, 0, this.w, this.h);
        this.canvasIdle = true;
      }
      return;
    }
    this.canvasIdle = false;
    ctx.clearRect(0, 0, this.w, this.h);

    var cx = this.w * 0.5;
    var cy = this.h * 0.5;

    // Scene 01 (0 - 250ms): Falling accelerating emerald drop
    if (elapsedMs < 255) {
      var dropT = clamp(elapsedMs / 250, 0, 1);
      var accelT = easeInQuad(dropT);
      var dropY = lerp(-30, cy, accelT);
      var tailH = 18 + accelT * 75;

      var grad = ctx.createLinearGradient(cx, dropY - tailH, cx, dropY + 14);
      grad.addColorStop(0, 'rgba(15, 76, 58, 0)');
      grad.addColorStop(0.55, 'rgba(26, 122, 94, 0.85)');
      grad.addColorStop(0.88, COLORS.ivory);
      grad.addColorStop(1, COLORS.gold);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, dropY - tailH);
      ctx.quadraticCurveTo(cx + 12, dropY - 4, cx, dropY + 13);
      ctx.quadraticCurveTo(cx - 12, dropY - 4, cx, dropY - tailH);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // Impact trigger at 245ms
    if (elapsedMs >= 245 && !this.impactFired) {
      this.impactFired = true;
      var maxRad = Math.hypot(this.w, this.h) * 0.42;
      this.emitRing(cx, cy, maxRad, COLORS.ivory, 3.2);
      this.emitRing(cx, cy, maxRad * 0.72, COLORS.gold, 2.0);
      this.emitRadialBurst(cx, cy, 42, 0.92, [COLORS.ivory, COLORS.gold, COLORS.emerald, COLORS.forest]);
    }

    // Explosion secondary burst at 620ms
    if (elapsedMs >= 620 && !this.explosionBurstFired) {
      this.explosionBurstFired = true;
      this.emitRadialBurst(cx, cy, 34, 1.12, [COLORS.gold, COLORS.ivory, COLORS.emerald]);
    }

    // Draw expanding shockwave rings
    for (var rIdx = this.rings.length - 1; rIdx >= 0; rIdx--) {
      var ring = this.rings[rIdx];
      ring.life += dtSec;
      var p = clamp(ring.life / ring.maxLife, 0, 1);
      ring.r = lerp(10, ring.maxR, easeOutExpo(p));
      ring.alpha = (1 - p) * 0.78;
      if (p >= 1) {
        this.rings.splice(rIdx, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.globalAlpha = ring.alpha;
      ctx.lineWidth = Math.max(0.6, ring.lineWidth * (1 - p * 0.7));
      ctx.stroke();
      ctx.restore();
    }

    // Fade out remaining droplets cleanly by 2.15s
    var globalFade = elapsedMs > 1950 ? clamp(1 - (elapsedMs - 1950) / 280, 0, 1) : 1;

    for (var i = this.droplets.length - 1; i >= 0; i--) {
      var d = this.droplets[i];
      d.life += dtSec;
      if (d.life >= d.maxLife || globalFade <= 0.01) {
        this.droplets.splice(i, 1);
        continue;
      }
      var frameDrag = Math.pow(d.drag, dtSec * 60);
      d.vx *= frameDrag;
      d.vy = d.vy * frameDrag + d.gravity * dtSec * 0.35;
      d.x += d.vx * dtSec;
      d.y += d.vy * dtSec;

      var lifeRatio = d.life / d.maxLife;
      var spd = Math.hypot(d.vx, d.vy);
      var stretch = clamp(spd / 220, 1, 3.8);
      var angle = Math.atan2(d.vy, d.vx);

      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(angle);
      ctx.globalAlpha = d.alpha * (1 - easeInQuad(lifeRatio)) * globalFade;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, d.radius * stretch, d.radius * 0.78, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  PaintParticles.prototype.destroy = function () {
    this.droplets = [];
    this.rings = [];
    if (this.canvas) {
      this.canvas.width = 0;
      this.canvas.height = 0;
    }
  };

  // ---------------------------------------------------------------------------
  // 2. LiquidRibbons — Canvas Viscous Flowing Paint Streams (Scene 2-3)
  // ---------------------------------------------------------------------------
  function LiquidRibbons(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isLowPower = window.innerWidth < 768;
  }

  LiquidRibbons.prototype.draw = function (elapsedMs) {
    // Active primarily between 580ms and 2200ms
    if (elapsedMs < 580 || elapsedMs > 2250 || !this.ctx) return;

    var ctx = this.ctx;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var progress = clamp((elapsedMs - 580) / 1550, 0, 1);
    var fadeIn = easeOutCubic(clamp((elapsedMs - 580) / 260, 0, 1));
    var fadeOut = elapsedMs > 1880 ? clamp(1 - (elapsedMs - 1880) / 360, 0, 1) : 1;
    var alpha = fadeIn * fadeOut;
    if (alpha <= 0.01) return;

    var streams = [
      { color: COLORS.emerald, amp: h * 0.14, freq: 1.8, phase: 0.2, width: w < 640 ? 10 : 18, yOff: -12 },
      { color: COLORS.ivory, amp: h * 0.11, freq: 2.3, phase: 1.7, width: w < 640 ? 6 : 11, yOff: 6 },
      { color: COLORS.gold, amp: h * 0.09, freq: 2.8, phase: 3.1, width: w < 640 ? 4 : 7, yOff: 0 },
    ];

    ctx.save();
    if (!this.isLowPower) {
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(214, 173, 69, 0.35)';
    }

    for (var s = 0; s < streams.length; s++) {
      var st = streams[s];
      var headX = lerp(-w * 0.12, w * 1.15, easeInOutCubic(progress));
      var tailX = Math.max(-w * 0.18, headX - w * 0.68);
      var steps = 28;

      ctx.beginPath();
      for (var i = 0; i <= steps; i++) {
        var frac = i / steps;
        var x = lerp(tailX, headX, frac);
        var nx = x / w;
        var wave = Math.sin(nx * Math.PI * st.freq + progress * 4.5 + st.phase) * st.amp * (1 - Math.abs(nx - 0.5) * 0.65);
        var y = h * 0.5 + st.yOff + wave;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      var grad = ctx.createLinearGradient(tailX, h * 0.5, headX, h * 0.5);
      grad.addColorStop(0, 'rgba(15, 76, 58, 0)');
      grad.addColorStop(0.35, st.color);
      grad.addColorStop(0.88, st.color);
      grad.addColorStop(1, 'rgba(250, 249, 245, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = st.width * (0.65 + 0.35 * Math.sin(progress * Math.PI));
      ctx.lineCap = 'round';
      ctx.globalAlpha = alpha * 0.72;
      ctx.stroke();
    }

    ctx.restore();
  };

  // ---------------------------------------------------------------------------
  // 3. PaintSplash — Asset Choreography for Scenes 01, 02, 03 & 05
  // ---------------------------------------------------------------------------
  function PaintSplash(layers) {
    this.impact = layers.impact;
    this.explosion = layers.explosion;
    this.ribbons = layers.ribbons;
    this.kinetic = layers.kinetic;
    this.settled = false;
  }

  PaintSplash.prototype.update = function (t) {
    if (this.settled) return;

    // Subtle physical impact shock recoil (245ms - 480ms)
    if (this.kinetic) {
      if (t >= 245 && t < 480) {
        var k = 1 - (t - 245) / 235;
        var sx = Math.sin(t * 0.14) * 3.5 * k;
        var sy = Math.cos(t * 0.18) * 3.5 * k;
        this.kinetic.style.transform = 'translate3d(' + sx.toFixed(2) + 'px,' + sy.toFixed(2) + 'px,0)';
      } else if (this.kinetic.style.transform !== 'none') {
        this.kinetic.style.transform = 'none';
      }
    }

    // Scene 01 Layer: 01_paint_impact.png (235ms -> 920ms)
    if (this.impact) {
      if (t >= 235 && t <= 950) {
        var p1 = easeOutExpo(clamp((t - 235) / 360, 0, 1));
        var fade1 = t > 620 ? clamp(1 - (t - 620) / 310, 0, 1) : p1;
        var sc1 = lerp(0.72, 1.07, clamp((t - 235) / 680, 0, 1));
        var rad = lerp(8, 130, p1);
        this.impact.style.opacity = (fade1 * 0.92).toFixed(3);
        this.impact.style.clipPath = 'circle(' + rad.toFixed(1) + '% at 50% 50%)';
        this.impact.querySelector('img').style.transform = 'scale(' + sc1.toFixed(4) + ')';
      } else {
        this.impact.style.opacity = '0';
      }
    }

    // Scene 02 Layer: 02_paint_explosion.png (580ms -> 1550ms)
    if (this.explosion) {
      if (t >= 560 && t <= 1600) {
        var p2 = easeOutCubic(clamp((t - 560) / 480, 0, 1));
        var fade2 = t > 1180 ? clamp(1 - (t - 1180) / 380, 0, 1) : p2;
        var sc2 = lerp(0.86, 1.12, clamp((t - 560) / 960, 0, 1));
        var rot2 = lerp(-1.8, 0.8, clamp((t - 560) / 960, 0, 1));
        var rad2 = lerp(14, 135, p2);
        this.explosion.style.opacity = (fade2 * 0.88).toFixed(3);
        this.explosion.style.clipPath = 'circle(' + rad2.toFixed(1) + '% at 50% 50%)';
        this.explosion.querySelector('img').style.transform =
          'scale(' + sc2.toFixed(4) + ') rotate(' + rot2.toFixed(2) + 'deg)';
      } else {
        this.explosion.style.opacity = '0';
      }
    }

    // Scene 03 Layer: 03_liquid_ribbons.png (1180ms -> 2620ms, fades clear before Scene 05)
    if (this.ribbons) {
      if (t >= 1180 && t <= 2640) {
        var wipe = easeOutExpo(clamp((t - 1180) / 620, 0, 1));
        var fadeIn3 = clamp((t - 1180) / 260, 0, 1);
        var settleOpacity = t > 2050 ? lerp(0.86, 0, clamp((t - 2050) / 560, 0, 1)) : 0.86 * fadeIn3;
        var sc3 = lerp(1.16, 1.01, clamp((t - 1180) / 1400, 0, 1));
        var tx3 = lerp(-3.5, 1.5, clamp((t - 1180) / 1500, 0, 1));
        var rightInset = Math.max(0, 100 - wipe * 100);
        this.ribbons.style.opacity = settleOpacity.toFixed(3);
        this.ribbons.style.clipPath = 'inset(0 ' + rightInset.toFixed(1) + '% 0 0)';
        this.ribbons.querySelector('img').style.transform =
          'translate3d(' + tx3.toFixed(2) + '%, 0, 0) scale(' + sc3.toFixed(4) + ')';
      } else {
        this.ribbons.style.opacity = '0';
      }
    }

    if (t > 2660) {
      this.settled = true;
    }
  };

  // ---------------------------------------------------------------------------
  // 4. LogoReveal — 7 Architectural Letter Slots + Gold Sweep & Tagline
  // ---------------------------------------------------------------------------
  function LogoReveal(rootEl, particles) {
    this.root = rootEl;
    this.particles = particles;
    this.slots = Array.prototype.slice.call(rootEl.querySelectorAll('.wi-letter-slot'));
    this.revealed = {};
    this.revealStageTriggered = false;
  }

  LogoReveal.prototype.update = function (elapsedMs) {
    // Scene 03: Sequential W-A-N-D-E-R-S emergence from paint ribbons (1300ms -> 2080ms)
    var startMs = 1300;
    var stepMs = 105;
    for (var i = 0; i < this.slots.length; i++) {
      var triggerTime = startMs + i * stepMs;
      if (elapsedMs >= triggerTime && !this.revealed[i]) {
        this.revealed[i] = true;
        this.slots[i].classList.add('is-visible');
        if (this.particles) {
          var ratioX = 0.24 + (i / 6) * 0.52;
          this.particles.triggerLetterSpark(i, ratioX);
        }
      }
    }

    // Scene 04: Final Brand Reveal (2120ms -> 2820ms)
    if (elapsedMs >= 2120 && !this.revealStageTriggered) {
      this.revealStageTriggered = true;
      this.root.classList.add('wi-intro--reveal');
    }
  };

  // ---------------------------------------------------------------------------
  // 5. PageTransition — Power Paint Wipe (Logo Fade -> Charge -> Vertical Wipe)
  // ---------------------------------------------------------------------------
  function PageTransition(rootEl) {
    this.root = rootEl;
    this.logoFaded = false;
    this.charged = false;
    this.wiped = false;
  }

  PageTransition.prototype.update = function (elapsedMs) {
    if (elapsedMs >= 2720 && !this.logoFaded) {
      this.logoFaded = true;
      this.root.classList.add('wi-intro--logo-fade');
    }
    if (elapsedMs >= 2780 && !this.charged) {
      this.charged = true;
      this.root.classList.add('wi-intro--charge');
    }
    if (elapsedMs >= 2860 && !this.wiped) {
      this.wiped = true;
      this.root.classList.add('wi-intro--wipe', 'wi-intro--exit');
      document.documentElement.classList.add('wi-hero-enter');
      try {
        window.dispatchEvent(new CustomEvent('wanders:intro-wipe'));
      } catch (e) {}
    }
  };

  // ---------------------------------------------------------------------------
  // 6. IntroTimeline — Master Controller & Asset Preloader
  // ---------------------------------------------------------------------------
  function buildMarkup(mount) {
    var lettersHtml = LETTER_SPECS.map(function (spec) {
      return (
        '<div class="wi-letter-slot" data-glyph="' + spec.ch + '" style="--cs:' + spec.cs + ';--tx:' + spec.tx + ';--ty:' + spec.ty + ';--gw:' + spec.gw + ';--gh:' + spec.gh + ';">' +
          '<img src="' + ASSET_BASE + spec.file + '" alt="' + spec.ch + '" decoding="async" draggable="false">' +
        '</div>'
      );
    }).join('');

    var waveSvg =
      '<div class="wi-curtain-wave" aria-hidden="true">' +
        '<svg class="wi-wave-bg" viewBox="0 0 1440 120" preserveAspectRatio="none">' +
          '<defs>' +
            '<linearGradient id="wiEmeraldRim" x1="0%" y1="0%" x2="100%" y2="0%">' +
              '<stop offset="0%" stop-color="#0F4C3A" />' +
              '<stop offset="35%" stop-color="#1E8E6A" />' +
              '<stop offset="68%" stop-color="#25A37B" />' +
              '<stop offset="100%" stop-color="#146B51" />' +
            '</linearGradient>' +
            '<linearGradient id="wiGoldEdge" x1="0%" y1="0%" x2="100%" y2="0%">' +
              '<stop offset="0%" stop-color="#C89B34" />' +
              '<stop offset="32%" stop-color="#F5DC8E" />' +
              '<stop offset="65%" stop-color="#D6AD45" />' +
              '<stop offset="100%" stop-color="#F0CF72" />' +
            '</linearGradient>' +
          '</defs>' +
          '<path d="M0,0 L1440,0 L1440,65 C1180,42 940,94 680,70 C420,45 220,94 0,66 Z" fill="url(#wiEmeraldRim)" />' +
          '<path d="M0,0 L1440,0 L1440,54 C1180,32 940,82 680,58 C420,34 220,82 0,54 Z" fill="#04241C" />' +
          '<path d="M0,66 C220,94 420,45 680,70 C940,94 1180,42 1440,65" fill="none" stroke="rgba(214,173,69,0.34)" stroke-width="9" stroke-linecap="round" />' +
          '<path d="M0,66 C220,94 420,45 680,70 C940,94 1180,42 1440,65" fill="none" stroke="url(#wiGoldEdge)" stroke-width="3.6" stroke-linecap="round" />' +
        '</svg>' +
        '<svg class="wi-wave-drops" viewBox="0 0 1200 110" preserveAspectRatio="xMidYMin meet">' +
          '<defs>' +
            '<radialGradient id="wiDropEmerald" cx="35%" cy="35%" r="65%">' +
              '<stop offset="0%" stop-color="#35CC9D" />' +
              '<stop offset="55%" stop-color="#198262" />' +
              '<stop offset="100%" stop-color="#0A3F30" />' +
            '</radialGradient>' +
            '<radialGradient id="wiDropGold" cx="35%" cy="35%" r="65%">' +
              '<stop offset="0%" stop-color="#FFF2C2" />' +
              '<stop offset="55%" stop-color="#D6AD45" />' +
              '<stop offset="100%" stop-color="#8C6718" />' +
            '</radialGradient>' +
          '</defs>' +
          '<g opacity="0.92">' +
            '<path d="M188,42 C190,49 193,54 193,58 A5.2,5.2 0 1,1 183,58 C183,54 186,49 188,42 Z" fill="url(#wiDropEmerald)" />' +
            '<circle cx="212" cy="64" r="2.2" fill="url(#wiDropGold)" opacity="0.88" />' +
            '<circle cx="386" cy="48" r="2.8" fill="url(#wiDropGold)" opacity="0.85" />' +
            '<path d="M596,46 C598.5,54 602,59 602,63.5 A6,6 0 1,1 590,63.5 C590,59 593.5,54 596,46 Z" fill="url(#wiDropEmerald)" />' +
            '<circle cx="614" cy="70" r="2.4" fill="url(#wiDropEmerald)" opacity="0.78" />' +
            '<circle cx="778" cy="58" r="2.1" fill="url(#wiDropGold)" opacity="0.9" />' +
            '<path d="M936,38 C938,44 940.5,48 940.5,51.5 A4.5,4.5 0 1,1 931.5,51.5 C931.5,48 934,44 936,38 Z" fill="url(#wiDropEmerald)" />' +
            '<circle cx="1028" cy="52" r="2.6" fill="url(#wiDropGold)" opacity="0.86" />' +
          '</g>' +
        '</svg>' +
      '</div>';

    mount.innerHTML =
      '<div class="wi-curtain" id="wiCurtain">' +
        '<div class="wi-curtain-bg"></div>' +
        '<div class="wi-kinetic-stage" id="wiKineticStage">' +
          '<div class="wi-layer" id="wiLayerImpact" style="z-index:2;"><img src="' + ASSET_BASE + '01_paint_impact.png" alt="" decoding="async" draggable="false"></div>' +
          '<div class="wi-layer" id="wiLayerExplosion" style="z-index:3;"><img src="' + ASSET_BASE + '02_paint_explosion.png" alt="" decoding="async" draggable="false"></div>' +
          '<div class="wi-layer" id="wiLayerRibbons" style="z-index:4;"><img src="' + ASSET_BASE + '03_liquid_ribbons.png" alt="" decoding="async" draggable="false"></div>' +
          '<div class="wi-vignette"></div>' +
          '<canvas class="wi-canvas" id="wiCanvas"></canvas>' +
          '<div class="wi-brand-stage">' +
            '<div class="wi-logo-row" aria-label="WANDERS">' +
              '<div class="wi-logo-glow"></div>' +
              lettersHtml +
              '<div class="wi-gold-sweep"></div>' +
            '</div>' +
            '<div class="wi-brand-meta">' +
              '<div class="wi-gold-rule"></div>' +
              '<p class="wi-tagline">SẮC MÀU THỊNH VƯỢNG</p>' +
              '<p class="wi-subline">Wanders · Sắc màu kiến tạo không gian sống</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="wi-paint-charge" aria-hidden="true"></div>' +
        waveSvg +
      '</div>' +
      '<button type="button" id="wiSkipBtn" class="wi-skip-btn" aria-label="Bỏ qua Intro">Bỏ qua <span aria-hidden="true">→</span></button>' +
      '<div class="wi-progress-track" aria-hidden="true"><div class="wi-progress-fill" id="wiProgressFill"></div></div>';
  }

  function preloadAssets(maxWaitMs) {
    var files = FX_FILES.concat(LETTER_SPECS.map(function (s) { return s.file; }));
    var loaded = files.map(function (f) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { resolve(true); };
        img.onerror = function () { resolve(false); };
        img.src = ASSET_BASE + f;
        if (img.complete) resolve(true);
      });
    });
    var timeoutPromise = new Promise(function (resolve) {
      setTimeout(function () { resolve('timeout'); }, maxWaitMs);
    });
    return Promise.race([Promise.all(loaded), timeoutPromise]);
  }

  function IntroTimeline(mount) {
    this.mount = mount;
    this.rafId = null;
    this.safetyTimer = null;
    this.finished = false;
    this.startTime = 0;
    this.lastFrameTime = 0;
    this.onResize = null;
    this.onKeyDown = null;
  }

  IntroTimeline.prototype.finish = function (immediate) {
    if (this.finished) return;
    this.finished = true;

    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {}

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onKeyDown) document.removeEventListener('keydown', this.onKeyDown);

    var self = this;
    function unmount() {
      document.documentElement.classList.remove('wi-active');
      document.documentElement.classList.add('wi-hero-enter');
      try {
        window.dispatchEvent(new CustomEvent('wanders:intro-done'));
      } catch (e) {}
      if (self.particles) self.particles.destroy();
      if (self.mount) {
        self.mount.style.display = 'none';
        self.mount.className = 'wi-overlay';
        self.mount.innerHTML = '';
      }
    }

    if (immediate || !this.mount) {
      unmount();
    } else {
      this.mount.classList.add('wi-intro--logo-fade', 'wi-intro--charge', 'wi-intro--wipe', 'wi-intro--exit');
      setTimeout(unmount, 970);
    }
  };

  IntroTimeline.prototype.start = function () {
    var self = this;
    buildMarkup(this.mount);

    var canvas = document.getElementById('wiCanvas');
    var progressFill = document.getElementById('wiProgressFill');
    var skipBtn = document.getElementById('wiSkipBtn');

    this.particles = new PaintParticles(canvas);
    this.ribbonsFx = new LiquidRibbons(canvas);
    this.splash = new PaintSplash({
      kinetic: document.getElementById('wiKineticStage'),
      impact: document.getElementById('wiLayerImpact'),
      explosion: document.getElementById('wiLayerExplosion'),
      ribbons: document.getElementById('wiLayerRibbons'),
    });
    this.logoReveal = new LogoReveal(this.mount, this.particles);
    this.transition = new PageTransition(this.mount);

    this.onResize = function () {
      if (self.particles) self.particles.resize();
    };
    window.addEventListener('resize', this.onResize, { passive: true });

    this.onKeyDown = function (e) {
      if (e.key === 'Escape') self.finish(true);
    };
    document.addEventListener('keydown', this.onKeyDown);

    if (skipBtn) {
      skipBtn.addEventListener('click', function () {
        self.finish(true);
      });
    }

    // Hard fail-safe guarantee so site is never locked
    this.safetyTimer = setTimeout(function () {
      self.finish(true);
    }, HARD_SAFETY_TIMEOUT);

    // Preload images briefly (max 900ms wait on slow connections) then run timeline
    preloadAssets(900).then(function () {
      if (self.finished) return;
      self.startTime = performance.now();
      self.lastFrameTime = self.startTime;

      function tick(now) {
        if (self.finished) return;
        var elapsed = now - self.startTime;
        var dtSec = clamp((now - self.lastFrameTime) / 1000, 0.001, 0.05);
        self.lastFrameTime = now;

        if (progressFill) {
          progressFill.style.width = clamp((elapsed / TOTAL_DURATION) * 100, 0, 100).toFixed(1) + '%';
        }

        self.particles.updateAndDraw(elapsed, dtSec);
        self.ribbonsFx.draw(elapsed);
        self.splash.update(elapsed);
        self.logoReveal.update(elapsed);
        self.transition.update(elapsed);

        if (elapsed >= TOTAL_DURATION) {
          self.finish(true);
          return;
        }
        self.rafId = requestAnimationFrame(tick);
      }

      self.rafId = requestAnimationFrame(tick);
    });
  };

  function shouldRunIntro() {
    var qs = window.location.search || '';
    if (qs.indexOf('intro=0') !== -1) {
      return false;
    }
    if (qs.indexOf('intro=1') !== -1) {
      return true;
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    return true;
  }

  var activeTimeline = null;

  function boot() {
    var mount = document.getElementById('wanders-intro');
    if (!mount) {
      document.documentElement.classList.remove('wi-active');
      return;
    }
    if (!shouldRunIntro()) {
      document.documentElement.classList.remove('wi-active');
      mount.style.display = 'none';
      return;
    }
    try {
      document.documentElement.classList.add('wi-active');
      activeTimeline = new IntroTimeline(mount);
      activeTimeline.start();
    } catch (err) {
      // Never lock page if any unexpected error happens
      document.documentElement.classList.remove('wi-active');
      mount.style.display = 'none';
    }
  }

  window.WandersIntro = {
    replay: function () {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (e) {}
      if (activeTimeline) activeTimeline.finish(true);
      var mount = document.getElementById('wanders-intro');
      if (mount) {
        mount.style.display = 'block';
        mount.style.clipPath = '';
        mount.style.opacity = '';
        mount.className = 'wi-overlay';
        document.documentElement.classList.add('wi-active');
        activeTimeline = new IntroTimeline(mount);
        activeTimeline.start();
      }
    },
    skip: function () {
      if (activeTimeline) activeTimeline.finish(true);
    },
  };
  window.WandersIntrol = window.WandersIntro;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

