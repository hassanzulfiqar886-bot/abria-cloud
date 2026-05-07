// AbriaCloud Technologies — Landing Page Interactivity

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // -------- Sticky header + back-to-top --------
  const header = $('#siteHeader');
  const back   = $('#backToTop');
  function onScroll() {
    header?.classList.toggle('scrolled', window.scrollY > 12);
    back?.classList.toggle('visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- Mobile nav --------
  const hamburger = $('#hamburger');
  const mainNav   = $('#mainNav');
  function setNavOpen(open) {
    mainNav?.classList.toggle('open', open);
    hamburger?.classList.toggle('open', open);
    hamburger?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  hamburger?.addEventListener('click', () => {
    setNavOpen(!mainNav.classList.contains('open'));
  });
  $$('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav?.classList.contains('open')) setNavOpen(false);
    });
  });

  // -------- Active section highlight --------
  const navLinks = $$('.main-nav a[href^="#"]');
  const sections = navLinks
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  function syncActive() {
    const y = window.scrollY + 160;
    let current = sections[0];
    for (const s of sections) {
      if (s.offsetTop <= y) current = s;
    }
    navLinks.forEach(l => l.classList.remove('active'));
    if (current) {
      const link = document.querySelector(`.main-nav a[href="#${current.id}"]`);
      link?.classList.add('active');
    }
  }
  window.addEventListener('scroll', syncActive, { passive: true });

  // -------- Countdown (live) --------
  const countdown = $('#countdown');
  if (countdown) {
    const target = new Date();
    target.setDate(target.getDate() + 14);
    target.setHours(target.getHours() + 7);
    target.setMinutes(target.getMinutes() + 42);

    const els = {
      days:    countdown.querySelector('[data-unit="days"]'),
      hours:   countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]')
    };
    const pad = n => String(n).padStart(2, '0');
    function tick() {
      let diff = Math.max(0, target - new Date());
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);    diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      if (els.days)    els.days.textContent    = pad(d);
      if (els.hours)   els.hours.textContent   = pad(h);
      if (els.minutes) els.minutes.textContent = pad(m);
      if (els.seconds) els.seconds.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  // -------- Allocation tabs (visual swap only) --------
  $$('.ac-tab').forEach((t, _, all) => {
    t.addEventListener('click', () => {
      all.forEach(o => { o.classList.remove('active'); o.setAttribute('aria-selected', 'false'); });
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
    });
  });

  // -------- Docs tabs --------
  $$('.docs-tabs li').forEach((t, _, all) => {
    t.addEventListener('click', () => {
      all.forEach(o => o.classList.remove('active'));
      t.classList.add('active');
    });
  });

  // -------- Contact form (graceful fallback handler) --------
  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.innerHTML = 'Sent <svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
    btn.disabled = true;
  });

  // -------- Newsletter form --------
  const newsForm = $('#newsForm');
  newsForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = newsForm.querySelector('button');
    if (!btn) return;
    btn.classList.add('sent');
    btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
    newsForm.querySelector('input').value = '';
  });

  // -------- Hero video: pause when off-screen to save CPU --------
  const heroVideo = $('.hero-bg-video');
  if (heroVideo) {
    const vio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      });
    }, { threshold: 0.05 });
    vio.observe(heroVideo);
  }

  // -------- Pause partner marquee when off-screen --------
  const marquee = $('.partners-row');
  if (marquee) {
    const mio = new IntersectionObserver(entries => {
      marquee.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    }, { threshold: 0 });
    mio.observe(marquee);
  }

})();
