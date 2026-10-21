import { debounce } from '../core/dom.js';

/**
 * Busca global do cabeçalho (#searchToggle / #searchPanel / #globalSearch / #searchResults).
 *
 * Usa o índice estático `search-index.json`, gerado no build por scripts/build-search-index.js
 * (sem backend). Formato de cada entrada: { t: título, d: descrição, u: url, p: título da página }.
 * O índice é baixado somente na primeira abertura do painel.
 */

const INDEX_URL = 'search-index.json';
const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 20;

/** Minúsculas e sem acentos: "Lógica" casa com "logica". */
export function fold(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** Prepara as entradas (campos normalizados) uma única vez. */
export function prepareIndex(entries) {
  return entries.map((entry) => ({
    ...entry,
    _t: fold(entry.t),
    _d: fold(entry.d),
    _p: fold(entry.p),
  }));
}

/**
 * Pesquisa pura (testável sem DOM). Todos os termos precisam aparecer em título, descrição
 * ou nome da página. Ordena por relevância: título > descrição > página.
 */
export function searchEntries(prepared, query, limit = MAX_RESULTS) {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0 || fold(query).trim().length < MIN_QUERY_LENGTH) return [];

  const scored = [];
  for (const entry of prepared) {
    let score = 0;
    let matched = true;

    for (const term of terms) {
      if (entry._t.startsWith(term)) score += 4;
      else if (entry._t.includes(term)) score += 3;
      else if (entry._p.includes(term)) score += 1;
      else if (entry._d.includes(term)) score += 1.5;
      else {
        matched = false;
        break;
      }
    }

    if (matched) scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score || a.entry.t.localeCompare(b.entry.t, 'pt-BR'));
  return scored.slice(0, limit).map((item) => item.entry);
}

let indexPromise = null;

function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(prepareIndex)
      .catch((error) => {
        indexPromise = null; // permite nova tentativa
        throw error;
      });
  }
  return indexPromise;
}

const elements = {};

function messageNode(text) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.textContent = text; // textContent: a consulta é digitada pelo usuário
  return empty;
}

function resultNode(entry) {
  const link = document.createElement('a');
  link.className = 'search-result-item';
  link.href = entry.u;

  const icon = document.createElement('div');
  icon.className = 'search-result-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = entry.u.includes('#') ? '📘' : '📄';

  const content = document.createElement('div');
  content.className = 'search-result-content';

  const title = document.createElement('div');
  title.className = 'search-result-title';
  title.textContent = entry.t;

  const description = document.createElement('div');
  description.className = 'search-result-description';
  description.textContent = entry.d;

  content.append(title, description);
  link.append(icon, content);
  return link;
}

function render(results, query) {
  const container = elements.results;
  container.replaceChildren();

  if (results.length === 0) {
    container.append(messageNode(`Nenhum resultado encontrado para "${query}"`));
    return;
  }

  // Agrupa por página, preservando a ordem de relevância
  const groups = new Map();
  results.forEach((entry) => {
    if (!groups.has(entry.p)) groups.set(entry.p, []);
    groups.get(entry.p).push(entry);
  });

  groups.forEach((items, page) => {
    const group = document.createElement('div');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', page);

    const label = document.createElement('div');
    label.className = 'search-category';
    label.textContent = page;
    group.append(label, ...items.map(resultNode));
    container.append(group);
  });
}

async function runSearch(query) {
  const trimmed = query.trim();

  if (fold(trimmed).length < MIN_QUERY_LENGTH) {
    elements.results.replaceChildren();
    return;
  }

  try {
    const prepared = await loadIndex();
    // A consulta pode ter mudado enquanto o índice carregava
    if (elements.input.value.trim() !== trimmed) return;
    render(searchEntries(prepared, trimmed), trimmed);
  } catch {
    elements.results.replaceChildren(messageNode('Não foi possível carregar o índice de busca.'));
  }
}

export function isGlobalSearchOpen() {
  return Boolean(elements.panel && elements.panel.classList.contains('active'));
}

export function openGlobalSearch() {
  if (!elements.panel) return;
  elements.panel.classList.add('active');
  elements.toggle?.setAttribute('aria-expanded', 'true');
  loadIndex().catch(() => {}); // pré-carrega; erros são tratados ao pesquisar
  // Some browsers cannot focus descendants while the visibility transition is
  // completing. Retry once after the panel animation if it is still open.
  requestAnimationFrame(() => elements.input?.focus());
  setTimeout(() => {
    if (isGlobalSearchOpen() && document.activeElement !== elements.input) elements.input?.focus();
  }, 350);
}

export function closeGlobalSearch({ restoreFocus = false } = {}) {
  if (!elements.panel) return;
  const wasOpen = isGlobalSearchOpen();
  elements.panel.classList.remove('active');
  elements.toggle?.setAttribute('aria-expanded', 'false');
  if (wasOpen && restoreFocus) elements.toggle?.focus();
}

export function initGlobalSearch() {
  elements.toggle = document.getElementById('searchToggle');
  elements.panel = document.getElementById('searchPanel');
  elements.close = document.getElementById('searchClose');
  elements.input = document.getElementById('globalSearch');
  elements.results = document.getElementById('searchResults');

  if (!elements.panel || !elements.input || !elements.results) return;

  elements.toggle?.setAttribute('aria-expanded', 'false');
  elements.toggle?.setAttribute('aria-controls', 'searchPanel');
  elements.results.setAttribute('aria-live', 'polite');

  elements.toggle?.addEventListener('click', () => {
    if (isGlobalSearchOpen()) closeGlobalSearch();
    else openGlobalSearch();
  });

  elements.close?.addEventListener('click', () => {
    closeGlobalSearch({ restoreFocus: true });
    elements.input.value = '';
    elements.results.replaceChildren();
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (event) => {
    if (!isGlobalSearchOpen()) return;
    if (elements.panel.contains(event.target) || elements.toggle?.contains(event.target)) return;
    closeGlobalSearch();
  });

  elements.input.addEventListener('input', debounce(() => runSearch(elements.input.value), 200));

  // Navegação por setas entre campo e resultados; Enter segue o link focado.
  elements.panel.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const focusables = [elements.input, ...elements.results.querySelectorAll('a.search-result-item')];
    const index = focusables.indexOf(document.activeElement);
    if (index === -1) return;

    event.preventDefault();
    const next = event.key === 'ArrowDown' ? index + 1 : index - 1;
    focusables[Math.max(0, Math.min(focusables.length - 1, next))].focus();
  });

  // Escolher um resultado fecha o painel (a navegação segue o href)
  elements.results.addEventListener('click', (event) => {
    if (event.target.closest('a.search-result-item')) closeGlobalSearch();
  });
}
