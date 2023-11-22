import { chromium, FullConfig, expect } from '@playwright/test';
import { LoginPage as ResolverLoginPage } from '../ui/pages/resolver/login-page';

async function globalSetup(config: FullConfig) {
  const globalSetupTracePath = './test-results/global-setup-trace.zip';
  const projectConfigData = config.projects.filter(p => p.name === 'resolver')[0];
  const user = process.env.RESOLVER_USERNAME!;
  const password = process.env.RESOLVER_PASSWORD!;
  const { baseURL, storageState } = projectConfigData.use;
  const browser = await chromium.launch({ headless: false, timeout: 10000 });
  const page = await browser.newPage();
  const loginPage = new ResolverLoginPage(page);

  try {
    await page.context().tracing.start({ screenshots: true, snapshots: true });
    await page.goto(`${baseURL}`);
    await loginPage.doLogin(user, password, '00 BaseApps DS 20465 failed to publish');
    await loginPage.checkLoggedIn();
    await page.context().storageState({ path: storageState as string});
    await page.context().tracing.stop({ path: globalSetupTracePath });
    await browser.close();
  } catch (error) {
    await page.context().tracing.stop({ path: globalSetupTracePath });
    await browser.close();
    throw error;
  }
}

export default globalSetup;

// https://playwright.dev/docs/test-global-setup-teardown#capturing-trace-of-failures-during-global-setup
// https://playwright.dev/docs/trace-viewer
