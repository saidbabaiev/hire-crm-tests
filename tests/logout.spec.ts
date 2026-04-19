import { test, expect } from '@playwright/test';
import { Navbar } from '../components/Navbar';

test.describe('Logout functionality', () => {
    test('User can logout successfully', async ({ page }) => { 
        const navbar = new Navbar(page);

        // 1. Assuming user is already logged in for this test
        await page.goto('/dashboard'); 

        // 2. Logout
        await navbar.logout();

        // 3. Check that the user is redirected to the auth page after logout
        await expect(page).toHaveURL('/auth');

        // 4. Try to access protected page after logout
        await page.goto('/dashboard');
        await expect(page).toHaveURL('/auth');
    });
});
