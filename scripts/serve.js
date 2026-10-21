#!/usr/bin/env node
// Servidor estático mínimo, sem dependências, para a pasta gerada pelo build (_site/).
// Uso: npm run build && npm run serve   (PORT=5500 npm run serve)
// Para desenvolver com recarga automática use: npm run dev (Eleventy).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', process.env.SITE_DIR || '_site');

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('Pasta "' + path.relative(process.cwd(), ROOT) + '" não encontrada ou vazia. Execute "npm run build" primeiro.');
  process.exit(1);
}
const PORT = Number(process.env.PORT) || 5500;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT + path.sep) || /(^|[\/])(\.git|node_modules)([\/]|$)/.test(path.relative(ROOT, file))) {
    res.writeHead(403).end('Forbidden'); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 Not Found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(data);
  });
});

server.listen(PORT, () => console.log(`DevStudy (build) em http://localhost:${PORT}/`));
