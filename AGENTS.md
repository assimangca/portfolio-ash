# solid-project-portfolio — conventions

## Project structure

```
index.html              — Single-page entry point
assets/
  css/
    variables.css       — Design tokens (colors, fonts, spacing)
    reset.css           — CSS reset / normalize
    layout.css          — Grid, container, overall page layout
    components.css      — Reusable component styles (buttons, cards, modal)
    sections.css        — Per-section styles (hero, skills, projects, about, contact)
    animations.css      — Keyframes, transitions, scroll-based animations
  js/
    main.js             — Entry module; imports and initializes all modules
    config.js           — Data (skills, projects, about, contact info)
    navigation.js       — Mobile menu, scroll spy, header interactions
    skills.js           — Skills grid rendering, filtering, search
    projects.js         — Projects grid rendering, modal
    scroll-animations.js— Intersection Observer-based reveal animations
    utils.js            — Shared helpers (debounce, DOM utils)
  images/
    favicon.svg
    placeholder-project.svg
```

## Dev server

```bash
npx serve .
```

## Code style

- **CSS**: BEM naming (`block__element--modifier`), custom properties for theming
- **JS**: ES modules, `export const` / `import`, no frameworks
- **HTML**: Semantic elements, ARIA attributes, progressive enhancement
- **No build step** — this is a vanilla static site

## When asked to add content

Edit `assets/js/config.js` to add/update skills, projects, or about data.
