const { defineConfig } = require('@playwright/test');

// Em CI usamos o Chromium baixado pelo Playwright; localmente, se existir, o Chrome instalado.
const useSystemChrome = !process.env.CI && process.env.PW_CHANNEL !== 'none';

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5599',
    ...(useSystemChrome ? { channel: 'chrome' } : {}),
  },
  webServer: {
    command: 'node scripts/serve.js',
    env: { PORT: '5599' },
    url: 'http://localhost:5599/index.html',
    reuseExistingServer: !process.env.CI,
  },
});
