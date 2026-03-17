/* ============================================================
   ANISO — Premium 3D Effects & Interactions
   ============================================================ */

'use strict';

// ── Utility ──────────────────────────────────────────────────
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const lerp  = (a, b, t) => a + (b - a) * t;
const map   = (v, i1, i2, o1, o2) => o1 + ((v - i1) / (i2 - i1)) * (o2 - o1);

/* ============================================================
   1. LOGO GLOW & FLOAT ANIMATION
   ============================================================ */
function initLogoEffect() {
  const logos = document.querySelectorAll('.nav-logo-img, .footer-brand-logo');
  logos.forEach(logo => {
    // Inject keyframe animation
    logo.style.animation = 'logoFloat 4s ease-in-out infinite';
    logo.style.filter = 'drop-shadow(0 0 0px rgba(232,180,160,0))';
    logo.style.transition = 'filter 0.4s ease';
    logo.addEventListener('mouseenter', () => {
      logo.style.filter = 'drop-shadow(0 0 12px rgba(232,180,160,0.7)) drop-shadow(0 0 28px rgba(212,184,150,0.4))';
      logo.style.animationPlayState = 'paused';
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.filter = 'drop-shadow(0 0 0px rgba(232,180,160,0))';
      logo.style.animationPlayState = 'running';
    });
  });

  // Inject keyframe
  injectStyle(`
    @keyframes logoFloat {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      33%      { transform: translateY(-3px) rotate(-0.3deg); }
      66%      { transform: translateY(-1.5px) rotate(0.2deg); }
    }
    @keyframes logoGlow {
      0%,100% { filter: drop-shadow(0 0 4px rgba(232,180,160,0.3)); }
      50%      { filter: drop-shadow(0 0 12px rgba(232,180,160,0.6)) drop-shadow(0 0 24px rgba(212,184,150,0.3)); }
    }
  `);
}

/* ============================================================
   2. 3D CARD TILT — Product Cards
   ============================================================ */
function initCardTilt() {
  document.querySelectorAll('.product-card').forEach(card => {
    let rafId = null;
    let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;
    let isHovered = false;

    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      card.style.transition = 'box-shadow 0.3s ease';
      card.style.boxShadow = '0 20px 60px rgba(139,97,71,0.18), 0 8px 24px rgba(26,23,20,0.12)';
      animate();
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      targetRY =  clamp(dx * 10, -10, 10);
      targetRX = -clamp(dy * 8,  -8, 8);
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRX = 0; targetRY = 0;
      card.style.boxShadow = '';
      setTimeout(() => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
        card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        setTimeout(() => card.style.transition = '', 650);
      }, 0);
    });

    function animate() {
      if (!isHovered && Math.abs(currentRX) < 0.05 && Math.abs(currentRY) < 0.05) return;
      currentRX = lerp(currentRX, targetRX, 0.12);
      currentRY = lerp(currentRY, targetRY, 0.12);
      card.style.transform = `perspective(800px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateZ(${isHovered ? 8 : 0}px)`;
      card.style.transition = 'none';
      rafId = requestAnimationFrame(animate);
    }
  });
}

/* ============================================================
   3. MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-hero, .btn-hero-ghost').forEach(btn => {
    let animId;
    let tx = 0, ty = 0;

    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      tx = (e.clientX - cx) * 0.22;
      ty = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${tx}px, ${ty}px) translateY(-1px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      tx = 0; ty = 0;
    });
  });
}

/* ============================================================
   4. BUTTON GLOW / SHINE SWEEP
   ============================================================ */
