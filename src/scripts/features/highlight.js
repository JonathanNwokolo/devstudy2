/**
 * Realce de sintaxe (Prism, carregado por CDN em components/prism.njk).
 * Só destaca blocos "limpos": blocos com spans de comentário próprios já têm marcação manual.
 * Se o CDN estiver indisponível (offline), o código simplesmente permanece sem cores.
 */
export function initHighlight() {
  if (!window.Prism || typeof window.Prism.highlightElement !== 'function') return;

  document.querySelectorAll('code[class*="language-"]').forEach((el) => {
    if (!el.querySelector('.comment, .js-comment')) {
      window.Prism.highlightElement(el);
    }
  });
}
