import { test as setup, type Page, chromium } from '@playwright/test';
import LoginPage from '../ui/pages/login-page';
import uiPages from '../utils/uiPages';

const authFile = '.auth/api-admin.json';

setup('authenticate', async ({ request }) => {
  
  // Send authentication request. Replace with your own.
  await request.post('https://demoqa.com/Account/v1/GenerateToken', {
    form: {
      "email":"tau-admin",
      "password":"TestingWithR3n@t@"}
    });
  
  await request.storageState({ path: authFile });
});

const adminFile = '.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  const user = process.env.USERNAME_ADMIN!;
  const password = process.env.PASSWORD!;
  await doLogin(page, user, password);

  await page.context().storageState({ path: adminFile });
});

const userFile = '.auth/user.json';

setup('authenticate as user', async ({ page }) => {
    const user = process.env.USERNAME_USER!;
    const password = process.env.PASSWORD!;
    await doLogin(page, user, password);
    await page.context().storageState({ path: userFile });
});

async function doLogin(page: Page, user:string, password: string) {
    const baseURL = setup.info().project.use.baseURL!;
    const loginPage = new LoginPage(page);
  
    await page.goto(baseURL!+uiPages.login);
    await loginPage.doLogin(user, password);
    await page.waitForURL(baseURL+uiPages.login);
    await loginPage.checkLoggedIn();
}
