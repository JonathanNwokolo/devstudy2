import { readString, writeString } from '../core/storage.js';

/** Tema claro/escuro: aplica o tema salvo e liga o botão #themeToggle (uma única vez). */
export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = readString('theme', 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    writeString('theme', newTheme);

    // Animação do botão
    themeToggle.classList.add('rotating');
    setTimeout(() => themeToggle.classList.remove('rotating'), 300);
  });
}
