/**
 * Ponto de entrada único do DevStudy (carregado como módulo em todas as páginas).
 *
 * Cada recurso vive em um módulo próprio (features/*) e é inicializado AQUI, uma única vez.
 * Os recursos verificam se os elementos existem; em páginas sem eles, simplesmente não fazem nada.
 * Scripts específicos de uma página ficam em pages/*.js e são listados no front matter da página.
 */
import { onReady } from './core/dom.js';
import './core/toast.js'; // expõe window.Toast
import { initTheme } from './features/theme.js';
import { initHeader, initSmoothScroll } from './features/header.js';
import { initMobileMenu, initDropdowns, initMegaMenu } from './features/mobile-menu.js';
import { initScrollSpy } from './features/scrollspy.js';
import { initStickyBreadcrumbs, initPageBreadcrumbs } from './features/breadcrumbs.js';
import { initBookmarks } from './features/bookmarks.js';
import { initShortcuts } from './features/shortcuts.js';
import { initCopyButtons } from './features/copy-code.js';
import { initColorPicker } from './features/color-picker.js';
import { initFlexPlayground } from './features/flex-playground.js';
import { initLiveEditor } from './features/live-editor.js';
import { initEditorAutocomplete } from './features/editor-autocomplete.js';
import { initReveal, initStatCounters } from './features/reveal.js';
import { initProgressTracker } from './features/progress-tracker.js';
import { initHighlight } from './features/highlight.js';
import { initPlaygroundMotion } from './features/playground-motion.js';
import { initStudyNavigation } from './features/study-navigation.js';

function init() {
  // Aparência e navegação
  initTheme();
  initHeader();
  initSmoothScroll();
  initMobileMenu();
  initDropdowns();
  initMegaMenu();

  // Estrutura da página
  initScrollSpy();
  initStickyBreadcrumbs();
  initPageBreadcrumbs();
  initBookmarks();

  // Atalhos
  initShortcuts();

  // Conteúdo interativo
  initCopyButtons();
  initColorPicker();
  initFlexPlayground();
  initLiveEditor();
  initEditorAutocomplete();
  initProgressTracker();
  initReveal();
  initStatCounters();
  initHighlight();
  initPlaygroundMotion();
  initStudyNavigation();
}

onReady(init);

console.log('%c🚀 DevStudy', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cBem-vindo ao código fonte!', 'font-size: 14px; color: #764ba2;');
console.log('%cDica: Inspecione os elementos para aprender mais sobre HTML e CSS!', 'font-size: 12px; color: #666;');
