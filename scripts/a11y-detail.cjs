const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');

const names = process.argv.slice(2).length ? process.argv.slice(2) : ['index', 'javascript'];
const out = path.join('docs', 'a11y-evidence', 'diagnostics');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  for (const name of names) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
      const page = await context.newPage();
      await page.goto(`http://localhost:5599/${name}.html`);
      if (theme === 'dark') await page.locator('#themeToggle').click();
      await page.waitForTimeout(800);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const violations = results.violations.map(({ id, impact, nodes }) => ({
        id, impact, nodes: nodes.map(({ target, html, failureSummary }) => ({ target, html, failureSummary })),
      }));
      fs.writeFileSync(path.join(out, `${name}-${theme}.json`), JSON.stringify(violations, null, 2));
      for (const violation of violations) {
        const pairs = new Map();
        for (const node of violation.nodes) {
          const colors = node.failureSummary?.match(/foreground color: (#[0-9a-f]+), background color: (#[0-9a-f]+)/i);
          const key = colors ? `${colors[1]} on ${colors[2]}` : 'other';
          pairs.set(key, (pairs.get(key) || 0) + 1);
        }
        console.log(name, theme, violation.id, violation.impact, violation.nodes.length, JSON.stringify([...pairs].sort((a,b)=>b[1]-a[1])));
      }
      await context.close();
    }
  }
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
