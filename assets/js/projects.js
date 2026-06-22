import { $, $$, createElement, focusTrap } from './utils.js';

/**
 * 1. YOUR PROJECTS DATA
 */
const PROJECTS_DATA = [
  {
    title: "Eco-Track Dashboard",
    category: "Web Application",
    description: "A real-time environmental monitoring dashboard that visualizes carbon footprint data through interactive charts.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=60",
    tech: ["React", "D3.js", "Firebase"],
    links: {
      github: "https://github.com",
      live: "https://example.com"
    }
  },
  {
    title: "Neuro-Pulse AI",
    category: "Machine Learning",
    description: "An AI-powered interface that translates text descriptions into unique neural-style artwork.",
    image: "https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=800&q=60",
    tech: ["Python", "TensorFlow", "React"],
    links: {
      github: "https://github.com",
      live: "https://example.com"
    }
  },
  {
    title: "Velocity Wallet",
    category: "Fintech",
    description: "A secure cryptocurrency wallet with biometric authentication and multi-chain support.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=60",
    tech: ["Flutter", "Web3.js", "Node.js"],
    links: {
      github: "https://github.com",
      live: "https://example.com"
    }
  }
];

/**
 * 2. THE COMPLETE LOGIC
 */
export function initProjects(projects) {
  const grid = $('#projects-grid');
  const modal = $('#project-modal');
  const modalBackdrop = $('.project-modal__backdrop');
  const modalClose = $('.project-modal__close');
  const modalImage = $('#modal-image');
  const modalTitle = $('#modal-title');
  const modalCategory = $('#modal-category');
  const modalDescription = $('#modal-description');
  const modalTags = $('#modal-tags');
  const modalLinks = $('#modal-links');

  if (!grid) return;

  let trap = null;

  /* ── Render cards ── */
  function render() {
    grid.innerHTML = '';

    projects.forEach((project, index) => {
      const tags = project.tech.map(t =>
        createElement('span', { className: 'project-card__tag' }, [t])
      );

      const cardInner = createElement('div', { className: 'project-card-inner' }, [
        createElement('div', { className: 'project-card__image' }, [
          createElement('img', {
            src: project.image,
            alt: `${project.title} screenshot`,
            loading: 'lazy',
          }),
        ]),
        createElement('div', { className: 'project-card__body' }, [
          createElement('span', { className: 'project-card__category' }, [project.category]),
          createElement('h3', { className: 'project-card__title' }, [project.title]),
          createElement('p', { className: 'project-card__desc' }, [project.description]),
          createElement('div', { className: 'project-card__tags' }, tags),
        ]),
      ]);

      const card = createElement('div', {
        className: 'project-card reveal-scale is-visible',
        style: `transition-delay: ${index * 80}ms; opacity: 1; transform: scale(1); visibility: visible;`,
        tabindex: '0',
        role: 'button',
        'aria-label': `View details for ${project.title}`,
      }, [cardInner]);

      card.addEventListener('click', () => openModal(index));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(index);
        }
      });

      grid.appendChild(card);
    });
  }

  /* ── Modal Logic ── */
  function openModal(index) {
    const currentProject = projects[index];
    if (!currentProject || !modal) return;

    if (modalImage) modalImage.src = currentProject.image;
    if (modalTitle) modalTitle.textContent = currentProject.title;
    if (modalCategory) modalCategory.textContent = currentProject.category;
    if (modalDescription) modalDescription.textContent = currentProject.description;

    if (modalTags) {
      modalTags.innerHTML = '';
      currentProject.tech.forEach(t => {
        modalTags.appendChild(createElement('span', { className: 'project-card__tag' }, [t]));
      });
    }

    if (modalLinks) {
      modalLinks.innerHTML = '';
      if (currentProject.links.github) {
        modalLinks.appendChild(createElement('a', {
          href: currentProject.links.github,
          className: 'btn btn--sm btn--ghost',
          target: '_blank',
        }, ['View Source']));
      }
      if (currentProject.links.live) {
        modalLinks.appendChild(createElement('a', {
          href: currentProject.links.live,
          className: 'btn btn--sm btn--primary',
          target: '_blank',
        }, ['Live Demo']));
      }
    }

    modal.removeAttribute('hidden');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (focusTrap) {
      trap = focusTrap(modal);
      requestAnimationFrame(() => trap.activate());
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.setAttribute('hidden', '');
      if (trap) { trap.deactivate(); trap = null; }
    }, 300);
  }

  modalBackdrop?.addEventListener('click', closeModal);
  modalClose?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  render();
}

// 3. EXECUTE
initProjects(PROJECTS_DATA);