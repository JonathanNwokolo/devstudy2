import { Toast } from '../core/toast.js';
import { getLocalSearchInput } from './card-search.js';
import { closeGlobalSearch, isGlobalSearchOpen, openGlobalSearch } from './global-search.js';

/**
 * Atalhos de teclado — único listener `keydown` do site.
 *
 *   Ctrl/Cmd+K  busca (na página com busca local de cards — cheatsheets, erros, tópicos — foca
 *               esse campo, como a própria página anuncia; nas demais abre a busca global)
 *   t           tema        b  favoritos        ?  ajuda de atalhos
 *   Esc         fecha busca/ajuda/favoritos; limpa a busca local
 *
 * As teclas simples são ignoradas ao digitar em campos e com Ctrl/Alt/Cmd pressionados.
 */

const SINGLE_KEY_ACTIONS = {
  t: () => document.getElementById('themeToggle')?.click(),
  b: () => document.getElementById('bookmarkToggle')?.click(),
  '?': () => document.getElementById('shortcutsHelp')?.classList.toggle('active'),
};

function closePanels() {
  document.getElementById('shortcutsHelp')?.classList.remove('active');
  document.getElementById('bookmarksPanel')?.classList.remove('active');
  if (isGlobalSearchOpen()) closeGlobalSearch({ restoreFocus: true });
}

function isTypingTarget(target) {
  return target instanceof Element && target.matches('input, textarea, select, [contenteditable="true"]');
}

export function initShortcuts() {
  const helpClose = document.querySelector('#shortcutsHelp .shortcuts-close');
  const helpOverlay = document.querySelector('#shortcutsHelp .shortcuts-overlay');
  [helpClose, helpOverlay].forEach((el) => {
    el?.addEventListener('click', () => document.getElementById('shortcutsHelp')?.classList.remove('active'));
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && key === 'k') {
      event.preventDefault();
      const localSearch = getLocalSearchInput();
      if (localSearch) {
        localSearch.focus();
        Toast.info('Digite para buscar');
      } else {
        openGlobalSearch();
      }
      return;
    }

    if (event.key === 'Escape') {
      const localSearch = getLocalSearchInput();
      if (localSearch && localSearch.value) {
        localSearch.value = '';
        localSearch.dispatchEvent(new Event('input'));
      }
      closePanels();
      if (isTypingTarget(event.target)) event.target.blur();
      return;
    }

    if (isTypingTarget(event.target)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const action = SINGLE_KEY_ACTIONS[key];
    if (action) {
      event.preventDefault();
      action();
    }
  });
}
