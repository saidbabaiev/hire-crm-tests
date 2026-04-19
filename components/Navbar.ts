import { type Locator, type Page } from "@playwright/test";

export class Navbar {
    readonly page: Page;
    readonly userMenu: Locator;
    readonly logoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userMenu = page.getByRole('button', { name: 'User Menu' });
        this.logoutBtn = page.getByRole('menuitem', { name: 'Logout' });
    }

    async logout() {
        await this.userMenu.click();
        await this.logoutBtn.click();
    }
}