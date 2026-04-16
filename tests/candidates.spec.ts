import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CandidatesPage } from '../pages/CandidatesPage'

test.describe('Candidates Page', () => {
    // Этот блок выполнится ПЕРЕД каждым тестом в этом файле
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('tester@example.com', 'tester123');

        await expect(page).toHaveURL(/dashboard|candidates/);
    });


    test('Successfully open Add candidate form', async ({ page }) => {
        const candidatesPage = new CandidatesPage(page);

        // Go to the candidates page
        await candidatesPage.goto();

        // Check is candidates page loaded
        await expect(candidatesPage.header).toBeVisible();

        // Open add candidate form
        await candidatesPage.openAddCandidateForm();

        await expect(candidatesPage.drawerHeader).toBeVisible();

        await candidatesPage.fillBasicInfo('John', 'Doe', 'johndoe@example.com');

        await expect(candidatesPage.firstNameInput).toHaveValue('John');
        await expect(candidatesPage.emailInput).toHaveValue('johndoe@example.com');

    })
})
