import { AppPage } from "./page.holder";
import { expect, Page } from "@playwright/test";
import fs from 'fs';

export class Flow extends AppPage {

    //make this programmatic, fill the certName at the end of the pagePath
    public pagePath = `/`

    public pagination = this.page.locator('#workflowPagination');
    public nextButton = this.page.getByRole('link', { name: 'Next chevron_right' });
    public workflowTitle = this.page.locator('#workflowTitle');

    async clickNext(page: Page) {
        const maxRetries = 3
        let previousUrl = page.url();
        let attempts = 0;
    
        while (attempts < maxRetries) {
            await this.nextButton.click({ force: true });
            console.log(`Clicking the next button (Attempt ${attempts + 1})`);
    
            // Wait a moment for the page to potentially change
            await page.waitForLoadState('networkidle');
    
            let currentUrl = page.url();
            if (currentUrl !== previousUrl) {
                return; // Exit the function if the URL has changed
            }
    
            console.log("URL did not change, retrying...");
            attempts++;
        }
    
        throw new Error("Failed to navigate after clicking 'Next' button");
    }
    

    async checkWorkflowTitle(title:string) {
        await expect(this.workflowTitle).toContainText(title);
    }

    //This should be available on all steps of flow
    async checkHeaderMatchesSidebar() {
        if (await this.page.locator('#wizard-steps-dropdown').isVisible()) {
            console.log("In mobile view this test doesn't apply.");
            return; // Exit early as the test is not applicable
        }
                //run this on every page of the flow
                await this.page.waitForSelector('#workflowTitle');
                await expect(this.page.locator('#workflowTitle')).toBeVisible();
                const headerText = await this.page.locator('#workflowTitle').textContent();
                const activeGraphic = await this.page.locator('.workflowBody #aaVerticalLinks .aaPathwayHdr .aaActive a')
                const activeGraphicText = await activeGraphic.textContent();
                await console.log(activeGraphicText);
                await console.log(headerText);
                await expect(headerText?.trim()).toEqual(activeGraphicText?.trim());
        
                if (!activeGraphic) {
                    throw new Error('Active graphic selector is null, cannot proceed with selector evaluation.');
                }
                const pseudoElementColor = await this.page.evaluate(() => {
                    const element = document.querySelector('.workflowBody #aaVerticalLinks .aaPathwayHdr .aaActive');
                    if (!element) throw new Error('Element not found for active graphic selector.');
            
                    // Get computed styles for the pseudo-element ::after
                    const style = window.getComputedStyle(element, '::after');
                    return style.backgroundColor;
                });
        
                // Assert the color is orange (RGB: #EF6C1F)
                expect(pseudoElementColor).toBe('rgb(239, 108, 31)'); // RGB equivalent of #EF6C1F
    }

async goToExamInformation() {
    await this.page.getByRole('link', { name: 'Exam Information' }).click();
}
async goToTestAssurance() {
    await this.page.getByRole('link', { name: 'Test Assurance' }).click();
}
async goToCredentialVerification() {
    await this.page.getByRole('link', { name: 'Credential Verification' }).click();
}
async goToStatus() {
    await this.page.getByRole('link', { name: 'Status' }).click();
}
async goToCheckout() {
    await this.page.goto('https://online.bcen.org/bcendevssa/f?p=ECSSA:15010:9964005144185::::G_WKF_SERNO,G_WKF_FL,G_WKF_TRANS_VERB,G_CART_ID,P15010_HIDE_CONT_SHOP_LINK,CUST_CONTEXT,P0_CONTEXT_HEADER_CD,G_CUST_ID:627812,Y,CHECKOUT,449905,N,,,105307');
}

// Create a utility function to dynamically set annotations based on test arguments
async setTestAnnotations(test, examInfoArgs, testAssuranceArgs?, lastStepTitle?) {
    const { accommodationRequest, militaryStatusRequest, licenseNumber, state, membership } = examInfoArgs;
    const international = state === 'International' ? 'Y' : 'N'; // example logic
    const military = militaryStatusRequest ? 'Y' : 'N';
    const societyMembership = membership === 'Yes' ? 'Y' : 'N';
    const examAccommodations = accommodationRequest ? 'Y' : 'N';
    const testAssurance = testAssuranceArgs ? 'Y' : 'N';
    
    test.annotations = [
      { type: 'Test Title', description: test.title },
      { type: 'Application', description: 'CBRN' }, // can be dynamic if needed
      { type: 'Initial Status', description: 'Initial Application' }, // or dynamic
      { type: 'International', description: international },
      { type: 'Military', description: military },
      { type: 'Other Society Membership', description: societyMembership },
      { type: 'Exam Accommodations', description: examAccommodations },
      { type: 'Test Assurance', description: testAssurance },
      { type: 'RN Audit', description: 'N' }, // You can modify to be dynamic if needed
      { type: 'Expected Result', description: lastStepTitle || 'No steps' },
    ];
  }
}