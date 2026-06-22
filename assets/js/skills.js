import { $, $$, createElement, debounce } from './utils.js';

/**
 * 1. YOUR SKILLS DATA
 */
const SKILLS_DATA = [
  {
    name: "HTML5 & CSS3",
    category: "frontend",
    description: "Responsive layouts, Flexbox, Grid, and modern CSS animations.",
    proficiency: 95,
    years: 3
  },
  {
    name: "JavaScript",
    category: "frontend",
    description: "Modern ES6+, DOM manipulation, and asynchronous programming.",
    proficiency: 90,
    years: 3
  },
  {
    name: "React.js",
    category: "frontend",
    description: "Component-based architecture, Hooks, and State Management.",
    proficiency: 85,
    years: 2
  },
  {
    name: "Node.js",
    category: "backend",
    description: "Server-side development and building RESTful APIs.",
    proficiency: 75,
    years: 1
  },
  {
    name: "PostgreSQL",
    category: "backend",
    description: "Relational database design and complex query optimization.",
    proficiency: 70,
    years: 1
  },
  {
    name: "Flutter",
    category: "mobile",
    description: "Cross-platform mobile app development with Dart.",
    proficiency: 80,
    years: 2
  },
  {
    name: "AWS",
    category: "cloud",
    description: "Deploying and managing scalable cloud infrastructure.",
    proficiency: 65,
    years: 1
  },
  {
    name: "Git & GitHub",
    category: "tools",
    description: "Version control, branching strategies, and collaboration.",
    proficiency: 92,
    years: 3
  },
  {
    name: "Figma",
    category: "tools",
    description: "UI/UX design, prototyping, and design systems.",
    proficiency: 85,
    years: 2
  }
];

/**
 * 2. THE LOGIC FUNCTION
 */
export function initSkills(skills) {
  const grid = $('#skills-grid');
  const tabs = $$('.skills__tab');
  const searchInput = $('#skills-search');

  if (!grid) return;

  let activeCategory = 'all';
  let searchQuery = '';

  // Helper function to animate numbers (0% to target%)
  function animateCount(element, target) {
    let start = 0;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo function for smoother finish
      const easeProgress = 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * target);

      element.textContent = `${currentCount}%`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  function filterSkills(skill) {
    const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query ||
      skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }

  function render() {
    const filtered = skills.filter(filterSkills);

    // Clear grid and prepare for stagger animation
    grid.innerHTML = '';
    grid.classList.remove('is-visible');
    grid.classList.add('reveal-stagger');

    if (filtered.length === 0) {
      grid.appendChild(createElement('div', { className: 'skills__empty reveal-fade is-visible' }, ['No skills match your criteria.']));
      return;
    }

    filtered.forEach((skill, index) => {
      const circumference = 2 * Math.PI * 30;
      const offset = circumference - (skill.proficiency / 100) * circumference;

      // Percentage Text (initially 0%)
      const countSpan = createElement('span', { className: 'skills__ring-text' }, ['0%']);

      const ring = createElement('div', { className: 'skills__ring' }, [
        createElement('svg', { className: 'skills__ring-svg', viewBox: '0 0 68 68' }, [
          createElement('circle', { className: 'skills__ring-bg', cx: '34', cy: '34', r: '30' }),
          createElement('circle', {
            className: 'skills__ring-fg',
            cx: '34', cy: '34', r: '30',
            'data-offset': offset,
            'data-target': skill.proficiency,
            style: `stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference}`,
          }),
        ]),
        countSpan
      ]);

      const tooltip = createElement('div', { className: 'skills__tooltip' }, [
        createElement('strong', {}, [skill.name]),
        document.createTextNode(` — ${skill.description}`),
        createElement('br'),
        createElement('span', { style: 'color: var(--accent)' }, [`${skill.years}+ years experience`]),
      ]);

      const cardInner = createElement('div', { className: 'skills__card-inner' }, [
        ring,
        createElement('span', { className: 'skills__name' }, [skill.name]),
      ]);

      // Add reveal classes to the card
      const card = createElement('div', {
        className: 'skills__card reveal-scale', // This links to your fadeInScale animation
        'data-category': skill.category
      }, [
        cardInner,
        tooltip,
      ]);

      // Custom Mouse Tracker Logic (Existing)
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });

      grid.appendChild(card);

      // Trigger the number counting animation
      setTimeout(() => {
        animateCount(countSpan, skill.proficiency);
      }, 400 + (index * 60)); // Delays the start to match stagger
    });

    /* Trigger visual reveal */
    requestAnimationFrame(() => {
      grid.classList.add('is-visible');
    });

    /* Animate SVG rings with stagger */
    requestAnimationFrame(() => {
      $$('.skills__ring-fg').forEach((el, i) => {
        setTimeout(() => {
          el.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
          el.style.strokeDashoffset = el.dataset.offset;
        }, 300 + i * 80);
      });
    });
  }

  /* ── Tab clicks with transition ── */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      activeCategory = tab.dataset.category;

      // Briefly hide grid to re-trigger stagger animations
      grid.style.opacity = '0';
      setTimeout(() => {
        render();
        grid.style.opacity = '1';
      }, 150);
    });
  });

  /* ── Search ── */
  const debouncedSearch = debounce((value) => {
    searchQuery = value;
    render();
  }, 300);

  searchInput?.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Intersection Observer to trigger reveal when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        render(); // Initial render when visible
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(grid);
}

/**
 * 3. START THE SECTION
 */
initSkills(SKILLS_DATA);