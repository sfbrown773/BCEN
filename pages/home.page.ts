import { AppPage } from "./page.holder";
import { expect } from "@playwright/test";
import { BackOffice } from "./backOffice.page";
import { Flow } from "./flows.page";
import { Checkout } from "./general/page8_checkout.page";

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
        async visitCEN() {
            await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CEN', {
                waitUntil: 'load', // Wait until network activity has stopped
            });
        }
        async visitCBRN() {
            await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CBRN', {
                waitUntil: 'load', // Wait until network activity has stopped
            });
            await this.page.waitForLoadState('networkidle');
        }
        
        async visitCFRN() {
            await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CFRN', {
                waitUntil: 'load', // Wait until network activity has stopped
            });
            await this.page.waitForLoadState('networkidle');
        }
        async visitCPEN() {
            await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CPEN', {
                waitUntil: 'load', // Wait until network activity has stopped
            });
            await this.page.waitForLoadState('networkidle');
        }
        async visitCTRN() {
            await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CTRN', {
                waitUntil: 'load', // Wait until network activity has stopped
            });
            await this.page.waitForLoadState('networkidle');
        }
        async visitTCRN() {
            await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=TCRN', {
                waitUntil: 'load', // Wait until network activity has stopped
            });
            await this.page.waitForLoadState('networkidle');
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
    async delayedClick(locator, options = {}) {
        const defaultOptions = {
            delay: 70, // Default delay for click
            ...options, // Merge any additional options
        };
        await locator.click(defaultOptions);
    }
    async clearCheckoutAtStart() {
        const visible = await this.page.locator('#header-cart').isVisible();
        if (await visible === true) {
          await this.page.getByRole('link', { name: '' }).click();
          const checkout = new Checkout(this.page);
          await expect(checkout.addVoucherButton).toBeVisible();
          await checkout.clearCheckout();
        }
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
        await this.page.waitForTimeout(500)
        // Construct locators dynamically
        const buttonLocator = this.page.locator('li.cert-list-item').filter({ hasText: new RegExp(flowText) });
        const certFlowStatus = await buttonLocator.innerText();
        console.log(certFlowStatus);

        if (certFlowStatus.includes('Recertify')) {
            await this.removeSubmittalCertified();    
        } else if (!certFlowStatus.includes('Apply for Certification')) {
            // If it's not "Apply for Certification", check if it's "SCHEDULE/MANAGE EXAM"
            const linkLocator = buttonLocator.locator('a');
            const thisUrl = await linkLocator.getAttribute('href');
            console.log('Extracted URL:', thisUrl);
  
            let submittalNum: string | undefined;
            let workflowNum: string | undefined;
  //This next url is what displays when application is in EXAM_AUTH, with SSA MESSAGE SCHEDULE/MANAGE EXAM
            if (thisUrl === 'f?p=700:130') {
                await this.removeSubmittalExamAuth();
            } else {
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
                            //https://online.bcen.org/bcendevssa/f?p=STDSSA:998:15824530224203::::P0_SUBMITTAL_SERNO,G_WKF_FL,G_WKF_SERNO,G_WKF_TRANS_VERB,CUST_CONTEXT,P0_CONTEXT_HEADER_CD:462488,Y,629788,INTLREVIEW,INTL_RN_STAFF_REVIEW,SBM
                            //https://online.bcen.org/bcendevssa/acgiapps.cf_remove_submittal?p_submittal_serno=462488&p_wkf_serno=629788
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
    async removeSubmittalExamAuth() {

        const backOffice = new BackOffice(this.page);
        await backOffice.visitJohnetteAccount();
        await this.page.getByRole('link', { name: 'My Submittals Combined' }).click();

        const frame = await this.page.frameLocator('iframe').first();
        await this.page.waitForLoadState('networkidle');
        await frame.getByRole('link', { name: 'Application Created On' }).click();
        await frame.getByRole('button', { name: '' }).click();
        
          const statusCell = await frame.getByText('EXAM_AUTH').first();

          await statusCell.evaluate(node => node.style.border = '3px solid red');
          const row = await statusCell.locator('xpath=ancestor::tr'); 
          const linkCell = row.locator('xpath=td[a]').first();
          await linkCell.evaluate(node => node.style.border = '3px solid red');
          await linkCell.locator('a').click();
          await this.page.waitForLoadState('networkidle');
          //see if you can just push it to expired, like if that is a standard option
          await this.page.getByRole('link', { name: 'Staff - Delete PSI' }).click();//locator('#iframe_51000001261').contentFrame().
          await expect(this.page.getByRole('link', { name: 'Staff > Auth Deleted >' })).toBeVisible();//locator('#iframe_51000001261').contentFrame().
          await this.page.getByRole('link', { name: 'Staff > Auth Deleted >' }).click();//locator('#iframe_51000001261').contentFrame().
          await expect(this.page.locator('#aaSbmHeaderSubmittalStatus')).toContainText('Status: Candidate Requested Close');
    }
    async removeSubmittalCertified() {
        //This test contains two branches to handle the iframe in the back office, which does not always display, causing flakiness
        const backOffice = new BackOffice(this.page);
            await backOffice.visitUserAccount();
            await this.page.getByRole('link', { name: 'Certifications Held' }).click();

            const iframeLocator = this.page.frameLocator('iframe').first();

            const frame = await this.page.locator('iframe').contentFrame();

            await frame.getByRole('link', { name: 'Details' }).nth(1).click({delay:70});
            await this.page.waitForLoadState('networkidle');
            await frame.getByRole('row', { name: 'Update Certified' }).getByRole('link').click({delay:70});

            /*if (iframeLocator) {
                const frame = await this.page.locator('iframe').contentFrame();          
    
                await frame.getByRole('link', { name: 'Apply For a New Certificate' }).click({delay:70});
                await frame.getByRole('link', { name: 'Certified Burn Registered' }).click({delay:70});
                //await this.page.locator('#selLDS_chzn_o_2').click();
                //await frame.locator('option:nth-child(3)').click();
                await frame.getByRole('list').getByText(/Expired/i).click();
                await frame.getByRole('button', { name: 'Continue' }).click({delay:70});
                await frame.getByRole('button', { name: 'Submit' }).click({delay:70});
                await this.page.waitForLoadState('networkidle');
            } else {*/
                await this.page.getByRole('link', { name: 'Apply For a New Certificate' }).click({delay:70});
                await this.page.getByRole('link', { name: 'Certified Burn Registered' }).click({delay:70});
                //await this.page.locator('#selLDS_chzn_o_2').click();
                //await frame.locator('option:nth-child(3)').click();
                await this.page.getByRole('list').getByText(/Burn Registered Nurse - Expired/i).click();
                await this.page.getByRole('button', { name: 'Continue' }).click({delay:70});
                await this.page.getByRole('button', { name: 'Submit' }).click({delay:70});
                await this.page.waitForLoadState('networkidle');
            /*}*/
    }
    
  }
  
  
  