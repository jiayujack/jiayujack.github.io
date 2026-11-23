(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = [...document.querySelectorAll('.nav-list a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preferredTheme = null;
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') preferredTheme = stored;
  } catch (_) { /* Theme switching also works without browser storage. */ }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    themeToggle?.setAttribute('aria-label', `Switch to ${next} theme`);
    themeToggle?.setAttribute('title', `Switch to ${next} theme`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101a23' : '#ffffff');
  }
  applyTheme(preferredTheme || (systemTheme.matches ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    preferredTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(preferredTheme);
    try { localStorage.setItem('theme', preferredTheme); } catch (_) { /* Storage is optional. */ }
  });
  systemTheme.addEventListener?.('change', event => {
    if (!preferredTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  function closeMenu(returnFocus = false) {
    if (!menuToggle || !navList) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    navList.classList.remove('is-open');
    if (returnFocus) menuToggle.focus();
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    navList?.classList.toggle('is-open', open);
  });
  navList?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (navList?.classList.contains('is-open') && !event.target.closest('.primary-nav')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navList?.classList.contains('is-open')) closeMenu(true);
  });
  window.matchMedia('(min-width: 601px)').addEventListener?.('change', event => {
    if (event.matches) closeMenu();
  });

  // Keep one navigation item current, including when several short sections share the viewport.
  let ticking = false;
  function updateNavigation() {
    const position = window.scrollY + 150;
    const active = [...sections].reverse().find(section => section.offsetTop <= position) || sections[0];
    navLinks.forEach(link => {
      const current = active && link.hash === `#${active.id}`;
      link.classList.toggle('active', Boolean(current));
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  }
  updateNavigation();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);

  const status = document.querySelector('#copy-status');
  document.querySelectorAll('.copy-citation').forEach(button => {
    let resetTimer;
    button.addEventListener('click', async () => {
      const code = button.closest('.citation-content')?.querySelector('code');
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = 'Copied';
        if (status) status.textContent = 'BibTeX citation copied to clipboard.';
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Selected';
        if (status) status.textContent = 'Citation selected. Press Control+C or Command+C to copy.';
      }
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { button.textContent = 'Copy'; }, 2500);
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
