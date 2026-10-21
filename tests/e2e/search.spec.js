const { test, expect } = require('@playwright/test');

// Busca global (cabeçalho): testes funcionais da interface, nas páginas onde é oferecida (todas as 19).

const ALL = [
  'acessibilidade', 'apis', 'backend', 'cheatsheets', 'css', 'erros-comuns', 'git', 'glossario',
  'http', 'index', 'javascript', 'postgresql',
  'react', 'roadmap', 'sql', 'terminal', 'topicos', 'typescript', 'vuejs',
];

test.describe('busca global em todas as páginas', () => {
  for (const name of ALL) {
    test(`${name}.html: lupa abre o painel, pesquisa e Esc fecha`, async ({ page }) => {
      await page.goto(`/${name}.html`);
      const panel = page.locator('#searchPanel');
      await expect(panel).not.toHaveClass(/active/);

      await page.locator('#searchToggle').click();
      await expect(panel).toHaveClass(/active/);
      await expect(page.locator('#globalSearch')).toBeFocused();

      await page.fill('#globalSearch', 'css');
      await expect(page.locator('#searchResults a.search-result-item').first()).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(panel).not.toHaveClass(/active/);
    });
  }
});

test('Ctrl+K abre a busca global e foca o campo (página sem busca local)', async ({ page }) => {
  await page.goto('/git.html');
  await page.keyboard.press('Control+k');
  await expect(page.locator('#searchPanel')).toHaveClass(/active/);
  await expect(page.locator('#globalSearch')).toBeFocused();
});

test('Ctrl+K em página com busca local de cards foca o campo local (comportamento anunciado na página)', async ({ page }) => {
  await page.goto('/cheatsheets.html');
  await page.keyboard.press('Control+k');
  await expect(page.locator('#searchInput')).toBeFocused();
  await expect(page.locator('#searchPanel')).not.toHaveClass(/active/);
});

test('o índice só é baixado ao abrir a busca (e uma única vez)', async ({ page }) => {
  const requests = [];
  page.on('request', (r) => { if (r.url().endsWith('search-index.json')) requests.push(r.url()); });
  await page.goto('/css.html');
  await page.waitForLoadState('networkidle');
  const before = requests.length;
  await page.locator('#searchToggle').click();
  await page.fill('#globalSearch', 'grid');
  await expect(page.locator('#searchResults a.search-result-item').first()).toBeVisible();
  await page.fill('#globalSearch', 'flexbox');
  await expect(page.locator('#searchResults a.search-result-item').first()).toBeVisible();
  expect(requests.length - before).toBe(1);
});

test('termos com acento e sem acento retornam o mesmo conteúdo', async ({ page }) => {
  await page.goto('/index.html');
  await page.locator('#searchToggle').click();
  await page.fill('#globalSearch', 'glossário');
  await expect(page.locator('#searchResults a.search-result-item').first()).toBeVisible();
  const withAccent = await page.locator('#searchResults a.search-result-item').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  await page.fill('#globalSearch', 'glossario');
  await expect.poll(async () => page.locator('#searchResults a.search-result-item').evaluateAll((els) => els.map((e) => e.getAttribute('href')))).toEqual(withAccent);
});

test('selecionar um resultado navega até a página e a seção', async ({ page }) => {
  await page.goto('/index.html');
  await page.locator('#searchToggle').click();
  await page.fill('#globalSearch', 'status code');
  const link = page.locator('#searchResults a.search-result-item[href^="http.html"]').first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/http\.html/);
});

test('sem resultados: mensagem como texto; teclado: seta para baixo vai aos resultados', async ({ page }) => {
  await page.goto('/index.html');
  await page.locator('#searchToggle').click();
  await page.fill('#globalSearch', 'zzzzqqqq');
  await expect(page.locator('#searchResults .empty-state')).toContainText('Nenhum resultado');

  await page.fill('#globalSearch', 'css');
  await expect(page.locator('#searchResults a.search-result-item').first()).toBeVisible();
  await page.locator('#globalSearch').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#searchResults a.search-result-item').first()).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#globalSearch')).toBeFocused();
});

test('falha ao carregar o índice mostra mensagem (sem quebrar a página)', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/search-index.json', (route) => route.fulfill({ status: 500, body: 'erro' }));
  await page.goto('/git.html');
  await page.locator('#searchToggle').click();
  await page.fill('#globalSearch', 'merge');
  await expect(page.locator('#searchResults .empty-state')).toContainText('Não foi possível carregar');
  expect(errors).toEqual([]);
});
