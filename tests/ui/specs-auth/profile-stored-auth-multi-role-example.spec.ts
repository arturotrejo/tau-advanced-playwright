import { test } from '@playwright/test';
import ProfilePage from '../pages/profile-page';
import pages from '../../utils/pages';

let profilePage: ProfilePage;

test.describe('Book Store Application - Profile - Admin', () => {
    test('admin and user', async ({ browser }) => {
        const adminContext = await browser.newContext({ storageState: '.auth/admin.json', viewport: { width: 1920, height: 1080}});
        const adminPage = await adminContext.newPage();
        profilePage = new ProfilePage(adminPage);
        await adminPage.goto(pages.profile);
        await profilePage.checkLoggedInAdmin();
        await adminContext.close();
        
        const userContext = await browser.newContext({ storageState: '.auth/user.json', viewport: { width: 1920, height: 1080} });
        const userPage = await userContext.newPage();
        profilePage = new ProfilePage(userPage);
        await userPage.goto(pages.profile);
        await profilePage.checkLoggedInUser();
        
        await userContext.close();
        await browser.close();
    });
});
