// Recreate the pre-audit visual snapshot from the current build without touching
// the working tree. The initial screenshots were captured before edits, but
// Playwright's test run clears test-results/, so this rebuild keeps them deliverable.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const root = path.join(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'devstudy-visual-before-'));
fs.cpSync(path.join(root, '_site'), output, { recursive: true });

function edit(file, fn) {
  const target = path.join(output, file);
  fs.writeFileSync(target, fn(fs.readFileSync(target, 'utf8')));
}
function replace(source, oldText, newText) {
  if (!source.includes(oldText)) throw new Error(`Baseline marker missing: ${oldText.slice(0, 90)}`);
  return source.replace(oldText, newText);
}

edit('css/playground.css', css => css.slice(0, css.indexOf('/* Fidelity pass:')));
edit('index.html', html => {
  html = replace(html,
    '<span class="hero-line">Seu próximo</span> <span class="hero-line"><span class="highlight">level</span> começa</span> <span class="hero-line">aqui<span class="hero-period">.</span> <span class="hero-asterisk" aria-hidden="true">✳</span></span>',
    'Seu próximo <span class="highlight">level</span> começa aqui<span class="hero-period">.</span> <span class="hero-asterisk" aria-hidden="true">✳</span>');
  html = replace(html, '<a href="topicos.html" class="btn btn-secondary">Ver conteúdos →</a>', '<a href="topicos.html" class="btn btn-secondary">Ver conteúdos →</a>\n          <a href="javascript.html" class="btn btn-js">Aprender JavaScript</a>');
  html = replace(html, '<p class="hero-proof"><span aria-hidden="true">👾 🚀 🧠</span> feito para quem curte aprender construindo</p>', '<div class="hero-stats"><div class="stat"><span class="stat-number">50+</span><span class="stat-label">Tags HTML</span></div><div class="stat"><span class="stat-number">80+</span><span class="stat-label">Propriedades CSS</span></div></div>');
  html = replace(html, '<span class="file-name">playground.js</span>', '<span class="file-name">index.html</span>');
  const start = html.indexOf('<pre class="code-content"><code>', html.indexOf('<span class="file-name">index.html</span>'));
  const end = html.indexOf('</pre>', start) + 6;
  html = html.slice(0, start) + '<pre class="code-content"><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;title&gt;Meu Site&lt;/title&gt;\n  &lt;/head&gt;\n  &lt;body&gt;\n    &lt;h1&gt;Olá, Mundo!&lt;/h1&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</code></pre>' + html.slice(end);
  html = html.replace(/\s*<span class="scene-level"[^>]*>.*?<\/span>/s, '');
  html = html.replace(/\s*<section class="adventure-section"[\s\S]*?<\/section>(?=\s*<!-- HTML Section -->)/, '');
  html = replace(html, 'family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Inter:', 'family=Inter:');
  return html;
});
edit('javascript.html', html => {
  html = html.replace(/\s*<nav class="breadcrumbs study-breadcrumbs"[^>]*>.*?<\/nav>/s, '');
  html = replace(html, '⚡ JAVASCRIPT 101', '⚡ Interatividade e Dinamismo');
  html = replace(html, 'Introdução ao <br><span class="highlight-js">JavaScript<span class="hero-period">.</span></span>', 'Aprenda <span class="highlight-js">JavaScript</span>');
  html = replace(html, 'A linguagem que faz a web sair do papel. Aprenda os fundamentos com exemplos práticos,\n          explicações objetivas e um visual feito para você focar.', 'A linguagem de programação que dá vida às páginas web. Aprenda a criar\n          interações, manipular dados e construir aplicações completas.');
  html = replace(html, 'family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Inter:', 'family=Inter:');
  return html;
});
edit('js/features/reveal.js', js => js.replace('    // Cards must remain readable before they enter the viewport, including\n    // full-page captures and assistive technology scans.\n    observer.observe(card);', "    card.style.opacity = '0';\n    card.style.transform = 'translateY(30px)';\n    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';\n    observer.observe(card);"));
edit('js/features/playground-motion.js', js => js.replace('y: 24, duration: 0.65', 'y: 24, autoAlpha: 0, duration: 0.65'));

console.log(output);
