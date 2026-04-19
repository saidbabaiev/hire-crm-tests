import { test, expect } from '@playwright/test';
import { CandidatesPage } from '../pages/CandidatesPage'

test.describe('Candidates Page', () => {
 
    test('Successfully open Add candidate form', async ({ page }) => {
        const candidatesPage = new CandidatesPage(page);

        // Go to the candidates page
        await candidatesPage.goto();
        await expect(candidatesPage.header).toBeVisible(); // Check is candidates page loaded

        // Open add candidate form
        await candidatesPage.openAddCandidateForm();
        await expect(candidatesPage.drawerHeader).toBeVisible();

        await candidatesPage.fillBasicInfo('John', 'Doe', 'johndoe@example.com');

        await expect(candidatesPage.firstNameInput).toHaveValue('John');
        await expect(candidatesPage.emailInput).toHaveValue('johndoe@example.com');

        await candidatesPage.selectDropdownOption('Work Type', 'Remote');
        await candidatesPage.selectDropdownOption('Visa Status', 'Work Visa');

        const workTypeCombobox = candidatesPage.getComboboxLocator('Work Type');
        await expect(workTypeCombobox).toHaveText('Remote');

        const visaStatusCombobox = candidatesPage.getComboboxLocator('Visa Status');
        await expect(visaStatusCombobox).toHaveText('Work Visa');

        await candidatesPage.saveBtn.click();

        const successToast = page.getByText('Success', { exact: true });
        await expect(successToast).toBeVisible();

        await expect(page).toHaveURL(/\/candidates\/.+/);

        const backToBtn = page.getByRole('button', { name: 'Back to Candidates' });
        await expect(backToBtn).toBeVisible();
    });

})