function initButtonGlow() {
  injectStyle(`
    .btn-primary, .btn-secondary, .btn-hero {
      position: relative; overflow: hidden;
    }
    .btn-primary::before, .btn-secondary::before, .btn-hero::before {
      content: '';
      position: absolute;
      top: -50%; left: -75%;
      width: 50%; height: 200%;
      background: linear-gradient(
        to right,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.22) 50%,
        rgba(255,255,255,0) 100%
      );
      transform: skewX(-20deg);
      transition: none;
      pointer-events: none;
    }
    .btn-primary:hover::before, .btn-secondary:hover::before, .btn-hero:hover::before {
      animation: btnShine 0.55s ease forwards;
    }
    .btn-primary:hover {
      box-shadow:
        0 0 0 1px rgba(232,180,160,0.4),
        0 4px 20px rgba(232,180,160,0.25),
        0 8px 40px rgba(26,23,20,0.15);
    }
    .btn-secondary:hover {
      box-shadow:
        0 0 0 1px rgba(232,180,160,0.3),
        0 4px 16px rgba(232,180,160,0.15);
    }
    .btn-hero:hover {
      box-shadow:
        0 0 0 1px rgba(250,248,245,0.5),
        0 4px 24px rgba(250,248,245,0.2),
        0 8px 48px rgba(250,248,245,0.1);
    }
    @keyframes btnShine {
      0%   { left: -75%; }
      100% { left: 125%; }
    }
  `);
}

/* ============================================================
   5. AMBIENT PARTICLES — Hero Section
   ============================================================ */
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:absolute; inset:0; width:100%; height:100%;
    pointer-events:none; z-index:1; opacity:0.55;
  `;
  hero.style.position = 'relative';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.4;
      this.speed= Math.random() * 0.4 + 0.15;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.55 + 0.15;
      this.fadeDir = 1;
      this.drift = (Math.random() - 0.5) * 0.3;
      const colors = ['232,180,160', '212,184,150', '250,248,245', '179,164,154'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.fadeDir === 1) {
        this.opacity = Math.min(this.opacity + 0.008, this.maxOpacity);
        if (this.opacity >= this.maxOpacity) this.fadeDir = -1;
      } else {
        this.opacity = Math.max(this.opacity - 0.004, 0);
      }
      if (this.y < -10 || this.opacity <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  let rafRunning = true;
  function loop() {
    if (!rafRunning) return;
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  // Pause when not in view
  const obs = new IntersectionObserver(([e]) => { rafRunning = e.isIntersecting; if (rafRunning) loop(); });
  obs.observe(hero);
}

/* ============================================================
   6. CURSOR GLOW TRAIL (dark sections only)
   ============================================================ */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  glow.style.cssText = `
    position:fixed; width:320px; height:320px;
    border-radius:50%;
    background: radial-gradient(circle, rgba(232,180,160,0.07) 0%, transparent 70%);
    pointer-events:none; z-index:0;
    transform:translate(-50%,-50%);
    transition: opacity 0.4s ease;
    opacity:0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  // Show only over dark sections
  function isOverDark(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return false;
    const bg = getComputedStyle(el.closest('[class]') || el).backgroundColor;
    // check if it's a dark bg
    return el.closest('.values-section, .footer, .hero, .campaign-section') !== null;
  }

  function animGlow() {
    cx = lerp(cx, mx, 0.1);
    cy = lerp(cy, my, 0.1);
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    glow.style.opacity = isOverDark(mx, my) ? '1' : '0';
    requestAnimationFrame(animGlow);
  }
  animGlow();
}

/* ============================================================
   7. 3D SCROLL REVEALS (staggered rotateX entrance)
   ============================================================ */
function init3DReveal() {
  injectStyle(`
    .reveal-3d {
      opacity: 0;
      transform: perspective(600px) rotateX(18deg) translateY(32px);
      transition:
        opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94),
        transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    .reveal-3d.in {
      opacity: 1;
      transform: perspective(600px) rotateX(0deg) translateY(0px);
    }
  `);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section-title, .product-card, .collection-card, .value-item, .reassurance-item').forEach((el, i) => {
    el.classList.add('reveal-3d');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    obs.observe(el);
  });
}

/* ============================================================
   8. HERO PARALLAX
   ============================================================ */
function initParallax() {
  const heroImg = document.querySelector('.hero-image-wrap img');
  const heroContent = document.querySelector('.hero-content');
  if (!heroImg && !heroContent) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroImg)     heroImg.style.transform = `scale(1.06) translateY(${scrollY * 0.2}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.08}px)`;
  }, { passive: true });
}

