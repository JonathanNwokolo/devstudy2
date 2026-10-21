const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { SITE, ROUTES, pages, read, readRepo, stripCode, ids, count } = require('./helpers');

const PAGES = pages();

test('as 19 rotas públicas existem, com exatamente os mesmos endereços', () => {
  assert.equal(PAGES.length, 19, `páginas: ${PAGES.join(', ')}`);
  assert.deepEqual(PAGES, [...ROUTES].sort());
});

for (const file of PAGES) {
  test(`${file}: metadados básicos`, () => {
    const html = read(file);
    assert.match(html, /<html[^>]*lang="pt-BR"/, 'lang="pt-BR" ausente');
    assert.match(html, /<title>[^<]+<\/title>/, '<title> ausente');
    assert.match(html, /<meta\s+name="description"\s+content="[^"]+"/, 'meta description ausente');
    assert.match(html, /<meta\s+name="viewport"/, 'meta viewport ausente');
  });

  test(`${file}: ids únicos`, () => {
    const seen = new Map();
    for (const id of ids(read(file))) seen.set(id, (seen.get(id) || 0) + 1);
    const dups = [...seen].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`);
    assert.deepEqual(dups, [], `ids duplicados: ${dups.join(', ')}`);
  });

  test(`${file}: landmarks (um <main>, um <h1> de página, <footer>)`, () => {
    const html = read(file);
    assert.equal(count(html, /<main[\s>]/g), 1, 'deve haver exatamente um <main>');
    assert.ok(count(html, /<footer[\s>]/g) >= 1, 'falta <footer>');
    const h1 = count(html, /<h1[\s>]/g);
    assert.ok(h1 >= 1, 'falta <h1>');
  });

  test(`${file}: link "pular para o conteúdo" aponta para um alvo existente`, () => {
    const html = read(file);
    const m = stripCode(html).match(/<a[^>]+href="#([^"]+)"[^>]*class="[^"]*skip-to-content[^"]*"|<a[^>]+class="[^"]*skip-to-content[^"]*"[^>]+href="#([^"]+)"/);
    assert.ok(m, 'falta o skip-link (class="skip-to-content")');
    const target = m[1] || m[2];
    assert.ok(ids(html).includes(target), `skip-link aponta para #${target}, que não existe`);
  });

  test(`${file}: navegação sem ARIA de aplicação (menubar/menuitem) incorreta`, () => {
    const html = stripCode(read(file));
    assert.equal((html.match(/role="menubar"/g) || []).length, 0, 'role="menubar" presente');
    assert.equal((html.match(/role="menuitem"/g) || []).length, 0, 'role="menuitem" presente');
  });

  test(`${file}: links internos e âncoras resolvem`, () => {
    const html = stripCode(read(file));
    const known = new Map();
    const idsOf = (f) => {
      if (!known.has(f)) known.set(f, new Set(ids(read(f))));
      return known.get(f);
    };
    const problems = [];
    for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:|javascript:)/i.test(href) || href === '#') continue;
      const [filePart, hash] = href.split('#');
      const target = filePart === '' ? file : filePart;
      if (!fs.existsSync(path.join(SITE, target))) {
        problems.push(`${href} → arquivo inexistente`);
        continue;
      }
      if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) {
        problems.push(`${href} → âncora inexistente`);
      }
    }
    assert.deepEqual(problems, []);
  });

  test(`${file}: recursos locais referenciados existem`, () => {
    const html = stripCode(read(file));
    const missing = [];
    for (const m of html.matchAll(/(?:src|href)="((?:css|js|content)\/[^"]+)"/g)) {
      if (!fs.existsSync(path.join(SITE, m[1].split('?')[0]))) missing.push(m[1]);
    }
    assert.deepEqual(missing, []);
  });
}

test('promessas não sustentadas foram removidas do site', () => {
  const banned = [
    [/zero ao avan[cç]ado/i, '"zero ao avançado"'],
    [/65\+\s*<\/span>\s*<span class="stat-label">\s*Desafios/i, '"65+ Desafios"'],
    [/WCAG\s*2\.\d\s*AA\s*(compliant|compliance|conforme)/i, 'afirmação de conformidade WCAG AA'],
  ];
  const offenders = [];
  for (const file of [...PAGES, 'README.md']) {
    const text = file === 'README.md' ? readRepo(file) : read(file);
    for (const [re, label] of banned) if (re.test(text)) offenders.push(`${file}: ${label}`);
  }
  assert.deepEqual(offenders, []);
});

test('estatísticas dos heróis batem com o conteúdo medido', () => {
  const stat = (file, label) => {
    const m = read(file).match(new RegExp(`stat-number">([^<]+)</span>\\s*<span class="stat-label">${label}<`));
    assert.ok(m, `${file}: estatística "${label}" não encontrada`);
    return parseInt(m[1], 10);
  };
  const js = read('javascript.html');
  assert.equal(stat('javascript.html', 'Tópicos'), (js.match(/class="topic-card/g) || []).length);
  assert.equal(stat('javascript.html', 'Exemplos de código'), (js.match(/<pre[\s>]/g) || []).length);
});

test('o iframe do editor ao vivo é isolado por sandbox', () => {
  const html = read('index.html');
  const tag = html.match(/<iframe[^>]*id="previewFrame"[^>]*>/);
  assert.ok(tag, 'iframe #previewFrame não encontrado');
  const tokens = (tag[0].match(/sandbox="([^"]*)"/) || [, ''])[1].split(/\s+/);
  assert.ok(tokens.includes('allow-scripts'), 'precisa de allow-scripts para o editor funcionar');
  for (const bad of ['allow-same-origin', 'allow-top-navigation', 'allow-popups-to-escape-sandbox']) {
    assert.ok(!tokens.includes(bad), `sandbox não pode conter ${bad}`);
  }
});

test('todo <iframe> do site declara sandbox e title', () => {
  const offenders = [];
  for (const file of PAGES) {
    for (const m of stripCode(read(file)).matchAll(/<iframe[^>]*>/g)) {
      if (!/sandbox=/.test(m[0])) offenders.push(`${file}: sem sandbox`);
      if (!/title=/.test(m[0])) offenders.push(`${file}: sem title`);
    }
  }
  assert.deepEqual(offenders, []);
});
