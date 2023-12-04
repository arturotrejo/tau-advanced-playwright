import { defineConfig, devices } from '@playwright/test';
import baseEnvUrl from './tests/utils/environmentBaseUrl';

require('dotenv').config();

export default defineConfig({
  globalSetup: require.resolve('./tests/setup/global-setup'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  reporter: 'html',
  // timeout: 5000,
  use: {
    storageState: 'storageState.json',
    // launchOptions: {
    //   args: ['--start-maximized']
    // },
    // viewport: null,
    viewport: { width: 1920, height: 1080},
    trace: 'on',
    baseURL: process.env.ENV === 'production' 
      ? baseEnvUrl.production.home
      : process.env.ENV === 'staging' 
        ? baseEnvUrl.staging.home
        : baseEnvUrl.local.home
  },

  projects: [
    { 
      name: 'auth-setup', 
      testMatch: /\/auth-setup\.ts/ ,
      use: {
        headless: false
      }
    },
    {
      name: 'resolver-auth-setup',
      testMatch: /resolver-auth-setup\.ts/,
      use: { 
        baseURL: 'https://release-2331.staging.resolver.com/',
        // headless: false 
      }
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'storageState.json',
        viewport: { width: 1920, height: 1080}
       },
    },
    {
      name: 'chromium-auth',
      use: { 
        ...devices['Desktop Chrome'] ,
        headless: false,
        storageState: '.auth/admin.json' //use this in case you have multiple projects one per user
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'resolver',
      testMatch: /resolver.*spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        baseURL: 'https://release-2331.staging.resolver.com/',
        storageState: 'resolverStorageState.json',      
      }
    },
    {
      name: 'resolver-auth',
      testMatch: /resolver.*spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // headless: false,
        baseURL: 'https://release-2331.staging.resolver.com/',
        storageState: '.auth/resolverAdmin.json',      
      },
      dependencies: ['resolver-auth-setup'],
    },
  ],
});
