import {test, expect, Page} from '@playwright/test';
import LoginPage from '../pages/resolver/login-page';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
    await page.goto('home');
    loginPage = new LoginPage(page);
});

test('Resolver Login', async () => {
    await loginPage.checkLoggedIn();
});