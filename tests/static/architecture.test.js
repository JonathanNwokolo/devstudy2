const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, ROUTES, ALL_PAGES, pages, read, readRepo, walk, stripCode } = require('./helpers');

// Garante a arquitetura da PHASE 1A: uma fonte única para header/navegação/footer,
// páginas sem HTML duplicado, URLs públicas preservadas e nada de arquivos soltos na raiz.

const normalize = (html) => html.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/> </g, '><').trim();

test('cada rota pública tem exatamente uma fonte em src/pages com permalink idêntico', () => {
  const sources = walk('src/pages', (f) => f.endsWith('.html')).map((f) => path.basename(f));
  assert.deepEqual(sources, [...ALL_PAGES].sort());
  for (const route of ALL_PAGES) {
    const fm = readRepo(`src/pages/${route}`).match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, `${route}: sem front matter`);
    assert.match(fm[1], new RegExp(`^permalink: "${route.replace('.', '\\.')}"$`, 'm'), `${route}: permalink diferente do nome`);
    assert.match(fm[1], /^title: ".+"$/m, `${route}: sem title`);
    assert.match(fm[1], /^description: ".+"$/m, `${route}: sem description`);
  }
});

test('o código-fonte das páginas não duplica header, navegação nem footer', () => {
  for (const route of ALL_PAGES) {
    const src = readRepo(`src/pages/${route}`);
    assert.doesNotMatch(src, /<header[\s>]/, `${route}: <header> deve vir de components/header.njk`);
    assert.doesNotMatch(src, /<nav[^>]*class="navbar"/, `${route}: navegação deve vir de components/header.njk`);
    assert.doesNotMatch(src, /<footer[\s>]/, `${route}: <footer> deve vir de components/footer.njk`);
    assert.doesNotMatch(src, /<script[^>]+src=/, `${route}: scripts vêm do layout (front matter "scripts")`);
    assert.doesNotMatch(src, /<link[^>]+rel="stylesheet"/, `${route}: estilos vêm do layout (front matter "styles")`);
  }
});

test('a navegação renderizada é idêntica em todas as páginas (exceto âncoras locais da home)', () => {
  const navOf = (file) => {
    const m = read(file).match(/<nav class="navbar"[\s\S]*?<\/nav>/);
    assert.ok(m, `${file}: sem <nav class="navbar">`);
    return normalize(m[0])
      .replace(/<button class="bookmark-toggle"[\s\S]*?<\/button>/, '') // favoritos: só na home (tem o painel)
      .replace(/href="index\.html#/g, 'href="#')
      .replace(/href="index\.html"/g, 'href="#home"')
      .replace(/ active"/g, '"');
  };
  const reference = navOf('git.html');
  for (const file of pages()) assert.equal(navOf(file), reference, `${file}: navegação diverge da referência`);
});

test('header (mesmos controles) existem em todas as páginas', () => {
  for (const file of pages()) {
    const html = read(file);
    for (const id of ['themeToggle', 'mobileMenuBtn']) {
      assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `${file}: #${id} deve existir exatamente uma vez`);
    }
    assert.match(html, /<footer class="footer">/, `${file}: sem footer`);
  }
});

test('footer: todas as páginas usam uma das variantes do componente', () => {
  const variants = new Set();
  for (const file of pages()) {
    const html = normalize(read(file).match(/<footer[\s\S]*?<\/footer>/)[0]);
    const variant = html.includes('footer-logo') ? 'logo' : html.includes('footer-brand') ? 'marca' : html.includes('footer-section') ? 'colunas' : 'simples';
    variants.add(variant);
    assert.match(html, /DevStudy/, `${file}: footer sem a marca`);
  }
  assert.deepEqual([...variants].sort(), ['colunas', 'logo', 'marca', 'simples']);
});

test('raiz do repositório não contém páginas, css/ ou js/ soltos (a fonte vive em src/)', () => {
  const rootHtml = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
  assert.deepEqual(rootHtml, [], 'HTML fora de src/pages');
  assert.ok(!fs.existsSync(path.join(ROOT, 'css')), 'css/ na raiz (use src/styles)');
  assert.ok(!fs.existsSync(path.join(ROOT, 'js')), 'js/ na raiz (use src/scripts)');
});

test('todo CSS/JS de src é publicado no build com o mesmo caminho (css/, js/)', () => {
  for (const f of walk('src/styles', (x) => x.endsWith('.css'))) {
    assert.ok(fs.existsSync(path.join(ROOT, '_site', 'css', path.relative('src/styles', f))), `${f} não publicado`);
  }
  for (const f of walk('src/scripts', (x) => x.endsWith('.js'))) {
    assert.ok(fs.existsSync(path.join(ROOT, '_site', 'js', path.relative('src/scripts', f))), `${f} não publicado`);
  }
});

test('todo CSS em src/styles é referenciado por alguma página (sem CSS órfão)', () => {
  const referenced = new Set();
  for (const file of pages()) for (const m of read(file).matchAll(/href="css\/([^"]+)"/g)) referenced.add(m[1]);
  const orphans = walk('src/styles', (x) => x.endsWith('.css')).map((f) => path.basename(f)).filter((f) => !referenced.has(f));
  assert.deepEqual(orphans, []);
});

test('todo módulo de página (src/scripts/pages) é usado por alguma página', () => {
  const used = new Set();
  for (const file of pages()) for (const m of read(file).matchAll(/src="js\/pages\/([^"]+)"/g)) used.add(m[1]);
  const orphans = walk('src/scripts/pages', (x) => x.endsWith('.js')).map((f) => path.basename(f)).filter((f) => !used.has(f));
  assert.deepEqual(orphans, []);
});

test('o HTML publicado tem exatamente um <main> e skip-link como primeiro elemento do body', () => {
  for (const file of pages()) {
    const html = read(file);
    assert.equal((stripCode(html).match(/<main[\s>]/g) || []).length, 1, `${file}: <main>`);
    assert.match(html, /<body>\s*<a href="#main-content" class="skip-to-content">/, `${file}: skip-link deve ser o primeiro elemento`);
  }
});
