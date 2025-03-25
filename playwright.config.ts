import { defineConfig, devices } from '@playwright/test';
import { ReporterDescription } from '@playwright/test';


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */


export default defineConfig({
  expect: {
    timeout: 10000 // 10 seconds
  },
  timeout: 180000,
  testDir: './tests',
  //retries: 2,
  retries: process.env.CI ? 2 : 0,
  //THIS CHANGES DYNAMICALLY DEPENDING ON WHETHER THIS RUNS IN A CI PIPELINE, retry in CI only
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  workers: 1,//process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    //['./readableReporter.ts'], // Pass the instantiated reporter
  ],//'./readableReporter.ts',//'html'
  //[["line"], ["allure-playwright"]],
  //[["ortoni-report", reportConfig]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    launchOptions: {
      slowMo: 500,
    },
    headless: true,
    screenshot: 'only-on-failure', 
    video: 'retain-on-failure',
     storageState: './authState.json',
    /* Base URL to use in actions like `await page.goto('/')`. */
     baseURL: 'https://online.bcen.org/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
//    { name: 'setup', testMatch: /.*\.setup\.ts/ },  //REACTIVATE
   {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
//        storageState: './authState.json',          //REACTIVATE
       },
//       dependencies: ['setup'],                    //Reactivate
    },
    
    

    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/
    
    
    /* Test against mobile viewports.
    {
       name: 'Mobile Chrome',
       use: { ...devices['Pixel 5'],
        storageState: './authState.json',
      },     
      },    */
           
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
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  
});
