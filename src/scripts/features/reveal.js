/**
 * Animações ao rolar (um único observador por efeito):
 *  - cards entram com fade/slide (classes .animate-in e .reveal; CSS em advanced-navigation.css/animations.css);
 *  - números de estatísticas contam de 0 até o valor.
 */

const CARD_SELECTOR = '.topic-card, .info-card, .ref-card';

export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('animate-in', 'reveal');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
  );

  document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
    // Cards must remain readable before they enter the viewport, including
    // full-page captures and assistive technology scans.
    observer.observe(card);
  });
}

export function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number, .mini-stat-number');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const value = target.textContent;

        // Só anima números
        if (!isNaN(parseInt(value))) {
          animateValue(target, 0, parseInt(value), 2000);
        }

        observer.unobserve(target);
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((stat) => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
  const suffix = element.textContent.includes('+') ? '+' : '';
  const increment = (end - start) / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = end + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}
