const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');

// Axe covers automated WCAG checks; keyboard and screen reader review remain manual.
const PAGES = [
  'index', 'css', 'javascript', 'git', 'http', 'react', 'vuejs',
  'backend', 'apis', 'acessibilidade', 'postgresql', 'typescript',
  'sql', 'terminal', 'erros-comuns', 'topicos', 'roadmap',
  'glossario', 'cheatsheets',
];
const SIZES = { desktop: 1440, tablet: 768, mobile: 390 };

async function audit(page, name, theme, size, state = 'default') {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const violations = results.violations.map(({ id, impact, nodes }) => ({
    id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }));
  const dir = path.join('docs', 'a11y-evidence', 'runs');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}-${theme}-${size}-${state}.json`), JSON.stringify(violations, null, 2));
  const blockers = violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');
  expect(blockers.map(({ id, impact, nodes }) => `${id} ${impact}: ${nodes.length} nodes\n${nodes.map(({ target, failureSummary }) => `${target.join(' ')}: ${failureSummary}`).join('\n')}`)).toEqual([]);
}

for (const name of PAGES) {
  for (const theme of ['light', 'dark']) {
    const sizes = ['desktop', ...(name === 'index' || name === 'javascript' ? ['tablet', 'mobile'] : [])];
    for (const size of sizes) {
      test(`axe: ${name} ${theme} ${size} sem critical/serious`, async ({ page }) => {
        await page.setViewportSize({ width: SIZES[size], height: 980 });
        await page.goto(`/${name}.html`);
        if (theme === 'dark') await page.locator('#themeToggle').click();
        await page.waitForTimeout(800);
        await audit(page, name, theme, size);
      });
    }
  }
}

for (const name of ['index', 'javascript']) {
  for (const theme of ['light', 'dark']) {
    test(`axe: ${name} ${theme} hover/foco`, async ({ page }) => {
      await page.goto(`/${name}.html`);
      if (theme === 'dark') await page.locator('#themeToggle').click();
      await page.waitForTimeout(800);
      if (name === 'javascript') {
        await expect(page.locator('.study-rail-left a[aria-current="page"]')).toHaveCount(1);
      }
      await page.locator(name === 'index' ? '.adventure-card' : '.js-hero .btn').first().hover();
      await page.waitForTimeout(600); // deixa o breadcrumb fixo terminar o fade antes de medir contraste
      await audit(page, name, theme, 'desktop', 'hover');
      await page.locator('#themeToggle').focus();
      await audit(page, name, theme, 'desktop', 'focus');
    });
  }
}
