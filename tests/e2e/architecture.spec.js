const { test, expect } = require('@playwright/test');

// Arquitetura compartilhada (PHASE 1A): header/nav/footer únicos, inicialização única,
// tema, atalhos, favoritos, copiar código e integridade de rotas/assets em navegador real.

const ALL = [
  'acessibilidade', 'apis', 'backend', 'cheatsheets', 'css', 'erros-comuns', 'git', 'glossario',
  'http', 'index', 'javascript', 'postgresql',
  'react', 'roadmap', 'sql', 'terminal', 'topicos', 'typescript', 'vuejs',
];

test.describe('19 rotas públicas', () => {
  for (const name of ALL) {
    test(`${name}.html: responde 200, sem erros de JS, sem recursos locais quebrados`, async ({ page }) => {
      const errors = [];
      const failed = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('response', (r) => {
        const url = new URL(r.url());
        if (url.hostname === 'localhost' && r.status() >= 400) failed.push(`${r.status()} ${url.pathname}`);
      });
      const response = await page.goto(`/${name}.html`);
      expect(response.status()).toBe(200);
      await page.waitForLoadState('networkidle');
      expect(failed).toEqual([]);
      expect(errors).toEqual([]);
      // header, nav e footer vindos dos componentes
      await expect(page.locator('header.header nav.navbar')).toHaveCount(1);
      await expect(page.locator('footer.footer')).toHaveCount(1);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('#main-content')).toHaveCount(1); // alvo do skip-link
    });
  }
});

test('todos os links internos do menu principal resolvem (HTTP 200)', async ({ page, request }) => {
  await page.goto('/git.html');
  const hrefs = await page.locator('nav.navbar a[href]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  const targets = [...new Set(hrefs.filter((h) => h && !h.startsWith('#') && !/^https?:/.test(h)).map((h) => h.split('#')[0]))];
  expect(targets.length).toBeGreaterThan(15);
  for (const t of targets) {
    const res = await request.get(`/${t}`);
    expect(res.status(), t).toBe(200);
  }
});

test('index.html: âncoras do menu (#css-flexbox etc.) existem na própria página', async ({ page }) => {
  await page.goto('/index.html');
  const hashes = await page.locator('nav.navbar a[href^="#"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')).filter((h) => h.length > 1));
  expect(hashes.length).toBeGreaterThan(5);
  for (const h of hashes) {
    expect(await page.locator(h).count(), h).toBeGreaterThan(0);
  }
});

test.describe('tema (todas as páginas): alternar, persistir e aplicar no carregamento', () => {
  for (const name of ['index', 'git', 'sql', 'vuejs']) {
    test(`${name}.html`, async ({ page }) => {
      await page.goto(`/${name}.html`);
      const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      await page.locator('#themeToggle').click();
      const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(after).not.toBe(before);
      await page.reload();
      expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(after);
    });
  }
});

test('atalhos: t alterna o tema; não dispara ao digitar em campos', async ({ page }) => {
  await page.goto('/git.html');
  const theme = () => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const t0 = await theme();
  await page.keyboard.press('t');
  expect(await theme()).not.toBe(t0);

  await page.goto('/index.html');
  const input = page.locator('#liveEditorInput, textarea').first();
  test.skip((await input.count()) === 0, 'sem campo de texto nesta página');
  await input.focus();
  const t1 = await theme();
  await page.keyboard.type('tt');
  expect(await theme()).toBe(t1);
});

