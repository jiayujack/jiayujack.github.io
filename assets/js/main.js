(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = [...document.querySelectorAll('.nav-list a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const revealItems = [...document.querySelectorAll('.reveal')];
  const year = document.querySelector('#year');

  const getTheme = () => root.dataset.theme === 'dark' ? 'dark' : 'light';
  const readStoredTheme = () => {
    try { return localStorage.getItem('theme'); } catch (_) { return null; }
  };
  const storeTheme = (theme) => {
    try { localStorage.setItem('theme', theme); } catch (_) { /* Storage may be disabled. */ }
  };

  const updateThemeLabel = () => {
    if (!themeToggle) return;
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
    themeToggle.setAttribute('title', `Switch to ${next} theme`);
  };

  if (!readStoredTheme() && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    root.dataset.theme = 'dark';
  }
  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    storeTheme(nextTheme);
    updateThemeLabel();
  });

  const closeMenu = () => {
    if (!menuToggle || !navList) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    navList.classList.remove('is-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    navList?.classList.toggle('is-open', !isOpen);
  });

  navList?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!navList?.classList.contains('is-open')) return;
    if (event.target.closest('.primary-nav')) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  revealItems.forEach((item) => {
    const delay = Number(item.dataset.delay || 0);
    item.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.2, 0.5] });

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (year) year.textContent = String(new Date().getFullYear());
})();
