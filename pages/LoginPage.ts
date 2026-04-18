import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly signInTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInTab = page.getByRole('tab', { name: 'Sign In' });
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
    }

    async goto() {
        await this.page.goto('/auth');
    }

    // Business action: Login
    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }
}