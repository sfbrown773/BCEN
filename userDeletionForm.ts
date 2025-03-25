import {test, expect, Page} from "@playwright/test";

export class DeleteUserForm {
    private customerId: string;

    constructor(customerId: string) {
        this.customerId = customerId
    }

    private deleteUserUrlTemplate = 'https://online.bcen.org/bcendev/f?p=CEN:2700:5784392135174:::2700:g_cust_id:${customerId}';

    // Dynamically build the deleteUser URL with customerId when needed
    private buildDeleteUserUrl(customerId) {
        return this.deleteUserUrlTemplate.replace('${customerId}', customerId);
    }

    async goto(customerId, page: Page) {
        const deleteUserUrl = this.buildDeleteUserUrl(customerId);
        await page.goto(deleteUserUrl);
    }

    async deleteUser(page: Page) {    
        const deleteButton = page.getByRole('button', { name: 'DELETE CUSTOMER' });
        await deleteButton.click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#P2700_Success_Message')).toContainText('Success! The customer record has been permanently deleted.');
    }
}