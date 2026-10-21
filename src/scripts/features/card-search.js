import { Toast } from '../core/toast.js';
import { debounce } from '../core/dom.js';

/**
 * Busca local que filtra cards da própria página (cheatsheets, erros-comuns, topicos):
 * #searchInput + (opcional) #searchBtn. Não confundir com a busca global do cabeçalho
 * (features/global-search.js, #globalSearch).
 */

export const CARD_SELECTOR = '.cheat-card, .erro-card, .topic-card';

export function getLocalSearchInput() {
  const input = document.getElementById('searchInput');
  return input && document.querySelector(CARD_SELECTOR) ? input : null;
}

export function initCardSearch() {
  const searchInput = getLocalSearchInput();
  if (!searchInput) return;

  const searchBtn = document.getElementById('searchBtn');
  const searchableCards = document.querySelectorAll(CARD_SELECTOR);

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    if (!query) {
      // Mostra todos se a busca está vazia
      searchableCards.forEach((card) => {
        card.style.display = '';
        card.classList.remove('search-highlight');
      });
      return;
    }

    searchableCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const title = card.querySelector('h3, .cheat-card-title, .erro-title');
      const titleText = title ? title.textContent.toLowerCase() : '';

      if (text.includes(query) || titleText.includes(query)) {
        card.style.display = '';
        card.classList.add('search-highlight');
        visibleCount++;

        // Destaque no título (DOM, sem innerHTML; a consulta não é interpretada como regex)
        if (title && titleText.includes(query)) {
          const original = title.textContent;
          const start = titleText.indexOf(query);
          const mark = document.createElement('mark');
          mark.textContent = original.slice(start, start + query.length);
          title.textContent = '';
          title.append(original.slice(0, start), mark, original.slice(start + query.length));
        }
      } else {
        card.style.display = 'none';
        card.classList.remove('search-highlight');
      }
    });

    if (visibleCount === 0) {
      Toast.warning(`Nenhum resultado para "${query}"`);
    } else {
      Toast.success(`${visibleCount} resultado${visibleCount > 1 ? 's' : ''} encontrado${visibleCount > 1 ? 's' : ''}`);
    }
  }

  searchInput.addEventListener('input', debounce(performSearch, 300));
  if (searchBtn) searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // Botão de limpar busca
  const clearSearchBtn = document.createElement('button');
  clearSearchBtn.className = 'clear-search-btn';
  clearSearchBtn.textContent = '×';
  clearSearchBtn.title = 'Limpar busca';
  clearSearchBtn.style.display = 'none';
  searchInput.parentElement.appendChild(clearSearchBtn);

  searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'flex' : 'none';
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    performSearch();
  });
}
