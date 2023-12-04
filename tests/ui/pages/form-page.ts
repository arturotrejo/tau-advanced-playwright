import { Locator, Page, expect } from '@playwright/test';
import zip from 'lodash/zip';
import { match } from 'ts-pattern';

class FormPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly genderRadioButton: Locator;
    readonly mobileNumberInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly subjectsInput: Locator;
    readonly hobbiesCheckbox: Locator;
    readonly pictureInput: Locator;
    readonly currentAddressInput: Locator;
    readonly stateDropdown: Locator;
    readonly cityDropdown: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = this.page.getByPlaceholder('First Name');
        this.lastNameInput = this.page.getByPlaceholder('Last Name');
        this.emailInput = this.page.getByPlaceholder('name@example.com');
        this.genderRadioButton = this.page.locator('.custom-radio');
        this.mobileNumberInput = this.page.getByPlaceholder('Mobile Number');
        this.dateOfBirthInput = this.page.locator('#dateOfBirthInput');
        this.subjectsInput = this.page.locator('#subjectsContainer');
        this.hobbiesCheckbox = this.page.locator('.custom-checkbox');
        this.pictureInput = this.page.locator('#uploadPicture');
        this.currentAddressInput = this.page.getByPlaceholder('Current Address');
        this.stateDropdown = this.page.getByText('Select State');
        this.cityDropdown = this.page.getByText('Select City');
        this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    }

    async fillInForm(formData: Record<string, string>) {
        
        const fieldsNames = ['Student Name', 'Student Email', 'Gender', 'Mobile', 'Date of Birth', 'Subjects', 'Hobbies', 'Picture', 'Address', 'State and City'];
        const forRemove = [formData.lastName, formData.city]
        const fieldsValues = Object.values(formData).filter(value => !forRemove.includes(value)).map(value => {
            return match(value)
                .with(formData.firstName, () => `${formData.firstName} ${formData.lastName}`)
                .with(formData.state, () => `${formData.state} ${formData.city}`)
                .otherwise(() => value);
        });

        await this.firstNameInput.fill(formData.firstName);
        await this.lastNameInput.fill(formData.lastName);
        await this.emailInput.fill(formData.email);
        await this.genderRadioButton.filter({ hasText: new RegExp(formData.gender) }).click();
        await this.mobileNumberInput.fill(formData.mobile);
        await this.dateOfBirthInput.fill(formData.dateOfBirth);
        await this.page.keyboard.press('Enter');
        await this.subjectsInput.click();
        await this.subjectsInput.type(formData.subjects);
        await this.page.keyboard.press('Enter');
        await this.hobbiesCheckbox.filter({ hasText: new RegExp(formData.hobbies)}).click();
        await this.pictureInput.setInputFiles(`resources/${formData.picture}`);
        await this.currentAddressInput.fill(formData.currentAddress);
        await this.stateDropdown.click();
        await this.page.getByText(new RegExp(`^${formData.state}$`)).click();
        await this.cityDropdown.click();
        await this.page.getByText(formData.city, { exact: true }).click();
        await this.submitButton.click();
    
        zip(fieldsNames, fieldsValues).forEach(async ([fieldName, fieldValue]) => {
            const valueCell = this.page.getByRole('row', { name: fieldName}).getByRole('cell').last();
            await expect(valueCell).toHaveText(fieldValue);
        });
    }       

}

export default FormPage;