/* ============================================================
   9. COLLECTION CARD 3D HOVER
   ============================================================ */
function initCollectionCards() {
  document.querySelectorAll('.collection-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(1000px) rotateY(${dx * 7}deg) rotateX(${-dy * 5}deg) scale3d(1.02,1.02,1.02)`;
      card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
      card.style.transform  = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    });
  });
}

/* ============================================================
   10. ANIMATED COUNTER (reassurance numbers)
   ============================================================ */
function initCounters() {
  // not used here but hook is ready
}

/* ============================================================
   11. NAV LOGO ENTRANCE
   ============================================================ */
function initNavLogoEntrance() {
  injectStyle(`
    .nav-logo-img {
      animation: logoEntrance 1s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes logoEntrance {
      from { opacity:0; transform: translateY(-8px) scale(0.9); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }
  `);
}

/* ============================================================
   12. GLOWING CART COUNT BADGE PULSE
   ============================================================ */
function initCartBadgePulse() {
  injectStyle(`
    .cart-count.visible {
      animation: badgePulse 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes badgePulse {
      0%   { transform:scale(0); box-shadow:0 0 0 0 rgba(232,180,160,0.7); }
      60%  { transform:scale(1.3); box-shadow:0 0 0 6px rgba(232,180,160,0); }
      100% { transform:scale(1);  box-shadow:0 0 0 0 rgba(232,180,160,0); }
    }
  `);
}

/* ============================================================
   13. IMAGE HOVER ZOOM WITH COLOR OVERLAY SHIFT
   ============================================================ */
function initImageEffects() {
  injectStyle(`
    .product-card-img-wrap::after {
      content:'';
      position:absolute; inset:0;
      background: linear-gradient(135deg, rgba(232,180,160,0.0) 0%, rgba(212,184,150,0.0) 100%);
      transition: background 0.4s ease;
      pointer-events:none;
      z-index:1;
    }
    .product-card:hover .product-card-img-wrap::after {
      background: linear-gradient(135deg, rgba(232,180,160,0.08) 0%, rgba(212,184,150,0.06) 100%);
    }
    .collection-img-wrap::after {
      content:'';
      position:absolute; inset:0;
      background: radial-gradient(ellipse at 30% 30%, rgba(232,180,160,0.0) 0%, transparent 60%);
      transition: background 0.5s ease;
      pointer-events:none;
      z-index:1;
    }
    .collection-card:hover .collection-img-wrap::after {
      background: radial-gradient(ellipse at 30% 30%, rgba(232,180,160,0.12) 0%, transparent 60%);
    }
  `);
}

/* ============================================================
   14. ANNOUNCEMENT BAR TYPEWRITER
   ============================================================ */
function initAnnouncementGlow() {
  const bar = document.querySelector('.announcement-bar');
  if (!bar) return;
  bar.style.borderBottom = '1px solid rgba(232,180,160,0.15)';
}

/* ============================================================
   INJECT STYLE HELPER
   ============================================================ */
function injectStyle(css) {
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
}

/* ============================================================
   GLOBAL CSS ENHANCEMENTS
   ============================================================ */