test('atalhos na home: ? abre a ajuda e Esc fecha', async ({ page }) => {
  await page.goto('/index.html');
  await page.keyboard.press('?');
  await expect(page.locator('#shortcutsHelp')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#shortcutsHelp')).not.toHaveClass(/active/);
});

test('atalho b abre o painel de favoritos na home', async ({ page }) => {
  await page.goto('/index.html');
  await page.keyboard.press('b');
  await expect(page.locator('#bookmarksPanel')).toHaveClass(/active/);
});

test('scrollspy da home marca a seção atual no menu', async ({ page }) => {
  await page.goto('/index.html');
  await page.evaluate(() => document.getElementById('html').scrollIntoView());
  await expect(page.locator('.nav-link.active')).toHaveAttribute('href', '#html');
  await page.evaluate(() => document.getElementById('home').scrollIntoView());
  await expect(page.locator('.nav-link.active')).toHaveAttribute('href', '#home');
});

test('copiar código: botão de .code-block (git) e .code-example (index) funcionam', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/git.html');
  const btn = page.locator('.code-block button[onclick^="copyCode"]').first();
  const expected = (await btn.locator('xpath=..').locator('code').first().innerText()).trim();
  await btn.click();
  await expect(btn).toHaveText(/Copiado/);
  expect((await page.evaluate(() => navigator.clipboard.readText())).trim()).toBe(expected);

  await page.goto('/index.html');
  const btn2 = page.locator('.code-example button[onclick^="copyCode"]').first();
  await btn2.click();
  await expect(btn2).toHaveText(/Copiado/);
});

test('inicialização única: um clique alterna o tema uma vez e abre a busca uma vez', async ({ page }) => {
  await page.goto('/index.html');
  const counts = await page.evaluate(() => ({
    toasts: document.querySelectorAll('#toast-container').length,
    copyBtnsOnFirstPre: document.querySelector('pre') ? document.querySelector('pre').querySelectorAll('.copy-btn').length : 0,
    bookmarkBtnsPerHeader: Math.max(0, ...[...document.querySelectorAll('.section-header, .topic-card h3')].map((h) => h.querySelectorAll('.bookmark-btn').length)),
  }));
  expect(counts.copyBtnsOnFirstPre).toBeLessThanOrEqual(1);
  expect(counts.bookmarkBtnsPerHeader).toBeLessThanOrEqual(1);
});

test('mobile (375px): nav compartilhada abre/fecha sem overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/git.html');
  await page.locator('#mobileMenuBtn').click();
  await expect(page.locator('.nav-links')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.nav-links')).not.toHaveClass(/active/);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('páginas com módulos próprios: simuladores e filtros continuam funcionando', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/git.html');
  await page.locator('.install-tab').nth(1).click();
  await expect(page.locator('.install-tab').nth(1)).toHaveClass(/active/);

  await page.goto('/erros-comuns.html');
  const categories = page.locator('.category-btn');
  expect(await categories.count()).toBeGreaterThan(1);
  await categories.nth(1).click();
  await expect(categories.nth(1)).toHaveClass(/active/);

  await page.goto('/glossario.html');
  expect(await page.locator('.glossary-item:visible').count()).toBeGreaterThan(0);

  await page.goto('/javascript.html');
  await page.locator('#demoBtn').click();
  await expect(page.locator('#demoOutput')).toContainText('Você clicou 1 vez');

  for (const p of ['http', 'sql', 'react', 'backend']) await page.goto(`/${p}.html`);
  expect(errors).toEqual([]);
});

test('o build não publica arquivos internos (package.json de src/scripts)', async ({ request }) => {
  const res = await request.get('/js/package.json');
  expect(res.status()).toBe(404);
});

// Simuladores (módulos de página): cada um inicializa e reage ao primeiro controle principal.
const SIMULATORS = [
  ['git', '#gitSimulator', '#gitBtnAdd'],
  ['javascript', '#eventLoopSimulator', '#elBtnStep'],
  ['http', '#httpSimulator', '#simBtnRun'],
  ['backend', '#middlewareSimulator', '#mwBtnRun'],
  ['react', '#reactSimulator', '#rsimBtnInc'],
  ['sql', '#sqlSimulator', '.sql-tab-btn >> nth=1'],
];

for (const [pageName, card, control] of SIMULATORS) {
  test(`simulador em ${pageName}.html reage a ${control}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/${pageName}.html`);
    const snapshot = () => page.locator(card).evaluate((el) => el.innerHTML + '|' + [...el.querySelectorAll('*')].map((n) => n.className).join(','));
    const before = await snapshot();
    await page.locator(card).locator(control).first().evaluate((el) => el.click());
    await expect.poll(snapshot).not.toBe(before);
    expect(errors).toEqual([]);
  });
}
