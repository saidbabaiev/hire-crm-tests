import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getRequiredEnv } from '../utils/env';

const authFile = 'playwright/.auth/user.json';

setup('Authorization setup', async ({ page }) => { 
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const email = getRequiredEnv('TEST_USER_EMAIL');
    const password = getRequiredEnv('TEST_USER_PASSWORD');

    await loginPage.login(email, password);

    await expect(page).toHaveURL(/dashboard/);
    await page.context().storageState({ path: authFile });
});