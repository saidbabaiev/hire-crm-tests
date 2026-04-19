import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('Authorization setup', async ({ page }) => { 
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('tester@example.com', 'tester123');

    await expect(page).toHaveURL(/dashboard/);
    await page.context().storageState({ path: authFile });
});