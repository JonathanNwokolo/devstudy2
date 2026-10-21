const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch();
  const phase = ['after', 'reference'].includes(process.argv[2]) ? process.argv[2] : 'before';
  const baseUrl = process.env.VISUAL_BASE_URL || 'http://localhost:5500';
  const output = path.join(__dirname, '..', 'docs', 'visual-audit', 'screenshots', phase);
  fs.mkdirSync(output, { recursive: true });
  if (phase === 'reference') fs.copyFileSync(path.join(__dirname, '..', 'docs', 'design-reference', 'devstudy_playful_home.png'), path.join(output, 'prototype.html'));
  const issues = [];

  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 980 }, deviceScaleFactor: 1 });
    page.on('pageerror', error => issues.push(`${width}: ${error.message}`));
    for (const name of ['index', 'javascript']) {
      if (phase === 'reference') {
        await page.goto(pathToFileURL(path.join(output, 'prototype.html')).href, { waitUntil: 'networkidle' });
        if (name === 'javascript') await page.evaluate(() => show('docs'));
      } else {
        await page.goto(`${baseUrl}/${name}.html`, { waitUntil: 'networkidle' });
      }
      await page.waitForTimeout(1900);
      await page.screenshot({ path: path.join(output, `${name}-${width}.png`) });
      await page.evaluate(() => window.scrollTo(0, 970));
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(output, `${name}-${width}-section.png`) });
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        title: document.title,
        heading: document.querySelector('h1')?.textContent.trim(),
      }));
      if (metrics.overflow) issues.push(`${name} ${width}: horizontal overflow`);
      process.stdout.write(`${name} ${width}: ${JSON.stringify(metrics)}\n`);
    }
    await page.close();
  }

  if (phase === 'reference') { await browser.close(); return; }
  const fallback = await browser.newPage();
  await fallback.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap/, route => route.abort());
  await fallback.goto(`${baseUrl}/index.html`);
  const visible = await fallback.locator('.hero-title').isVisible();
  if (!visible) issues.push('Hero is hidden without GSAP');
  await fallback.close();
  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(`${baseUrl}/index.html`);
  const reducedVisible = await reduced.locator('.hero-title').isVisible();
  if (!reducedVisible) issues.push('Hero is hidden with reduced motion');
  await reduced.close();
  await browser.close();
  process.stdout.write(`Issues: ${JSON.stringify(issues)}\n`);
  if (issues.length) process.exitCode = 1;
})();
