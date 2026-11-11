import { defineConfig, devices } from '@playwright/test';

// Runs against a production build: `npm run build && npm run test:e2e`.
// Set E2E_BASE_URL to test a deployed preview instead (the local servers are then not started).
const PORT = 3100;
const MOCK = 'http://localhost:4597';
const remote = process.env.E2E_BASE_URL;
const webgl = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000, // software-rendered WebGL plus axe is slow on CI-class machines
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: { baseURL: remote || `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  webServer: remote
    ? undefined
    : [
        { command: 'node tests/mock-server.mjs', url: `${MOCK}/__calls`, reuseExistingServer: false },
        {
          command: `node node_modules/next/dist/bin/next start -p ${PORT}`,
          url: `http://localhost:${PORT}`,
          reuseExistingServer: false,
          env: {
            RESEND_API_KEY: 're_test_mock',
            RESEND_BASE_URL: MOCK,
            NOTION_TOKEN: 'secret_test_mock',
            NOTION_LEADS_DATA_SOURCE_ID: 'ds-e2e',
            NOTION_API_URL: MOCK,
          },
        },
      ],
  projects: [
    { name: 'chromium-390', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 }, launchOptions: { args: webgl } } },
    { name: 'chromium-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 }, launchOptions: { args: webgl } } },
    { name: 'chromium-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: { args: webgl } } },
    { name: 'chromium-1920', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 }, launchOptions: { args: webgl } } },
    { name: 'webkit-1440', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
    { name: 'webkit-390', use: { ...devices['iPhone 14'] } },
    {
      name: 'no-webgl',
      testMatch: /fallback\.spec/,
      use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--disable-webgl', '--disable-3d-apis'] } },
    },
  ],
});
