#!/usr/bin/env node
// Métricas locais de referência (PHASE 0). Medem localhost, sem throttling de rede:
// NÃO representam desempenho em campo nem substituem Lighthouse/WebPageTest.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..', '_site'); // saída do build (npm run build)
const PORT = process.env.PORT || '5598';
const PAGES = ['index', 'css', 'javascript', 'git', 'roadmap'];

(async () => {
  const server = spawn(process.execPath, [path.join(__dirname, 'serve.js')], { env: { ...process.env, PORT }, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 600));
  const browser = await chromium.launch(process.env.CI ? {} : { channel: 'chrome' });
  const out = { generatedAt: new Date().toISOString(), note: 'localhost, sem throttling; não é Lighthouse', pages: {} };
  try {
    for (const p of PAGES) {
      const page = await browser.newPage();
      let bytes = 0; let requests = 0;
      page.on('response', async (res) => { requests++; try { bytes += (await res.body()).length; } catch {} });
      await page.goto(`http://localhost:${PORT}/${p}.html`, { waitUntil: 'load' });
      await page.waitForTimeout(800);
      const m = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
          loadMs: Math.round(nav.loadEventEnd),
          domNodes: document.getElementsByTagName('*').length,
        };
      });
      out.pages[p] = { htmlBytes: fs.statSync(path.join(ROOT, `${p}.html`)).size, requests, transferredBytes: bytes, ...m };
      await page.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
  console.log(JSON.stringify(out, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
