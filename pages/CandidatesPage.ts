import { expect, type Locator, type Page } from "@playwright/test";

export class CandidatesPage {
    readonly page: Page;

    // --- main page ---
    readonly header: Locator;
    readonly addCandidateBtn: Locator;
    readonly searchInput: Locator;

    // --- Боковое окно (Drawer) добавления кандидата ---
    readonly drawerHeader: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        // Locators of main page
        this.header = page.getByRole('heading', { name: 'Candidates', exact: true });
        this.addCandidateBtn = page.getByRole('button', { name: 'Add Candidate' });
        this.searchInput = page.getByRole('search', { name: 'Search' })

        // Locators for add candidate drawer
        this.drawerHeader = page.getByRole('heading', { name: 'Add Candidate' });
        this.firstNameInput = page.getByLabel('First Name *');
        this.lastNameInput = page.getByLabel('Last Name');
        this.emailInput = page.getByLabel('Email *');
        

        this.saveBtn = page.getByRole('button', { name: 'Add Candidate' });
    }

    async goto() {
        await this.page.goto('/candidates');
    }

    async openAddCandidateForm() {
        await this.addCandidateBtn.click();
    }

    async fillBasicInfo(firstName: string, lastName: string, email: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
    }
}