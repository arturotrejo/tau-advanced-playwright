import { test } from '@playwright/test';
import FormPage from '../pages/form-page';
import hooks from '../../utils/hooks';
import pages from '../../utils/pages';

let formPage: FormPage

test.beforeEach(async ({ page }) => {
    formPage = await hooks.beforeEach(page, FormPage, pages.formPage);
});

test.describe('Form - Dynamic Page Object Model', () => {
    test('Fill in form', async () => {

        const formData = {
            firstName: 'Luis Arturo',
            lastName: 'Trejo',
            email: 'something@something.com',
            gender: 'Male',
            mobile: '1234567890',
            dateOfBirth: '13 August,1993',
            subjects: 'Maths',
            hobbies: 'Reading',
            picture: 'pikachu.png',
            currentAddress: '199 Park Ave, New York, NY 10166',
            state: 'NCR',
            city: 'Delhi'
        }

        await formPage.fillInForm(formData);
    });
});