import { $, $$ } from './utils.js';

export function initNavigation() {
  const header = $('.header');
  const menuBtn = $('#menu-btn');
  const nav = $('.header__nav');
  const navLinks = $$('.header__nav-link');
  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));

  let lastScroll = 0;
  let scrollThreshold = 0;

  function onScroll() {
    const y = window.scrollY;
    const isScrolled = y > 16;
    header.classList.toggle('is-scrolled', isScrolled);

    if (y > 100 && y > lastScroll + 5) {
      header.classList.add('is-hidden');
    } else if (y < lastScroll - 5 || y < 100) {
      header.classList.remove('is-hidden');
    }

    updateActiveLink();
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  menuBtn?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-active');
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ── Close on link click ── */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Close on Escape ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── Scroll spy ── */
  const sections = $$('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + headerHeight + 100;
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── Smooth scroll fallback ── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.offsetTop - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
