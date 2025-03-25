import {test, expect, Page} from "@playwright/test";
import { User } from "./user";

export class CreateUserForm {

    async goto(page: Page) {
        const encodedCredentials = Buffer.from(`${process.env.AA_BACKOFFICE_USERNAME}:${process.env.AA_BACKOFFICE_PASSWORD}`).toString('base64');
        await page.setExtraHTTPHeaders({
          'Authorization': `Basic ${encodedCredentials}`
        });
        
        await page.goto(process.env.AA_BACKOFFICE_URL! + '/cencustmast.insert_page?p_cust_ty=I&p_app_context=CEN');
    }
    private expectedUrl = /https:\/\/online\.bcen\.org\/bcendev\/wwwsuccess\.display_success_page\?success_txt=New\+Account\+Creation\+is\+Successful\.\+\+The\+New\+Customer\+ID\+is%3A\+(\d{7})&success_subtxt=Follow\+one\+of\+the\+links\+below\+to\+proceed\.&nav_url=cencustmast\.master_pg%3Fq_cust_id%3D\1&nav_url_txt=Customer\+Masterfile\+for\+\1&nav_url_attribute=&nav_url=cencustlkup\.query_page&nav_url_txt=Customer\+Lookup&nav_url_attribute=&nav_url=memsgpord\.wizstep1%3Fp_cust_id%3D\1&nav_url_txt=Membership\+Join&nav_url_attribute=&nav_url=pubordpack\.wizstep1%3Fp_cust_id%3D\1&nav_url_txt=Order\+a\+Subscription&nav_url_attribute=&nav_url=memsgpallord\.wizstep1%3Fp_cust_id%3D\1&nav_url_txt=Rapid\+Membership\+Orders&nav_url_attribute=&nav_url=evtregsetup\.evtreg_step1%3Fp_cust_id%3D\1&nav_url_txt=Register\+for\+an\+Event&nav_url_attribute=/;

    async checkNavigation(page: Page) {
        await page.waitForURL(this.expectedUrl);
        const url = await page.url();
        await expect(url).toMatch(this.expectedUrl);
    }

    async extractCustomerNumber(page: Page): Promise<string> {
        const currentUrl = page.url();

        // Regular expression to extract the customerId (the value of q_cust_id=)
        const regex = /q_cust_id%3D(\d{7})/;

        // Check if the URL matches the pattern
        const match = currentUrl.match(regex);
        
        if (match && match[1]) {
            const customerId = match[1];  // The captured customer number
            console.log(`Extracted Customer Number: ${customerId}`);
            return customerId;
        } else {
            throw new Error(`Customer number not found in URL, ${currentUrl}`);
        }
    }

    async saveUser(page) {
        await page.getByRole('button', { name: 'Save and Done' }).click();
        await this.checkNavigation(page);
    }

    async createUser(page: Page, firstName: string, lastName: string): Promise<User> {
        await this.goto(page);
        // Filling out the form for user creation
        await page.locator('input[name="p_first_nm"]').fill(firstName);
        await page.locator('input[name="p_last_nm"]').fill(lastName);

        // Save and finish the user creation
        await this.saveUser(page);

        // Extract the customerId from the page URL
        const customerId = await this.extractCustomerNumber(page);
        
        // Return the created user
        return new User(page, firstName, lastName, customerId, 'new application');
    }
}