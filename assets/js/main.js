import { CONFIG } from './config.js';
import { initNavigation } from './navigation.js';
import { initSkills } from './skills.js';
import { initProjects} from './projects.js';
import { initScrollAnimations } from './scroll-animations.js';
import { $, $$, lerp } from './utils.js';

function initTypewriter() {
  const el = $('.hero__subtitle');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  el.style.visibility = 'visible';

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  let charIndex = 0;
  function type() {
    if (charIndex < text.length) {
      const char = text[charIndex];
      if (charIndex === 0) {
        el.textContent = '';
      }
      el.textContent += char;
      el.appendChild(cursor);
      charIndex++;
      setTimeout(type, 18 + Math.random() * 22);
    }
  }

  setTimeout(type, 800);
}

function initParallax() {
  const grid = $('.hero__grid');
  if (!grid) return;

  let currentY = 0;
  let targetY = 0;

  function update() {
    targetY = window.scrollY * 0.15;
    currentY = lerp(currentY, targetY, 0.08);
    grid.style.transform = `translateY(${currentY}px)`;
    if (Math.abs(currentY - targetY) > 0.1) {
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY * 0.15 - currentY) > 0.1) {
      requestAnimationFrame(update);
    }
  }, { passive: true });
}

function initCardGlow() {
  $$('.skills__card, .about__value-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

function initCounterAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ringText = entry.target.querySelector('.skills__ring-text');
        if (ringText && ringText.dataset.counted !== 'true') {
          const target = parseInt(ringText.textContent);
          ringText.dataset.counted = 'true';
          animateCounter(ringText, target);
        }
      }
    });
  }, { threshold: 0.3 });

  $$('.skills__card').forEach(card => observer.observe(card));
}

function animateCounter(el, target) {
  let current = 0;
  const step = Math.ceil(target / 30);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current + '%';
  }, 40);
}

function initProgressBar() {
  const bar = $('#progress-bar');
  if (!bar) return;
  const fill = bar;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    fill.style.setProperty('--progress', progress);
  }, { passive: true });
}

function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSectionTitleReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section__title').forEach(el => observer.observe(el));
}

function initRippleEffect() {
  $$('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

function initHeroBackground() {
  const hero = $('#hero');
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const auroraOrbs = hero.querySelectorAll('.hero__aurora-orb');
  const particlesContainer = hero.querySelector('.hero__particles');
  const canvas = hero.querySelector('.hero__canvas');

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  const heroRect = hero.getBoundingClientRect();
  const centerX = heroRect.width / 2;
  const centerY = heroRect.height / 2;

  function updateMousePosition(e) {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function animateAuroraOrbs() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    auroraOrbs.forEach((orb, index) => {
      const offsetX = (currentX - centerX) * (0.15 + index * 0.08);
      const offsetY = (currentY - centerY) * (0.15 + index * 0.08);
      const orbX = centerX + offsetX;
      const orbY = centerY + offsetY;

      orb.style.transform = 'translate(' + (orbX - orb.offsetWidth / 2) + 'px, ' + (orbY - orb.offsetHeight / 2) + 'px)';
      orb.style.opacity = '0.4';
    });

    requestAnimationFrame(animateAuroraOrbs);
  }

  function createParticles() {
    if (!particlesContainer) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }
  }

  function createParticle() {
    if (!particlesContainer) return;

    const particle = document.createElement('div');
    particle.className = 'hero__particle';

    const startX = Math.random() * heroRect.width;
    const startY = heroRect.height + Math.random() * 100;
    const tx = (Math.random() - 0.5) * 200;
    const duration = 8000 + Math.random() * 7000;
    const delay = Math.random() * 2000;
    const size = 1 + Math.random() * 2;

    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.animation = 'particleFloat ' + duration + 'ms linear infinite';
    particle.style.animationDelay = delay + 'ms';
    particle.style.opacity = '0';

    particlesContainer.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
      createParticle();
    });
  }

  function initCanvas() {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    class CanvasParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.hue = Math.random() > 0.5 ? 150 : 200;
      }

      update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.02;
          this.vx -= dx / dist * force;
          this.vy -= dy / dist * force;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + this.hue + ', 80%, 60%, ' + this.opacity + ')';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(80, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(new CanvasParticle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'hsla(150, 80%, 60%, ' + (0.05 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    hero.addEventListener('mousemove', updateMousePosition);

    resize();
    initParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      hero.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('resize', resize);
    };
  }

  hero.addEventListener('mousemove', updateMousePosition);
  animateAuroraOrbs();
  createParticles();
  initCanvas();
}

function initTheme() {
  const toggleBtn = $('#theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Quick micro-scale feedback
    toggleBtn.style.transform = 'scale(0.85)';
    setTimeout(() => {
      toggleBtn.style.transform = '';
    }, 150);
  });
}

function init() {
  initTheme();
  initNavigation();
  initSkills(CONFIG.skills);
  initProjects(CONFIG.projects);
  initScrollAnimations();
  initTypewriter();
  initParallax();
  initHeroBackground();
  initCardGlow();
  initProgressBar();
  initBackToTop();
  initSectionTitleReveal();
  initRippleEffect();

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = $('#contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = $('.contact__submit', form);
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    submitBtn.innerHTML = 'Sending...';

    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.classList.add('is-success');
      submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Message Sent!';
      form.reset();
      setTimeout(() => {
        submitBtn.classList.remove('is-success');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }, 1200);
  });

  const inputs = form?.querySelectorAll('.contact__input, .contact__textarea');
  inputs?.forEach(input => {
    input.addEventListener('blur', () => {
      const error = input.parentElement.querySelector('.contact__error');
      if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('is-error');
        if (error) error.textContent = 'This field is required';
      } else if (input.type === 'email' && input.value && !input.value.includes('@')) {
        input.classList.add('is-error');
        if (error) error.textContent = 'Please enter a valid email';
      } else {
        input.classList.remove('is-error');
        if (error) error.textContent = '';
      }
    });
  });

  document.querySelectorAll('.section__header').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.about__bio').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.about__value-card').forEach(el => el.classList.add('reveal-scale'));
  document.querySelectorAll('.project-card').forEach(el => el.classList.add('reveal-scale'));
  document.querySelector('.contact__form')?.classList.add('reveal');
  document.querySelector('.contact__info')?.classList.add('reveal');

  setTimeout(initScrollAnimations, 100);
  setTimeout(initCounterAnimation, 1500);
}

document.addEventListener('DOMContentLoaded', init);
