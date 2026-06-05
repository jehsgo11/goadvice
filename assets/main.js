/* === Go Advice AS — Shared JS v3.0 === */

/* ─── Scroll Animations (IntersectionObserver) ─────────────────────── */
(function initScrollAnimations() {
  const animatedEls = document.querySelectorAll(
    '.animate, .animate-left, .animate-right, .animate-scale'
  );

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animatedEls.forEach(el => observer.observe(el));
})();

/* ─── Nav Scroll Behavior ──────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const heroSection = document.getElementById('hero');
  const isTransparentHero = heroSection && (
    heroSection.classList.contains('hero--gradient') ||
    heroSection.classList.contains('hero--photo')
  );

  function updateNav() {
    const scrolled = window.scrollY > 40;
    if (isTransparentHero) {
      nav.classList.toggle('nav--transparent', !scrolled);
      nav.classList.toggle('nav--scrolled', scrolled);
    } else {
      nav.classList.add('nav--scrolled');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
})();

/* ─── Hero Parallax ────────────────────────────────────────────────── */
(function initHeroParallax() {
  const hero = document.querySelector('.hero--photo, .hero--gradient');
  if (!hero) return;

  /* Skip on touch devices — parallax causes judder */
  if ('ontouchstart' in window) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        if (hero.classList.contains('hero--photo')) {
          hero.style.backgroundPositionY = `calc(50% + ${rate}px)`;
        }
        /* Watermark float on gradient hero */
        const watermark = hero.querySelector('.hero__watermark');
        if (watermark) {
          watermark.style.transform = `translateY(calc(-50% + ${scrolled * 0.12}px))`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── FAQ Accordion ────────────────────────────────────────────────── */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      /* Close all */
      faqItems.forEach(i => {
        i.classList.remove('open');
        const t = i.querySelector('.faq-item__trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      /* Open this one if it was closed */
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('role', 'button');
    const body = item.querySelector('.faq-item__body');
    if (body) {
      const id = 'faq-body-' + Math.random().toString(36).slice(2, 7);
      body.id = id;
      trigger.setAttribute('aria-controls', id);
    }
  });
})();

/* ─── Cookie Banner ─────────────────────────────────────────────────── */
(function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const STORAGE_KEY = 'ga_cookie_consent';
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    setTimeout(() => banner.classList.add('visible'), 1200);
  }

  const acceptBtn = banner.querySelector('[data-cookie-accept]');
  const declineBtn = banner.querySelector('[data-cookie-decline]');

  function dismiss(choice) {
    banner.classList.remove('visible');
    localStorage.setItem(STORAGE_KEY, choice);
    setTimeout(() => banner.remove(), 600);

    if (choice === 'accepted') {
      /* Load analytics here if/when implemented */
      document.dispatchEvent(new CustomEvent('ga:consent', { detail: { analytics: true } }));
    }
  }

  if (acceptBtn)  acceptBtn.addEventListener('click',  () => dismiss('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => dismiss('declined'));
})();

/* ─── Smooth Hover: lift cards on focus (keyboard nav) ─────────────── */
(function initCardFocus() {
  const cards = document.querySelectorAll('.path-card, .step-card, .review-card, .problem-item');
  cards.forEach(card => {
    card.addEventListener('focusin',  () => card.style.transform = 'translateY(-6px)');
    card.addEventListener('focusout', () => card.style.transform = '');
  });
})();
