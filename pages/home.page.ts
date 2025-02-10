import { AppPage } from "./page.holder";
import { expect } from "@playwright/test";
import { BackOffice } from "./backOffice.page";

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

    async removeSubmittal(flow: string) {
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
      await this.page.waitForLoadState('networkidle');
      // Construct locators dynamically
      const buttonLocator = this.page.locator('li.cert-list-item').filter({ hasText: new RegExp(flowText) });
      const linkLocator = buttonLocator.locator('a');
      
      const certFlowStatus = await buttonLocator.innerText();
      console.log(certFlowStatus);
      if (!certFlowStatus.includes('Apply for Certification')) {
          // If it's not "Apply for Certification", check if it's "SCHEDULE/MANAGE EXAM"
          if (/SCHEDULE\/MANAGE EXAM/i.test(certFlowStatus)) { //replacement for certFlowStatus.includes('SCHEDULE/MANAGE EXAM') b/c it's a regular expression
              // Follow the EXAM_AUTH process
              const backOffice = new BackOffice(this.page);
              await backOffice.visit();
              await backOffice.clickRecentsButton();
              await backOffice.clickJohnetteAccount();
              await this.page.getByRole('link', { name: 'My Submittals Combined' }).click();
  
              const frame = await this.page.frameLocator('iframe').first();
              /*await frame.getByRole('link', { name: 'Status', exact: true }).click();
              await frame.getByRole('link', { name: 'EXAM_AUTH' }).click();*/
              
                const statusCell = await frame.getByText('EXAM_AUTH').first();

                await statusCell.evaluate(node => node.style.border = '3px solid red');
                const row = await statusCell.locator('xpath=ancestor::tr'); // Use XPath to find the <tr> ancestor
                // Find the cell in the same row that contains "Military_Review"
                const linkCell = row.locator('xpath=td[a]').first();
                console.log(linkCell);
                await linkCell.evaluate(node => node.style.border = '3px solid red');
                await linkCell.locator('a').click();
              /*const cells = frame.locator('td[class=" u-tL"]').getByRole('link').first();
              await cells.evaluate(node => node.style.border = '3px solid red');
              const cellCount = await cells.count();
              for (let i = 0; i < cellCount; i++) {
                const cell = cells.nth(i);  // Access each link cell by its index
                await cell.click();  // Click the link*/
                await this.page.getByRole('link', { name: 'Staff - Delete PSI' }).click();
                await expect(this.page.getByRole('link', { name: 'Staff > Auth Deleted >' })).toBeVisible();
                await this.page.getByRole('link', { name: 'Staff > Auth Deleted >' }).click();
                await expect(this.page.locator('#aaSbmHeaderSubmittalStatus')).toContainText('Status: Candidate Requested Close');
          } else {
              // Default to the other method
              const thisUrl = await linkLocator.getAttribute('href');
              console.log('Extracted URL:', thisUrl);

              let submittalNum: string | undefined;
              let workflowNum: string | undefined;
              
              if (thisUrl) {
                  // Extract only the value after `p_itemvalues=`
                  const match = thisUrl.match(/p_itemvalues=([^&]+)/);
              
                  if (match) {
                      // Split values by comma
                      const values = match[1].split(',');
              
                      // Extract the first two valid six-digit numbers
                      const sixDigitNumbers = values.filter(num => /^\d{6}$/.test(num));
              
                      if (sixDigitNumbers.length >= 2) {
                          submittalNum = sixDigitNumbers[0];  // First six-digit number
                          workflowNum = sixDigitNumbers[1]; 
                        }
                    }                // Case 2: If no `p_itemvalues`, try `P_SUBMITTAL_SERNO` and `P_WKF_SERNO`
                    if (!submittalNum || !workflowNum) {
                        const paramMatch = thisUrl.match(/P_SUBMITTAL_SERNO=(\d{6})&P_WKF_SERNO=(\d{6})/i);
    
                        if (paramMatch) {
                            submittalNum = paramMatch[1];
                            workflowNum = paramMatch[2];
                        }
                    }
    
                    if (submittalNum && workflowNum) {
                          console.log(`Submittal Number: ${submittalNum}`);
                          console.log(`Workflow Number: ${workflowNum}`);
                          
                          // Navigate to the removal URL
                          const removalUrl = `https://online.bcen.org/bcendevssa/acgiapps.cf_remove_submittal?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`;
                          await this.page.goto(removalUrl);
                          await expect(this.page.locator('body')).toHaveText(`Submittal ${submittalNum} Removed`);
                      } else {
                          console.log('Not enough valid six-digit numbers found in p_itemvalues.');
                      }
                  } else {
                      console.log('p_itemvalues parameter not found in the URL.');
                  }
              
          } 
      } else {
        console.log('No URL found in the anchor tag.');
    }
  }
  
}


