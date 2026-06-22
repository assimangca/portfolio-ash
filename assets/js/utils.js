export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function $ (selector, context = document) {
  return context.querySelector(selector);
}

export function $$ (selector, context = document) {
  return [...context.querySelectorAll(selector)];
}

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      el.className = value;
    } else if (key.startsWith('data-')) {
      el.dataset[key.slice(5)] = value;
    } else if (key === 'innerHTML') {
      el.innerHTML = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }
  return el;
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function focusTrap(container) {
  const focusable = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const firstFocusable = container.querySelectorAll(focusable)[0];
  const lastFocusable = container.querySelectorAll(focusable)[container.querySelectorAll(focusable).length - 1];

  function handler(e) {
    if (e.key !== 'Tab') return;
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (active === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  return {
    activate() {
      container.addEventListener('keydown', handler);
      firstFocusable?.focus();
    },
    deactivate() {
      container.removeEventListener('keydown', handler);
    },
  };
}
