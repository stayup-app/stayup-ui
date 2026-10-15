import { defineConfig, devices } from '@playwright/test'

// The specs register real accounts: never let them run against a shared API.
const apiUrl = process.env.STAYUP_API_URL ?? ''
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(apiUrl)) {
  throw new Error(
    `E2E tests create accounts: STAYUP_API_URL must point to a local API, got "${apiUrl || 'nothing'}".`,
  )
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    // The app defaults to English; these specs assert the French UI, so pin
    // the language cookie the same way the app itself persists a choice.
    storageState: {
      cookies: [
        {
          name: 'lang',
          value: 'fr',
          domain: 'localhost',
          path: '/',
          expires: -1,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
