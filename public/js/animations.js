/* ============================================================
   RAWAN Footwear — Animations & Micro-Interactions
   ============================================================ */

'use strict';

/* ============================================================
   1. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ============================================================
   2. HERO PARALLAX (subtle)
   ============================================================ */
function initHeroParallax() {
  const heroImg = document.querySelector('.hero-img img');
  if (!heroImg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        heroImg.style.transform = `scale(1) translateY(${scrolled * 0.15}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   3. COUNTDOWN DIGIT FLIP ANIMATION
   ============================================================ */
function animateDigitChange(el, newValue) {
  if (!el || el.textContent === newValue) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'fadeUp .3s ease forwards';
  el.textContent = newValue;
}

/* ============================================================
   4. PDP GALLERY INTERACTION
   ============================================================ */
function initPDPGallery() {
  const mainImg = document.getElementById('pdp-main-img');
  const thumbs = document.querySelectorAll('.pdp-thumb');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('on'));
      thumb.classList.add('on');
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = thumb.dataset.src;
        mainImg.style.opacity = '1';
      }, 200);
    });
  });
}

/* ============================================================
   5. SIZE SELECTOR ANIMATION
   ============================================================ */
function initSizeSelector(stockData, onSelect) {
  const btns = document.querySelectorAll('.sz-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('oos')) return;
      btns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      btn.style.animation = 'none';
      btn.offsetHeight;
      btn.style.animation = 'popIn .25s var(--ease-spring)';
      const size = btn.dataset.size;
      const qty = stockData[size];
      onSelect && onSelect(size, qty);
      // Update stock counter
      const counter = document.getElementById('stock-counter');
      const oosModule = document.getElementById('oos-module');
      if (counter && oosModule) {
        if (qty === 0) {
          counter.style.display = 'none';
          const nearOos = document.getElementById('size-urgency'); if (nearOos) nearOos.style.display = 'none';
          oosModule.classList.add('on');
        } else {
          oosModule.classList.remove('on');
          const near = document.getElementById('size-urgency');
          if (qty <= 5) {
            const txt = `<span class="stock-dot"></span> 🔥 Only ${qty} pair${qty > 1 ? 's' : ''} left in Size ${size} — order soon!`;
            counter.style.display = near ? 'none' : 'flex';
            counter.innerHTML = txt;
            if (near) { near.style.display = 'flex'; near.innerHTML = txt; }
          } else {
            counter.style.display = 'none';
            if (near) near.style.display = 'none';
          }
        }
      }
    });
  });
}

/* ============================================================
   6. ADD TO CART BUTTON MORPH
   ============================================================ */
function initATCButton() {
  const btn = document.getElementById('atc-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const selectedSize = document.querySelector('.sz-btn.on')?.dataset.size;
    const selectedColor = document.querySelector('.c-swatch.on')?.dataset.color;
    const productId = btn.dataset.productId;
    if (!selectedSize) { Toast.show('Please select a size', 'error'); return; }
    if (!selectedColor && document.querySelector('.c-swatch')) { Toast.show('Please select a color', 'error'); return; }
    Cart.add(productId, selectedSize, selectedColor || 'Default');
    btn.classList.add('success');
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg> Added to Bag';
    setTimeout(() => { btn.classList.remove('success'); btn.innerHTML = orig; }, 2500);
    // Animate cart icon
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) { cartBadge.style.animation = 'none'; cartBadge.offsetHeight; cartBadge.style.animation = 'popIn .4s var(--ease-spring)'; }
  });
}

/* ============================================================
   7. COLOR SWATCH SELECTOR
   ============================================================ */
function initColorSelector() {
  const swatches = document.querySelectorAll('.c-swatch');
  const label = document.getElementById('selected-color-label');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('on'));
      swatch.classList.add('on');
      if (label) label.textContent = swatch.dataset.colorLabel || swatch.dataset.color;
    });
  });
}

/* ============================================================
   8. TABS (PDP, FAQs, etc.)
   ============================================================ */
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector || '.tabs-wrap');
  if (!container) return;
  const heads = container.querySelectorAll('.tab-head');
  const panes = container.querySelectorAll('.tab-pane');
  heads.forEach((head, i) => {
    head.addEventListener('click', () => {
      heads.forEach(h => h.classList.remove('on'));
      panes.forEach(p => p.classList.remove('on'));
      head.classList.add('on');
      panes[i]?.classList.add('on');
    });
  });
}

/* ============================================================
   9. ACCORDION
   ============================================================ */
function initAccordions() {
  document.querySelectorAll('.acc-hd').forEach(hd => {
    hd.addEventListener('click', () => {
      const item = hd.closest('.acc-item');
      const isOpen = item.classList.contains('on');
      // Close all
      document.querySelectorAll('.acc-item.on').forEach(open => open.classList.remove('on'));
      // Open clicked (unless was already open)
      if (!isOpen) item.classList.add('on');
    });
  });
}

/* ============================================================
   10. PRODUCT CARD WISHLIST ANIMATION
   ============================================================ */
function initWishlistButtons() {
  document.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.style.animation = 'none';
      btn.offsetHeight;
      btn.style.animation = 'popIn .35s var(--ease-spring)';
    });
  });
}

/* ============================================================
   11. STICKY NAV SHADOW ON SCROLL
   ============================================================ */
function initNavScroll() {
  const nav = document.querySelector('.nav-wrap');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(26,26,26,.08)'
      : 'none';
  }, { passive: true });
}

/* ============================================================
   12. MODAL OPEN/CLOSE
   ============================================================ */
function openModal(id) {
  document.getElementById(id)?.classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('on');
  document.body.style.overflow = '';
}
window.openModal = openModal;
window.closeModal = closeModal;

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-wrap')) closeModal(e.target.id);
  if (e.target.classList.contains('modal-close')) closeModal(e.target.closest('.modal-wrap')?.id);
});

/* ============================================================
   13. TRACKING STEPS ANIMATION
   ============================================================ */
function animateTrackingSteps() {
  const steps = document.querySelectorAll('.t-step');
  steps.forEach((step, i) => {
    setTimeout(() => {
      step.style.opacity = '0';
      step.style.transform = 'translateX(-16px)';
      step.style.transition = 'opacity .4s ease, transform .4s ease';
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'translateX(0)';
      }, 50);
    }, i * 150);
  });
}
window.animateTrackingSteps = animateTrackingSteps;

/* ============================================================
   14. DELIVERY BAR ANIMATION (on cart open)
   ============================================================ */
function animateDeliveryBar() {
  const fill = document.querySelector('.del-prog-fill');
  if (!fill) return;
  const target = fill.style.width || '0%';
  fill.style.width = '0%';
  setTimeout(() => { fill.style.width = target; }, 200);
}

/* ============================================================
   15. ADMIN CHART BARS ANIMATE IN
   ============================================================ */
function animateChartBars() {
  document.querySelectorAll('.chart-bar').forEach((bar, i) => {
    const target = bar.style.height || '0%';
    bar.style.height = '0%';
    setTimeout(() => { bar.style.height = target; }, 100 + i * 60);
  });
}
window.animateChartBars = animateChartBars;

/* ============================================================
   16. SMOOTH COUNTER (stats)
   ============================================================ */
function animateCounter(el, target, duration = 1200) {
  const start = parseInt(el.textContent.replace(/\D/g, '')) || 0;
  const step = (timestamp) => {
    if (!start_time) start_time = timestamp;
    const progress = Math.min((timestamp - start_time) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  let start_time = null;
  requestAnimationFrame(step);
}

/* ============================================================
   17. INIT ALL ON PAGE LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavScroll();
  initTabs();
  initAccordions();
  initPDPGallery();
  initATCButton();
  initColorSelector();
  initWishlistButtons();
  if (window.scrollY < 100) initHeroParallax();
});

// Expose
window.animateDeliveryBar = animateDeliveryBar;
window.initSizeSelector = initSizeSelector;
window.initTabs = initTabs;
window.initAccordions = initAccordions;
window.animateCounter = animateCounter;

