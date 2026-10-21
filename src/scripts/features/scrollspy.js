import { state } from '../core/state.js';

/** Scrollspy (index.html): destaca no menu principal a seção visível (único responsável por esse destaque). */

export function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        state.currentSection = id;

        updateNavActiveState(id);
      });
    },
    { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}

function updateNavActiveState(sectionId) {
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));
  document.querySelector(`.nav-link[href="#${CSS.escape(sectionId)}"]`)?.classList.add('active');
}
