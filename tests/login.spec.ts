import { test, expect } from '@playwright/test';

test.describe('Authorization page (Auth)', () => {
    // Happy Path
    test('Successfully Login and redirects to a secure page', async ({ page }) => {
        await page.goto('/auth');

        // Real testing account
        await page.getByLabel('Email').fill('tester@example.com');
        await page.getByLabel('Password').fill('tester123');
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        await expect(page).toHaveURL('/dashboard');

        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    // Negative Path
    test('Show an error when entering incorrect data', async ({ page }) => {
        await page.goto('/auth');

        await page.getByLabel('Email').fill('fake@example.com');
        await page.getByLabel('Password').fill('wrongpassword');
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        await expect(page).toHaveURL('/auth');

        const errorMessage = page.getByText('Invalid login credentials');
        await expect(errorMessage).toBeVisible();
    });
});