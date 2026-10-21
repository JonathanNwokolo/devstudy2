#!/usr/bin/env node
/**
 * Gera o índice estático da busca global (sem backend).
 *
 * Entrada : os HTML já renderizados em `_site/` (o build do Eleventy chama este script ao final).
 * Saída   : `_site/search-index.json` — lista de { t, d, u, p }:
 *             t = título (página ou seção), d = descrição curta, u = URL relativa (página.html#id),
 *             p = título da página.
 *
 * Uso manual: node scripts/build-search-index.js [pastaDeSaida]
 * Sem dependências: o HTML do projeto é escrito à mão e regular o bastante para um extrator simples.
 */
const fs = require('node:fs');
const path = require('node:path');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const MAX_DESCRIPTION = 140;
// Rótulo da página nos resultados quando o <title> não serve como nome (a home é a página de HTML).
const PAGE_LABELS = { 'index.html': 'Início (HTML)' };

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

function textOf(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

/** Remove trechos que não são conteúdo de leitura (exemplos de código, scripts, comentários). */
function stripNonContent(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|pre|code|textarea|svg)[\s>][\s\S]*?<\/\1\s*>/gi, '');
}

/**
 * Extrai as entradas de uma página renderizada.
 * @param {string} html conteúdo do arquivo
 * @param {string} file nome do arquivo (ex.: "git.html")
 */
function extractEntries(html, file) {
  const rawTitle = textOf((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || file).replace(/\s*-\s*DevStudy\s*$/, '');
  const title = PAGE_LABELS[file] || rawTitle;
  const description = textOf(((html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1]) || '');

  const entries = [{ t: title, d: truncate(description, MAX_DESCRIPTION), u: file, p: title }];

  const mainMatch = html.match(/<main[\s\S]*<\/main>/);
  if (!mainMatch) return entries;
  const main = stripNonContent(mainMatch[0]);

  const tagRe = /<(h[2-4])\b([^>]*)>([\s\S]*?)<\/\1>|<([a-z0-9]+)\b[^>]*?\sid="([^"]+)"[^>]*>|<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let lastId = '';
  let pending = null; // entrada aguardando o primeiro parágrafo
  const seen = new Set();

  for (const match of main.matchAll(tagRe)) {
    if (match[1]) {
      const text = textOf(match[3]);
      const ownId = (match[2].match(/\sid="([^"]+)"/) || [])[1];
      const id = ownId || lastId;
      if (ownId) lastId = ownId;
      if (text.length < 2) continue;

      const url = id ? `${file}#${id}` : file;
      const key = `${url}|${text}`;
      if (seen.has(key)) continue;
      seen.add(key);

      pending = { t: text, d: '', u: url, p: title };
      entries.push(pending);
    } else if (match[4]) {
      if (match[4].toLowerCase() !== 'main') lastId = match[5]; // o id do <main> é só o alvo do skip-link
    } else if (match[6] !== undefined && pending && !pending.d) {
      pending.d = truncate(textOf(match[6]), MAX_DESCRIPTION);
    }
  }

  return entries;
}

function buildSearchIndex(outputDir = '_site') {
  const root = path.resolve(outputDir);
  const files = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort();

  const index = [];
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    index.push(...extractEntries(html, file));
  }

  const target = path.join(root, 'search-index.json');
  fs.writeFileSync(target, JSON.stringify(index));
  return { target, entries: index.length, bytes: Buffer.byteLength(JSON.stringify(index)) };
}

module.exports = { buildSearchIndex, extractEntries };

if (require.main === module) {
  const result = buildSearchIndex(process.argv[2] || '_site');
  console.log(`Índice de busca: ${result.entries} entradas, ${result.bytes} bytes → ${result.target}`);
}
