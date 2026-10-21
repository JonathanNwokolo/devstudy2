import { Toast } from '../core/toast.js';

/**
 * Copiar código.
 *  - window.copyCode(button): usado por handlers inline (onclick="copyCode(this)") em ~150 botões.
 *    Aceita tanto `.code-example` (index/css/js…) quanto `.code-block` (git/http), cujo <code>
 *    fica ao lado do botão.
 *  - initCopyButtons(): adiciona um botão "Copiar" a todo <pre><code>.
 */

function copyCode(button) {
  const container = button.closest('.code-example, .code-block');
  const codeBlock = container && container.querySelector('code');

  if (!codeBlock) return;

  navigator.clipboard
    .writeText(codeBlock.innerText)
    .then(() => {
      const originalText = button.innerHTML;
      button.innerHTML = '✓ Copiado!';
      button.classList.add('copied');

      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('copied');
      }, 2000);
    })
    .catch((err) => {
      console.error('Erro ao copiar:', err);
      button.innerHTML = '✗ Erro';
    });
}

const COPY_ICON = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copiar</span>
        `;

const DONE_ICON = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Copiado!</span>
                `;

export function initCopyButtons() {
  window.copyCode = copyCode;

  // Blocos com rolagem horizontal precisam receber foco para uso por teclado.
  document.querySelectorAll('.code-block code, .page-study table').forEach((scrollArea) => {
    if (scrollArea.scrollWidth > scrollArea.clientWidth) scrollArea.tabIndex = 0;
  });

  document.querySelectorAll('pre code').forEach((codeBlock) => {
    const pre = codeBlock.parentElement;

    if (pre.querySelector('.copy-btn')) return;

    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = COPY_ICON;
    button.title = 'Copiar código';

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);
        button.classList.add('copied');
        button.innerHTML = DONE_ICON;
        Toast.success('Código copiado!');

        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = COPY_ICON;
        }, 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
        Toast.error('Erro ao copiar código');
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(button);
  });
}
