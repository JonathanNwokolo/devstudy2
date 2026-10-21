/** Progressive motion: all content remains visible when GSAP is unavailable. */
export function initPlaygroundMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !window.gsap) return;

  const gsap = window.gsap;
  const hero = document.querySelector('.page-home .hero');
  if (hero) {
    gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
      .from(hero.querySelector('.hero-badge'), { y: 16, autoAlpha: 0 })
      .from(hero.querySelector('.hero-title'), { y: 28, autoAlpha: 0 }, '-=0.55')
      .from(hero.querySelector('.hero-description'), { y: 22, autoAlpha: 0 }, '-=0.55')
      .from(hero.querySelector('.hero-buttons'), { y: 18, autoAlpha: 0 }, '-=0.55')
      .from(hero.querySelector('.hero-visual'), { y: 32, rotate: -3, autoAlpha: 0 }, '-=0.7');
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    document.querySelectorAll('.page-home .section-header, .page-home .section-hero').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: 'top 92%', once: true },
        y: 24, duration: 0.65, ease: 'power2.out',
      });
    });
  }

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.page-home .topic-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotateX: -y * 4, rotateY: x * 4, y: -5, duration: 0.3, overwrite: true });
    });
    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.4, overwrite: true });
    });
  });
}
