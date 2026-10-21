/** Comportamentos do cabeçalho e da rolagem: sombra ao rolar e rolagem suave. */

export function initHeader() {
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.pageYOffset > 50);
    });
  }
}

const HEADER_OFFSET = 80;

/** Âncoras internas (#id) rolam suavemente, descontando a altura do cabeçalho fixo. */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = anchor.getAttribute('href');
      if (hash.length < 2) return; // href="#": só impede o salto ao topo

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
