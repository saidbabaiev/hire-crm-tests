import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:8080/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // 1. Проект настройки авторизации
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // 2. Тесты, которые НЕ требуют авторизации (например, страница логина/регистрации)
    {
      name: 'auth-tests',
      testDir: './tests', // или где лежат твои auth-тесты
      testMatch: /auth\.spec\.ts|signup\.spec\.ts|login\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // 3. Главный проект для всех остальных тестов (использует сохраненную сессию)
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Говорим браузеру подтягивать файл с сессией
        storageState: 'playwright/.auth/user.json',
      },
      // Этот проект запустится только ПОСЛЕ успешного выполнения проекта 'setup'
      dependencies: ['setup'],
      testIgnore: /.*(auth|signup|login)\.spec\.ts/, // Игнорируем тесты авторизации
    },
    
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     storageState: 'playwright/.auth/user.json', // Берем токен
    //   },
    //   dependencies: ['setup'], // Ждем авторизацию
    //   testIgnore: /.*(auth|signup|login)\.spec\.ts/,
    // },

    // 5. Защищенные тесты в WEBKIT (Safari)
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     storageState: 'playwright/.auth/user.json', // Берем токен
    //   },
    //   dependencies: ['setup'], // Ждем авторизацию
    //   testIgnore: /.*(auth|signup|login)\.spec\.ts/,
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
