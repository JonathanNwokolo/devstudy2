/** Utilitários DOM mínimos compartilhados pelos módulos. */

/** Executa `fn` quando o DOM estiver pronto (imediatamente se já estiver). */
export function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}
