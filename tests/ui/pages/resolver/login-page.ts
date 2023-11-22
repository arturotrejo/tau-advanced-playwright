import { type Page, type Locator , expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly password: Locator;
  readonly userName: Locator;
  readonly orgCard: Locator;
  readonly myTasksSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.orgCard = page.locator('.rui-tile');
    this.password = page.getByPlaceholder('Password');
    this.userName = page.getByPlaceholder('user@domain.com');
    this.myTasksSection = page.getByRole('heading', { name: 'My Tasks' });
  }

  async fillEmail(email: string) {
    await this.userName.fill(email);
  }

  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  async selectOrg(orgName: string) {
    await this.orgCard.getByText(orgName).click();

  }

  async doLogin(email: string, password: string, orgName: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.loginButton.click();
    await this.selectOrg(orgName);
  }

  async checkLoggedIn() {
    await expect(this.myTasksSection).toBeVisible();
  }

}

export default LoginPage;
