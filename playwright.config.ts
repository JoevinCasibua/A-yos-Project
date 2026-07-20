import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'test-results/playwright-report' }]],
  outputDir: 'test-results/playwright',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'admin-chromium',
      testMatch: '**/admin-e2e/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000' },
    },
    {
      name: 'mobile-web-chromium',
      testMatch: '**/mobile-e2e/*.spec.ts',
      use: { ...devices['Pixel 7'], baseURL: 'http://localhost:8081' },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @ayos/admin dev',
      url: 'http://localhost:3000/login',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter @ayos/mobile web -- --port 8081',
      url: 'http://localhost:8081/landing',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
