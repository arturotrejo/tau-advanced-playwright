import { test as setup, type Page } from '@playwright/test';
import LoginPage from '../ui/pages/resolver/login-page';

const adminFile = '.auth/resolverAdmin.json';

setup('authenticate as resolver admin', async ({ page }) => {
  const user = process.env.RESOLVER_USERNAME!;
  const password = process.env.RESOLVER_PASSWORD!;
  const baseURL = setup.info().project.use.baseURL!;
  const loginPage = new LoginPage(page);

  await page.goto(baseURL);
  await loginPage.doLogin(user, password, 'Automation - IM Appbase');
  await loginPage.checkLoggedIn();

  await page.context().storageState({ path: adminFile });
});
