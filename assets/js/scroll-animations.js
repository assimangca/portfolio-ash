export function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale, .reveal-stagger, .reveal-left, .reveal-right, .reveal-bounce')
    .forEach(el => observer.observe(el));
}
