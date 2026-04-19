import { expect, type Locator, type Page } from '@playwright/test';

export class SignUpPage { 
    readonly page: Page;
    readonly signUpTab: Locator;
    readonly fullNameInput: Locator;
    readonly companyNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signUpButton: Locator;

    constructor(page: Page) { 
        this.page = page;
        this.signUpTab = page.getByRole('tab', { name: 'Sign Up' });
        this.fullNameInput = page.getByLabel('Full Name');
        this.companyNameInput = page.getByLabel('Company Name');
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.signUpButton = page.getByRole('button', { name: 'Create Account', exact: true });
    }

    async goto() {
        await this.page.goto('/auth');
        await this.signUpTab.click();
    }

    async signup(fullName: string, companyName: string, email: string, password: string) {
        await this.fullNameInput.fill(fullName);
        await this.companyNameInput.fill(companyName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signUpButton.click();
    }
}