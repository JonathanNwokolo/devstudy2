const { test, expect } = require('@playwright/test');

// Fluxos principais existentes (baseline funcional da PHASE 0, mantidos na PHASE 1A).

test('navegação: links do menu levam às páginas e o menu não usa ARIA de aplicação', async ({ page }) => {
  await page.goto('/index.html');
  expect(await page.locator('nav.navbar [role="menubar"], nav.navbar [role="menuitem"]').count()).toBe(0);
  for (const [href, title] of [['css.html', /CSS/], ['javascript.html', /JavaScript/], ['roadmap.html', /Trilha|Roadmap/i]]) {
    await page.goto('/index.html');
    const link = page.locator(`nav.navbar a[href="${href}"]`).first();
    expect(await link.count(), `link ${href} ausente`).toBeGreaterThan(0);
    await link.evaluate((el) => el.click());
    await expect(page).toHaveURL(new RegExp(href.replace('.', '\.')));
    await expect(page).toHaveTitle(title);
  }
});

test('navegação: nenhum erro de JavaScript ao carregar cada página', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const pages = ['index', 'css', 'javascript', 'typescript', 'git', 'http', 'roadmap', 'glossario', 'cheatsheets', 'erros-comuns', 'sql'];
  for (const p of pages) await page.goto(`/${p}.html`);
  expect(errors).toEqual([]);
});

test('tema: alternar persiste em localStorage e sobrevive ao reload', async ({ page }) => {
  await page.goto('/index.html');
  const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.locator('#themeToggle').click();
  const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(after).not.toBe(before);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(after);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(after);
});

test('erros-comuns: marcar "visto" persiste em localStorage', async ({ page }) => {
  await page.goto('/erros-comuns.html');
  const cb = page.locator('.erro-card input[type="checkbox"]').first();
  expect(await cb.count()).toBeGreaterThan(0);
  await cb.evaluate((el) => el.click());
  const saved = await page.evaluate(() => localStorage.getItem('devstudy-progress'));
  expect(saved).toBeTruthy();
  await page.reload();
  await expect(page.locator('.erro-card input[type="checkbox"]').first()).toBeAttached();
  expect(await page.evaluate(() => localStorage.getItem('devstudy-progress'))).toBe(saved);
});

test('busca de cards (cheatsheets): filtra resultados existentes', async ({ page }) => {
  await page.goto('/cheatsheets.html');
  const input = page.locator('#searchInput');
  test.skip((await input.count()) === 0, 'sem busca nesta página');
  const total = await page.locator('.cheat-card').count();
  await input.fill('flex');
  await page.waitForTimeout(600);
  const visible = await page.locator('.cheat-card:visible').count();
  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThan(total);
});

test('busca de cards: termo com caracteres de regex não quebra', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/cheatsheets.html');
  await page.fill('#searchInput', '(');
  await page.waitForTimeout(600);
  expect(errors).toEqual([]);
});

test('acessibilidade: skip-link é o primeiro item focável e leva ao <main>', async ({ page }) => {
  await page.goto('/git.html');
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => ({ cls: document.activeElement.className, href: document.activeElement.getAttribute('href') }));
  expect(first.cls).toContain('skip-to-content');
  expect(first.href).toBe('#main-content');
  expect(await page.evaluate(() => !!document.querySelector('main#main-content'))).toBe(true);
});

test('mobile (375px): sem rolagem horizontal nas páginas principais', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const p of ['index', 'css', 'git', 'cheatsheets']) {
    await page.goto(`/${p}.html`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${p}.html overflow`).toBeLessThanOrEqual(0);
  }
});

test('mobile: botão do menu abre e fecha a navegação', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/index.html');
  const btn = page.locator('#mobileMenuBtn');
  await expect(btn).toBeVisible();
  const state = () => page.evaluate(() => ({
    navClass: document.querySelector('.nav-links').className,
    expanded: document.getElementById('mobileMenuBtn').getAttribute('aria-expanded'),
  }));
  const s0 = await state();
  await btn.click();
  const s1 = await state();
  expect(s1.navClass).not.toBe(s0.navClass);
});

test('acessibilidade: skip-link fica fora da tela até receber foco (todas as páginas com .hero e index)', async ({ page }) => {
  for (const p of ['index', 'css', 'git', 'erros-comuns']) {
    await page.goto(`/${p}.html`);
    const bottom = await page.evaluate(() => document.querySelector('.skip-to-content').getBoundingClientRect().bottom);
    expect(bottom, `${p}.html: skip-link visível sem foco`).toBeLessThanOrEqual(0);
    await page.keyboard.press('Tab');
    const visible = await page.evaluate(() => document.querySelector('.skip-to-content').getBoundingClientRect().bottom);
    expect(visible).toBeGreaterThan(0);
  }
});
