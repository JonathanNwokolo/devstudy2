const test = require('node:test');
const assert = require('node:assert/strict');
const { read, readRepo, walk, stripCode } = require('./helpers');

// ---- Regressões de segurança (padrões inseguros que foram removidos) ----
const sources = Object.fromEntries(walk('src/scripts', (f) => f.endsWith('.js')).map((f) => [f, readRepo(f)]));
const all = Object.values(sources).join('\n');
const src = (name) => sources[`src/scripts/${name}`];

test('segurança: favoritos não usam innerHTML com dados não confiáveis', () => {
  const bookmarks = src('features/bookmarks.js');
  assert.doesNotMatch(bookmarks, /onclick="removeBookmark\(/, 'handler inline com id vindo do localStorage');
  assert.doesNotMatch(bookmarks, /<[^>\n]*>\s*\$\{\s*bookmark\.title\s*\}/, 'título de favorito interpolado em template HTML');
  assert.doesNotMatch(bookmarks, /data-id="\$\{\s*bookmark\.id\s*\}"/, 'id de favorito interpolado em atributo HTML');
});

test('segurança: Toast não interpreta texto do usuário como HTML', () => {
  assert.doesNotMatch(src('core/toast.js'), /<span class="toast-message">\$\{message\}/);
});

test('segurança: editor ao vivo usa srcdoc (iframe sandbox) e não document.write', () => {
  assert.match(src('features/live-editor.js'), /previewFrame\.srcdoc\s*=/);
  assert.doesNotMatch(src('features/live-editor.js'), /previewDoc\.write\(/);
});

test('segurança: demos de página não interpretam o texto digitado como HTML', () => {
  assert.doesNotMatch(src('pages/javascript.js'), /innerHTML/);
});

// ---- Inicialização única / sem conflitos de globais ----
test('regressão: main.js inicializa cada recurso exatamente uma vez', () => {
  const main = src('main.js');
  const imported = [...main.matchAll(/import\s*\{([^}]+)\}\s*from\s*'\.\/features\//g)]
    .flatMap((m) => m[1].split(',').map((n) => n.trim()).filter(Boolean))
    .filter((n) => /^init/.test(n));
  assert.ok(imported.length >= 15, `poucos init* importados: ${imported.length}`);
  for (const name of imported) {
    const calls = main.match(new RegExp(`^\\s*${name}\\(\\);`, 'gm')) || [];
    assert.equal(calls.length, 1, `${name}() chamado ${calls.length}× em main.js`);
  }
});

test('regressão: o botão de tema tem um único dono', () => {
  const themeHandlers = Object.keys(sources).filter((f) => /getElementById\('themeToggle'\)[\s\S]*addEventListener\('click'/.test(sources[f]) && /localStorage|writeString/.test(sources[f]));
  assert.deepEqual(themeHandlers, ['src/scripts/features/theme.js']);

});

test('regressão: cada função global exposta em window é definida uma única vez', () => {
  const names = [...all.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)].map((m) => m[1]);
  const dup = names.filter((n, i) => names.indexOf(n) !== i);
  assert.deepEqual([...new Set(dup)], [], `window.* definido mais de uma vez: ${dup.join(', ')}`);
});

test('compatibilidade: handlers inline das páginas têm função global correspondente', () => {
  const exposed = new Set([...all.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)].map((m) => m[1]));
  const { pages } = require('./helpers');
  const used = new Set();
  for (const file of pages()) {
    for (const m of stripCode(read(file)).matchAll(/\son(?:click|change|input)="([A-Za-z_$][\w$]*)\(/g)) used.add(m[1]);
  }
  assert.ok(used.has('copyCode'), 'esperava encontrar handlers copyCode');
  const missing = [...used].filter((n) => !exposed.has(n));
  assert.deepEqual(missing, [], `handlers inline sem window.${missing.join(', window.')}`);
});

test('módulos: imports relativos resolvem para arquivos existentes', () => {
  const path = require('node:path');
  const fs = require('node:fs');
  const problems = [];
  for (const [file, code] of Object.entries(sources)) {
    for (const m of code.matchAll(/(?:import|export)\s[^'"]*?from\s*'(\.[^']+)'|import\s*'(\.[^']+)'/g)) {
      const target = path.join(path.dirname(file), m[1] || m[2]);
      if (!fs.existsSync(path.join(__dirname, '..', '..', target))) problems.push(`${file} → ${m[1] || m[2]}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('páginas só carregam scripts locais como módulos (main.js primeiro)', () => {
  const { pages } = require('./helpers');
  for (const file of pages()) {
    const html = read(file);
    const locals = [...html.matchAll(/<script\b([^>]*)\ssrc="(js\/[^"]+)"([^>]*)>/g)];
    assert.ok(locals.length >= 1, `${file}: sem scripts locais`);
    assert.equal(locals[0][2], 'js/main.js', `${file}: main.js deve ser o primeiro script local`);
    for (const m of locals) assert.match(m[1] + m[3], /type="module"/, `${file}: ${m[2]} deve ser type="module"`);
    assert.equal(locals.filter((m) => m[2] === 'js/main.js').length, 1, `${file}: main.js carregado mais de uma vez`);
    assert.doesNotMatch(html, /js\/(script|advanced-navigation)\.js/, `${file}: scripts globais legados`);
  }
});
