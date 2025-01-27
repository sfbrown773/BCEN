import { AppPage } from "./page.holder";
import { expect } from "@playwright/test";

export class HomePage extends AppPage {
    public pagePath = '/'
//locators
    public buttonCEN = this.page.locator('li.cert-list-item').filter({ hasText: /Certified Emergency Nurse/ });
    public linkCEN = this.buttonCEN.locator('a');
    //this.page.getByText('Certified Emergency Nurse');
    public buttonCTRN = this.page.locator('li.cert-list-item').filter({ hasText: /Certified Transport Registered/ });
    public linkCTRN = this.buttonCTRN.locator('a');
    public buttonCPEN = this.page.locator('li.cert-list-item').filter({ hasText: /Certified Pediatric Emergency/ });
    public linkCPEN = this.buttonCPEN.locator('a');
    public buttonTCRN = this.page.locator('li.cert-list-item').filter({ hasText: /Trauma Certified Registered/ });
    public linkTCRN = this.buttonTCRN.locator('a');
    public buttonCFRN = this.page.locator('li.cert-list-item').filter({ hasText: /Certified Flight Registered/ });
    public linkCFRN = this.buttonCFRN.locator('a');
    public buttonCBRN = this.page.locator('li.cert-list-item').filter({ hasText: /Certified Burn Registered/ });
    public linkCBRN = this.buttonCBRN.locator('a');
    public loggedIn = this.page.locator('#BCEN_LOGGED_IN_USER');
//methods
    async visit() {
        await this.page.goto('https://online.bcen.org/bcendevssa/f?p=700:2222:7932820419680:', {
            waitUntil: 'load', // Wait until network activity has stopped
          });
    }
    async clickCEN() {
        await this.buttonCEN.click();
    }
    async clickCTRN() {
        await this.buttonCTRN.click();
    }
    async clickCPEN() {
        await this.buttonCPEN.click();
    }
    async clickTCRN() {
        await this.buttonTCRN.click();
    }
    async clickCFRN() {
        await this.buttonCFRN.click();
    }
    async clickCBRN() {
        await this.buttonCBRN.click();
    }

    async removeSubmittal(flow:string) {
        const flowTextMap: Record<string, string> = {
            CTRN: 'Certified Transport Registered',
            CBRN: 'Certified Burn Registered',
            CEN: 'Certified Emergency Nurse',
            CFRN: 'Certified Flight Registered',
            CPEN: 'Certified Pediatric Emergency',
            TCRN: 'Trauma Certified Registered'
          };
        
          // Ensure the flow is valid
          const flowText = flowTextMap[flow];
          if (!flowText) {
            throw new Error(`Invalid flow: ${flow}. Please provide a valid flow.`);
          }
        
          // Construct locators dynamically
          const buttonLocator = this.page.locator('li.cert-list-item').filter({ hasText: new RegExp(flowText) });
          const linkLocator = buttonLocator.locator('a');
        const certFlowStatus = await buttonLocator.innerText()
        .then(text => text.includes('Apply for Certification'));
        console.log(certFlowStatus);
      
      if (!certFlowStatus) {
        // Get the href attribute from the anchor tag
        const thisUrl = await linkLocator.getAttribute('href');
        console.log('Extracted URL:', thisUrl);
      
        if (thisUrl) {
          // Use a regular expression to extract two sequences of six digits
          const match = thisUrl.match(/(\d{6})\D+(\d{6})/);
      
          if (match) {
            const submittalNum = match[1];
            const workflowNum = match[2];
            console.log(`Submittal Number: ${submittalNum}`);
            console.log(`Workflow Number: ${workflowNum}`);
      
            // Navigate to the removal URL
            const removalUrl = `https://online.bcen.org/bcendevssa/acgiapps.cf_remove_submittal?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`;
            await this.page.goto(removalUrl);
      
            // Verify the submittal was removed
            await expect(this.page.locator('body')).toHaveText(`Submittal ${submittalNum} Removed`);
          } else {
            console.log('No matching sequences of six numbers found in the URL.');
          }
        } else {
          console.log('No URL found in the anchor tag.');
        }
    }
}
}


