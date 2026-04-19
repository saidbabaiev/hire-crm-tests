import { test, expect } from '@playwright/test';
import { SignUpPage } from '../pages/SignupPage';
import { validationTests } from '../test-data/signup.data';
import { getRequiredEnv } from '../utils/env';

test.describe('Authorization Page (Sign Up)', () => {

    test('Successful sign up', async ({ page }) => { 
        const signUpPage = new SignUpPage(page);

        await signUpPage.goto();

        const uniqueEmail = `bug.tester+${Date.now()}@example.com`;
        await signUpPage.signup('John Doe', 'Acme Corp', uniqueEmail, 'password123');

        const successToast = page.getByText('Account created successfully! Please check your email to verify your account.');
        await expect(successToast).toBeVisible();

        await expect(signUpPage.fullNameInput).toHaveValue('John Doe');
        await expect(signUpPage.companyNameInput).toHaveValue('Acme Corp');
        await expect(signUpPage.emailInput).toHaveValue(uniqueEmail);
    });

    test('Handling Supabase error (User already exists) and showing error toast', async ({ page }) => {
        // 1. INTERCEPT: Catching request to Supabase Sign Up endpoint
        await page.route('**/auth/v1/signup**', async route => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({
                    code: 400,
                    message: 'User already registered',
                })
            });
        });

        const signUpPage = new SignUpPage(page);
        await signUpPage.goto();

        const email = getRequiredEnv('TEST_USER_EMAIL');
        const password = getRequiredEnv('TEST_USER_PASSWORD');
    
        await signUpPage.signup(
            'Existing User',
            'Acme Corp',
            email,
            password
        );

        const successToast = page.getByText('Account created successfully! Please check your email to verify your account.');
        await expect(successToast).not.toBeVisible();

        const errorToast = page.getByText('User already registered');
        await expect(errorToast).toBeVisible();
    });

    for (const data of validationTests) {
        test(data.testName, async ({ page }) => {
            const signUpPage = new SignUpPage(page);
            await signUpPage.goto();

            await signUpPage.signup(data.fullName, data.companyName, data.email, data.password);

            const validationError = page.getByText(data.expectedError);
            await expect(validationError).toBeVisible();

            const successToast = page.getByText('Account created successfully');
            await expect(successToast).not.toBeVisible();
        });
    }
})