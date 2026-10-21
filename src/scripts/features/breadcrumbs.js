import { state } from '../core/state.js';

/**
 * Breadcrumbs.
 *  - initStickyBreadcrumbs: barra fixa da home (#breadcrumbsContainer), exibida após rolar 200px.
 *  - initPageBreadcrumbs: trilha "Início › Página" inserida nas páginas internas.
 */

export function initStickyBreadcrumbs() {
  const container = document.getElementById('breadcrumbsContainer');
  const breadcrumbs = document.getElementById('breadcrumbs');
  if (!container || !breadcrumbs) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      container.classList.add('visible');
      renderStickyBreadcrumbs(breadcrumbs);
    } else {
      container.classList.remove('visible');
    }
  });
}

function renderStickyBreadcrumbs(breadcrumbs) {
  const currentSection = state.currentSection || 'home';
  const sectionElement = document.getElementById(currentSection);
  const sectionTitle = sectionElement?.querySelector('h1, h2')?.textContent || 'Início';

  breadcrumbs.innerHTML = '';

  const homeItem = document.createElement('li');
  homeItem.className = 'breadcrumb-item';
  const homeLink = document.createElement('a');
  homeLink.href = '#home';
  homeLink.textContent = 'Início';
  homeItem.appendChild(homeLink);
  breadcrumbs.appendChild(homeItem);

  if (currentSection !== 'home') {
    const sectionItem = document.createElement('li');
    sectionItem.className = 'breadcrumb-item';
    sectionItem.textContent = sectionTitle;
    breadcrumbs.appendChild(sectionItem);
  }
}

export function initPageBreadcrumbs() {
  const main = document.querySelector('main, .container');
  if (!main || document.querySelector('.breadcrumbs')) return;

  const path = window.location.pathname;
  // Não adiciona breadcrumbs na home
  if (path === '/' || path.endsWith('index.html')) return;

  const pageName = document.title.split('-')[0].trim();

  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');

  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.textContent = 'Início';

  const separator = document.createElement('span');
  separator.className = 'breadcrumb-separator';
  separator.textContent = '›';

  const current = document.createElement('span');
  current.className = 'breadcrumb-current';
  current.textContent = pageName;

  breadcrumbs.append(homeLink, separator, current);

  // Insere depois do primeiro hero ou no início do conteúdo
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.parentNode.insertBefore(breadcrumbs, hero.nextSibling);
  } else if (main.firstChild) {
    main.insertBefore(breadcrumbs, main.firstChild);
  }
}
