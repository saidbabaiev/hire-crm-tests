import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authorization Page (Auth) - POM', () => {

    // Test 1: Successful scenario (Happy Path)
    test('Successful login redirects to protected page', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('tester@example.com', 'tester123');

        // 3. Checks (Asserts) we leave in the test! This is an important POM rule: the page class performs actions, and the test performs checks.
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    })

    // Test 2: Negative scenario (Negative Path)
    test('Display error on invalid data entry', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('fake-user@example.com', 'wrongpassword');

        // CHECK: Make sure the URL DIDN'T change
        await expect(page).toHaveURL('/auth');

        // CHECK: Looking for error text from backend
        const errorMessage = page.getByText('Invalid credentials');
        await expect(errorMessage).toBeVisible();
    });

    // Test 3: Mocking Supabase (Simulating server failure)
    test('Handling Supabase error and showing toast', async ({ page }) => {

        // 1. INTERCEPT: Catching request to Supabase Auth
        // Asterisks mean: any domain before and any parameters after
        await page.route('**/auth/v1/token**', async route => {

            // We respond to the frontend as if the database is down or the user is blocked
            await route.fulfill({
                status: 400, // Supabase usually returns 400 for authorization errors
                contentType: 'application/json',
                // Simulating the Supabase GoTrue response structure
                body: JSON.stringify({
                    error: 'invalid_grant',
                    error_description: 'Critical error: Database unavailable' // This text will go to the toast
                }),
            });
        });

        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('tester@example.com', 'tester123');

        // 3. CHECK: Looking for toast with our artificial error
        // Since the toast appears dynamically, Playwright will wait for it to appear (Auto-waiting)
        const errorToast = page.getByText('Critical error: Database unavailable');
        await expect(errorToast).toBeVisible();
    });

});