function injectGlobalEnhancements() {
  injectStyle(`
    /* Smooth scrollbar */
    html { scroll-behavior: smooth; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--taupe-light); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--taupe); }

    /* Selection color */
    ::selection { background: rgba(232,180,160,0.3); color: var(--black); }

    /* Focus rings */
    *:focus-visible { outline: 2px solid var(--blush); outline-offset: 3px; }

    /* Nav link hover glow */
    .nav-links li a:hover {
      text-shadow: 0 0 20px rgba(232,180,160,0.4);
    }

    /* Footer logo invert glow */
    .footer-brand-logo:hover {
      filter: invert(1) drop-shadow(0 0 8px rgba(212,184,150,0.5)) !important;
    }

    /* Product card depth shadow on hover */
    .product-card {
      transition: box-shadow 0.4s ease;
    }
    .product-card:hover {
      z-index: 2;
    }

    /* Size option glow on select */
    .size-option.selected {
      box-shadow: 0 0 0 1px var(--black), 0 4px 12px rgba(26,23,20,0.2);
    }
    .size-option:hover:not(.out-of-stock) {
      box-shadow: 0 2px 8px rgba(139,97,71,0.15);
    }

    /* Cart checkout button glow */
    .cart-checkout-btn:hover {
      box-shadow: 0 4px 24px rgba(26,23,20,0.25), 0 0 0 1px rgba(232,180,160,0.2);
    }

    /* FAQ question hover */
    .faq-question:hover .faq-icon {
      color: var(--blush);
    }

    /* Collection card shine */
    .collection-card { overflow: hidden; }
    .collection-card::after {
      content:'';
      position:absolute; inset:0;
      background: linear-gradient(135deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 60%);
      opacity:0;
      transition: opacity 0.4s ease, transform 0.4s ease;
      transform: translateX(-100%) skewX(-15deg);
      z-index: 3; pointer-events:none;
    }
    .collection-card:hover::after {
      opacity:1;
      transform: translateX(200%) skewX(-15deg);
      transition: opacity 0.1s ease, transform 0.6s ease;
    }

    /* Hero entrance animation */
    .hero-content > * {
      animation: heroContentIn 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both;
    }
    .hero-content > *:nth-child(1) { animation-delay: 0.1s; }
    .hero-content > *:nth-child(2) { animation-delay: 0.2s; }
    .hero-content > *:nth-child(3) { animation-delay: 0.35s; }
    .hero-content > *:nth-child(4) { animation-delay: 0.5s; }
    @keyframes heroContentIn {
      from { opacity:0; transform: translateY(24px); }
      to   { opacity:1; transform: translateY(0); }
    }

    /* Announcement scroll glow */
    .announcement-bar { position: relative; }
    .announcement-bar::after {
      content:'';
      position:absolute; bottom:0; left:0; right:0;
      height:1px;
      background: linear-gradient(90deg, transparent, rgba(232,180,160,0.3), transparent);
    }

    /* Input focus glow */
    .form-input:focus, .form-textarea:focus {
      box-shadow: 0 0 0 3px rgba(232,180,160,0.12), 0 2px 8px rgba(139,97,71,0.08);
    }

    /* Navbar backdrop glow on scroll */
    .navbar.scrolled::after {
      content:'';
      position:absolute; bottom:0; left:0; right:0;
      height:1px;
      background: linear-gradient(90deg, transparent 0%, rgba(232,180,160,0.2) 50%, transparent 100%);
    }

    /* Page transition fade */
    body { animation: pageFadeIn 0.4s ease both; }
    @keyframes pageFadeIn {
      from { opacity:0; transform:translateY(4px); }
      to   { opacity:1; transform:translateY(0); }
    }

    /* Value item hover glow */
    .value-item:hover .value-title {
      text-shadow: 0 0 20px rgba(212,184,150,0.3);
    }
    .value-item:hover .value-icon {
      filter: drop-shadow(0 0 8px rgba(212,184,150,0.5));
      transform: scale(1.08);
      transition: filter 0.3s ease, transform 0.3s ease;
    }

    /* Reassurance item glow */
    .reassurance-item:hover .reassurance-icon svg {
      filter: drop-shadow(0 0 6px rgba(139,97,71,0.4));
      transition: filter 0.3s ease;
    }

    /* Footer link glow */
    .footer-links a:hover {
      text-shadow: 0 0 12px rgba(250,248,245,0.15);
      padding-left: 6px;
      transition: color 0.3s ease, padding-left 0.3s ease, text-shadow 0.3s ease;
    }
  `);
}

/* ============================================================
   INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  injectGlobalEnhancements();
  initNavLogoEntrance();
  initLogoEffect();
  initButtonGlow();
  initCartBadgePulse();
  initImageEffects();
  initAnnouncementGlow();

  // RAF-heavy effects — slight delay to not block initial paint
  requestAnimationFrame(() => {
    initCardTilt();
    initCollectionCards();
    initMagneticButtons();
    init3DReveal();
    initParallax();
    initCursorGlow();
    initParticles();
  });
});
