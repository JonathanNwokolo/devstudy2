const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { ROOT, ROUTES, read, ids } = require('./helpers');
const { extractEntries } = require('../../scripts/build-search-index.js');

// Índice estático da busca global + lógica de pesquisa (módulo ES, sem DOM).

const index = JSON.parse(read('search-index.json'));

async function loadSearch() {
  return import(pathToFileURL(path.join(ROOT, 'src/scripts/features/global-search.js')).href);
}

test('índice: formato válido e cobre as 19 páginas', () => {
  assert.ok(Array.isArray(index) && index.length > 300, `índice pequeno: ${index.length}`);
  for (const e of index) {
    assert.equal(typeof e.t, 'string');
    assert.equal(typeof e.d, 'string');
    assert.equal(typeof e.u, 'string');
    assert.equal(typeof e.p, 'string');
    assert.ok(e.t.length > 0, 'título vazio');
  }
  const pagesInIndex = new Set(index.map((e) => e.u.split('#')[0]));
  assert.deepEqual([...pagesInIndex].sort(), [...ROUTES].sort());
});

test('índice: toda URL aponta para uma página e âncora existentes', () => {
  const idCache = new Map();
  const problems = [];
  for (const e of index) {
    const [file, hash] = e.u.split('#');
    if (!ROUTES.includes(file)) {
      problems.push(`${e.u}: página inexistente`);
      continue;
    }
    if (hash) {
      if (!idCache.has(file)) idCache.set(file, new Set(ids(read(file))));
      if (!idCache.get(file).has(hash)) problems.push(`${e.u}: âncora inexistente`);
    }
  }
  assert.deepEqual(problems.slice(0, 10), []);
});

test('índice: não indexa o alvo do skip-link nem exemplos de código', () => {
  assert.ok(!index.some((e) => e.u.endsWith('#main-content')), 'main-content indexado');
  const cssPage = extractEntries('<title>X - DevStudy</title><main><h2 id="a">Título</h2><pre><code><h3>Falso</h3></code></pre></main>', 'x.html');
  assert.deepEqual(cssPage.map((e) => e.t), ['X', 'Título']);
});

test('extractEntries: usa o id da seção mais próxima e o primeiro parágrafo como descrição', () => {
  const html = `<title>Página - DevStudy</title><meta name="description" content="Resumo da página">
    <main id="main-content"><section id="sec-a"><h2>Seção A</h2><p>Primeiro   parágrafo &amp; texto.</p>
    <div class="card"><h3>Detalhe</h3><p>Outro.</p></div></section></main>`;
  const entries = extractEntries(html, 'pagina.html');
  assert.deepEqual(entries, [
    { t: 'Página', d: 'Resumo da página', u: 'pagina.html', p: 'Página' },
    { t: 'Seção A', d: 'Primeiro parágrafo & texto.', u: 'pagina.html#sec-a', p: 'Página' },
    { t: 'Detalhe', d: 'Outro.', u: 'pagina.html#sec-a', p: 'Página' },
  ]);
});

test('busca: ignora acentos e maiúsculas, exige todos os termos e ordena por título', async () => {
  const { prepareIndex, searchEntries } = await loadSearch();
  const prepared = prepareIndex([
    { t: 'Flexbox', d: 'Layout em uma dimensão', u: 'css.html#flex', p: 'CSS' },
    { t: 'Grid', d: 'Layout em duas dimensões com flexbox opcional', u: 'css.html#grid', p: 'CSS' },
    { t: 'Promessas', d: 'Código assíncrono', u: 'javascript.html#promises', p: 'JavaScript' },
  ]);

  assert.deepEqual(searchEntries(prepared, 'FLEXBOX').map((e) => e.t), ['Flexbox', 'Grid']);
  assert.deepEqual(searchEntries(prepared, 'assincrono').map((e) => e.t), ['Promessas']);
  assert.deepEqual(searchEntries(prepared, 'layout grid').map((e) => e.t), ['Grid']);
  assert.deepEqual(searchEntries(prepared, 'x'), [], 'consulta curta não pesquisa');
  assert.deepEqual(searchEntries(prepared, '   '), []);
  assert.deepEqual(searchEntries(prepared, 'inexistente'), []);
});

test('busca: consultas reais retornam resultados úteis no índice gerado', async () => {
  const { prepareIndex, searchEntries } = await loadSearch();
  const prepared = prepareIndex(index);
  const expectations = [
    ['flexbox', 'css.html'],
    ['promises', 'javascript.html'],
    ['git rebase', 'git.html'],
    ['status code', 'http.html'],
  ];
  for (const [query, page] of expectations) {
    const results = searchEntries(prepared, query);
    assert.ok(results.length > 0, `"${query}" sem resultados`);
    assert.ok(results.some((e) => e.u.startsWith(page)), `"${query}" deveria incluir ${page}: ${results.map((e) => e.u).join(', ')}`);
  }
});
