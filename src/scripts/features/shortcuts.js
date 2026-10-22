
/**
 * Atalhos de teclado — único listener `keydown` do site.
 *
 *   t           tema        b  favoritos        ?  ajuda de atalhos
 *   Esc         fecha ajuda/favoritos
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

    if (event.key === 'Escape') {
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
