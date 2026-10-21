import { readJSON, writeJSON } from '../core/storage.js';

/**
 * Favoritos (localStorage "devstudy_bookmarks"): botões nas seções, painel (#bookmarksPanel)
 * e contador no cabeçalho. Dados do storage não são confiáveis: tudo é montado com DOM/textContent.
 */

const STORAGE_KEY = 'devstudy_bookmarks';

const loaded = readJSON(STORAGE_KEY, []);
let bookmarks = Array.isArray(loaded) ? loaded : [];

function save() {
  writeJSON(STORAGE_KEY, bookmarks);
}

export function initBookmarks() {
  const bookmarkToggle = document.getElementById('bookmarkToggle');
  const bookmarksPanel = document.getElementById('bookmarksPanel');
  const panelClose = document.getElementById('panelClose');
  const panelOverlay = document.getElementById('panelOverlay');

  if (bookmarkToggle && bookmarksPanel) {
    bookmarkToggle.addEventListener('click', () => {
      bookmarksPanel.classList.add('active');
      renderBookmarks();
    });
  }

  if (bookmarksPanel) {
    [panelClose, panelOverlay].forEach((el) => {
      el?.addEventListener('click', () => bookmarksPanel.classList.remove('active'));
    });
  }

  addBookmarkButtons();
  updateBookmarkCount();
}

function addBookmarkButtons() {
  document.querySelectorAll('section[id] .section-header, .topic-card h3').forEach((header) => {
    if (header.querySelector('.bookmark-btn')) return;

    const section = header.closest('section[id]') || header.closest('.topic-card');
    const sectionId = section?.id || header.textContent.trim().replace(/\s+/g, '-').toLowerCase();

    const btn = document.createElement('button');
    btn.className = 'bookmark-btn';
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 2h10a1 1 0 0 1 1 1v14l-6-4-6 4V3a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="2" fill="${isBookmarked(sectionId) ? 'currentColor' : 'none'}"/>
      </svg>
    `;
    btn.title = 'Adicionar aos favoritos';
    btn.style.cssText =
      'position:absolute;right:1rem;top:1rem;background:rgba(255,255,255,0.9);border:none;width:32px;height:32px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#667eea;transition:all 0.2s;';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleBookmark(sectionId, header.textContent);
      btn.querySelector('path').setAttribute('fill', isBookmarked(sectionId) ? 'currentColor' : 'none');
    });

    header.style.position = 'relative';
    header.appendChild(btn);
  });
}

function isBookmarked(id) {
  return bookmarks.some((b) => b.id === id);
}

function refresh() {
  save();
  updateBookmarkCount();
  renderBookmarks();
}

function toggleBookmark(id, title) {
  const existingIndex = bookmarks.findIndex((b) => b.id === id);

  if (existingIndex > -1) {
    bookmarks.splice(existingIndex, 1);
  } else {
    bookmarks.push({
      id,
      title,
      timestamp: new Date().toISOString(),
      url: window.location.pathname + '#' + id,
    });
  }

  refresh();
}

export function removeBookmark(id) {
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index === -1) return;

  bookmarks.splice(index, 1);
  refresh();

  // Atualiza o botão na página
  const btn = document.querySelector(`[data-section="${CSS.escape(id)}"] .bookmark-btn path`);
  if (btn) btn.setAttribute('fill', 'none');
}

function updateBookmarkCount() {
  const count = document.getElementById('bookmarkCount');
  if (count) {
    count.textContent = bookmarks.length;
    count.classList.toggle('has-items', bookmarks.length > 0);
  }
}

function renderBookmarks() {
  const container = document.getElementById('panelBookmarksList');
  if (!container) return;

  if (bookmarks.length === 0) {
    container.innerHTML = '<div class="empty-state">Nenhum favorito adicionado ainda.</div>';
    return;
  }

  container.innerHTML = '';

  bookmarks.forEach((bookmark) => {
    const item = document.createElement('div');
    item.className = 'bookmark-item';
    item.dataset.id = bookmark.id;

    const header = document.createElement('div');
    header.className = 'bookmark-item-header';

    const title = document.createElement('div');
    title.className = 'bookmark-item-title';
    title.textContent = bookmark.title;

    const remove = document.createElement('button');
    remove.className = 'bookmark-item-remove';
    remove.setAttribute('aria-label', 'Remover favorito');
    remove.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>`;
    remove.addEventListener('click', (e) => {
      e.stopPropagation();
      removeBookmark(bookmark.id);
    });

    header.append(title, remove);

    const meta = document.createElement('div');
    meta.className = 'bookmark-item-meta';
    meta.textContent = `Adicionado em ${new Date(bookmark.timestamp).toLocaleDateString('pt-BR')}`;

    item.append(header, meta);

    item.addEventListener('click', () => {
      window.location.hash = bookmark.id;
      document.getElementById('bookmarksPanel')?.classList.remove('active');
    });

    container.appendChild(item);
  });
}
