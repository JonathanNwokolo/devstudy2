// Utilitários sem dependências para os testes estáticos (regex sobre HTML; suficiente
// para o HTML escrito à mão deste projeto — não é um parser HTML completo).
//
// Os testes de páginas rodam sobre a SAÍDA do build (`_site/`), que é o que vai ao ar.
// `npm run test:static` executa o build antes (script `pretest:static`).
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = path.join(ROOT, '_site');
const SRC = path.join(ROOT, 'src');

/** As 19 rotas públicas (URLs que NÃO podem mudar). */
const ROUTES = [
  'acessibilidade.html', 'apis.html', 'backend.html', 'cheatsheets.html', 'css.html',
  'erros-comuns.html', 'git.html', 'glossario.html', 'http.html', 'index.html', 'javascript.html', 'postgresql.html',
  'react.html', 'roadmap.html', 'sql.html', 'terminal.html', 'topicos.html',
  'typescript.html', 'vuejs.html',
];

if (!fs.existsSync(path.join(SITE, 'index.html'))) {
  throw new Error('Pasta _site/ ausente. Execute "npm run build" antes dos testes.');
}

function pages() {
  return fs.readdirSync(SITE).filter((f) => f.endsWith('.html')).sort();
}

/** Lê um arquivo da saída do build (_site/). Ex.: read('git.html'), read('search-index.json'). */
function read(file) {
  return fs.readFileSync(path.join(SITE, file), 'utf8');
}

/** Lê um arquivo do repositório (fora do build). Ex.: readRepo('README.md'), readRepo('src/scripts/main.js'). */
function readRepo(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

/** Lista arquivos de um diretório do repositório, recursivamente (caminhos relativos ao ROOT, com "/"). */
function walk(dir, filter = () => true) {
  const out = [];
  const base = path.join(ROOT, dir);
  (function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (filter(full)) out.push(path.relative(ROOT, full).split(path.sep).join('/'));
    }
  })(base);
  return out.sort();
}

// Remove blocos que contêm código de exemplo/scripts para não gerar falsos positivos
// (ex.: um `<h1>` mostrado dentro de <pre>, ou ids em exemplos).
function stripCode(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    // fechamentos como `</code\n>` (formatação do Prettier) exigem \s* antes do `>`
    .replace(/<script[\s>][\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style[\s>][\s\S]*?<\/style\s*>/gi, '')
    .replace(/<pre[\s>][\s\S]*?<\/pre\s*>/gi, '')
    .replace(/<code[\s>][\s\S]*?<\/code\s*>/gi, '')
    .replace(/<textarea[\s>][\s\S]*?<\/textarea\s*>/gi, '');
}

function ids(html) {
  return [...stripCode(html).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
}

function count(html, re) {
  return (stripCode(html).match(re) || []).length;
}

module.exports = { ROOT, SITE, SRC, ROUTES, pages, read, readRepo, walk, stripCode, ids, count };
