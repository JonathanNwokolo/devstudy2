const { test, expect } = require('@playwright/test');

// Regressão: self-XSS nos favoritos, na busca de cards e no editor ao vivo (DEVSTUDY_AUDIT A5/A6).
// A busca global foi removida do site (d9a9cac); não há mais testes dela.

test.describe('favoritos', () => {
  test('título malicioso no localStorage não executa script', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('devstudy_bookmarks', JSON.stringify([
        { id: "x');window.__pwned=true;('", title: '<img src=x onerror="window.__pwned=true">', timestamp: new Date().toISOString(), url: '#x' },
      ]));
    });
    await page.goto('/index.html');
    await page.locator('#bookmarkToggle').click();
    await expect(page.locator('#panelBookmarksList .bookmark-item')).toHaveCount(1);
    expect(await page.evaluate(() => window.__pwned)).toBeFalsy();
    expect(await page.locator('#panelBookmarksList img, #bookmarksList img').count()).toBe(0);
    // remover via botão não deve executar o id injetado
    await page.locator('#panelBookmarksList .bookmark-item-remove').first().evaluate((el) => el.click());
    expect(await page.evaluate(() => window.__pwned)).toBeFalsy();
    await expect(page.locator('#panelBookmarksList .bookmark-item')).toHaveCount(0);
  });

  test('valor corrompido em devstudy_bookmarks não quebra a página', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    // addInitScript roda também no iframe sandbox do editor (sem localStorage): proteger com try/catch.
    await page.addInitScript(() => { try { localStorage.setItem('devstudy_bookmarks', '{não é json'); } catch {} });
    await page.goto('/index.html');
    await expect(page.locator('#bookmarkCount')).toHaveText('0');
    expect(errors).toEqual([]);
  });

  test('adicionar, persistir e remover favorito funciona', async ({ page }) => {
    await page.goto('/index.html');
    const btn = page.locator('.bookmark-btn').first();
    await btn.click({ force: true });
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('devstudy_bookmarks')));
    expect(stored.length).toBe(1);
    await page.reload();
    await page.waitForLoadState('networkidle'); // main.js (módulo) precisa registrar os handlers antes do clique
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('devstudy_bookmarks')).length)).toBe(1);
    await page.locator('.bookmark-btn').first().click({ force: true });
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('devstudy_bookmarks')).length)).toBe(0);
  });
});

test.describe('busca de cards (cheatsheets/erros)', () => {
  for (const pageName of ['cheatsheets.html', 'erros-comuns.html']) {
    test(`${pageName}: consulta com HTML não executa`, async ({ page }) => {
      await page.goto('/' + pageName);
      await page.evaluate(() => { window.__pwned = false; });
      const input = page.locator('#searchInput');
      test.skip((await input.count()) === 0, 'sem #searchInput nesta página');
      await input.fill('<img src=x onerror="window.__pwned=true">');
      await page.waitForTimeout(700);
      expect(await page.evaluate(() => window.__pwned)).toBe(false);
    });
  }
});

test.describe('editor ao vivo', () => {
  test('iframe de preview é isolado (sandbox sem allow-same-origin)', async ({ page }) => {
    await page.goto('/index.html');
    const sandbox = await page.locator('#previewFrame').getAttribute('sandbox');
    expect(sandbox).not.toBeNull();
    expect(sandbox).not.toMatch(/allow-same-origin/);
  });

  test('código do usuário não acessa o localStorage do site', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => localStorage.setItem('segredo', 'sim'));
    await page.fill('#htmlEditor', '<p id="r">x</p><script>try{document.getElementById("r").textContent=String(localStorage.getItem("segredo"))}catch(e){document.getElementById("r").textContent="bloqueado"}</script>');
    await page.waitForTimeout(700);
    const text = await page.frameLocator('#previewFrame').locator('#r').textContent();
    expect(text).toBe('bloqueado');
  });

  test('preview renderiza HTML e CSS do editor', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#htmlEditor', '<h2 id="t">Olá</h2>');
    await page.click('.editor-tab[data-tab="css"]');
    await page.fill('#cssEditor', '#t{color:rgb(255,0,0)}');
    await page.waitForTimeout(700);
    const t = page.frameLocator('#previewFrame').locator('#t');
    await expect(t).toHaveText('Olá');
    await expect(t).toHaveCSS('color', 'rgb(255, 0, 0)');
  });
});

test('editor ao vivo: alert() do código do usuário continua funcionando (allow-modals)', async ({ page }) => {
  await page.goto('/index.html');
  await page.fill('#htmlEditor', '<button id="b" onclick="alert(\'oi\')">x</button>');
  await page.waitForTimeout(700);
  const messages = [];
  page.on('dialog', async (d) => { messages.push(d.message()); await d.dismiss(); });
  // dispatchEvent: o breadcrumb fixo pode cobrir o botão depois da rolagem; o teste é sobre o alert.
  await page.frameLocator('#previewFrame').locator('#b').dispatchEvent('click');
  await expect.poll(() => messages).toEqual(['oi']);
});
