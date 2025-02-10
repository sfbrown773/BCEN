import { AppPage } from "./page.holder";
import { expect } from "@playwright/test";
import fs from 'fs';

export class Flow extends AppPage {

    //make this programmatic, fill the certName at the end of the pagePath
    public pagePath = `/`

    async visitCEN() {
        await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CEN', {
            waitUntil: 'load', // Wait until network activity has stopped
          });
    }
    async visitCBRN() {
        await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CBRN', {
            waitUntil: 'load', // Wait until network activity has stopped
          });
    }
    async visitCFRN() {
        await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CFRN', {
            waitUntil: 'load', // Wait until network activity has stopped
          });
    }
    async visitCPEN() {
        await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CPEN', {
            waitUntil: 'load', // Wait until network activity has stopped
          });
    }
    async visitCTRN() {
        await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=CTRN', {
            waitUntil: 'load', // Wait until network activity has stopped
          });
    }
    async visitTCRN() {
        await this.page.goto('https://online.bcen.org/bcendevssa/sbmssamysubmittals.wizstep1?p_cust_id=&p_collection_id=INITIAL_APP&p_subcollection_cd=TCRN', {
            waitUntil: 'load', // Wait until network activity has stopped
          });
    }

    public affirmCheckbox = this.page.getByLabel('I AFFIRM');
    public licenseNumber = this.page.getByLabel('Enter your United States or');
    public stateDropdown = this.page.locator('#aaAttrTy_RNSTATE_LOV');
    public internationalMessage = this.page.locator('#aaAttrTy_RNSTATE')
    public internationalInput = this.page.getByPlaceholder('Enter Country');
    public memberASTNAToggle = this.page.locator('#aaAttrTy_ASTNAMEMBER_LOV');
    public memberNumberASTNA = this.page.locator('#aaAttrty_ASTNAMEMBER input[name="f47"]');

    public memberABAToggle = this.page.locator('#aaAttrTy_ABAMEMBER_LOV');
    public memberNumberABA = this.page.locator('#aaAttrty_ABAMEMBER input[name="f47"]');

    public memberSTNToggle = this.page.locator('#aaAttrTy_STNMEMBER_LOV');
    public memberNumberSTN = this.page.locator('#aaAttrty_STNMEMBER input[name="f47"]');

    public memberENAToggle = this.page.locator('#aaAttrTy_ENAMEMBER_LOV');
    public memberNumberENA = this.page.locator('#aaAttrty_ENAMEMBER input[name="f47"]');
    public expirationDate = this.page.getByLabel('Expiration date of your');
    public noMilitaryDiscountRadio = this.page.locator('#aaAttrty_MILITARYDISCOUNT').getByText('No');
    public yesMilitaryDiscountRadio = this.page.locator('#aaAttrty_MILITARYDISCOUNT').getByText('Yes');
    public noExamAccomodations = this.page.locator('#aaAttrty_EXAMSPECACCOMM').getByText('No');
    public yesExamAccomodations = this.page.locator('#aaAttrty_EXAMSPECACCOMM').getByText('Yes');
    public acknowledgementsDiv = this.page.getByText('Candidate Acknowledgement Please acknowledge the following statements by');
    public pagination = this.page.locator('#workflowPagination');
    public nextButton = this.page.getByRole('link', { name: 'Next chevron_right' });
    public militaryDocUpload = this.page.getByText('Upload Military Documentation');
    public uploadMessage = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE div.aafileUploadMsg');
    public path = require('path');
    public filePath = this.path.resolve(__dirname, '../600.jpg');
    public fileInput = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE input[name="FILE"]');
    public deleteFile1 = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE #aaRemoveFileBtn');
    public file1NoFile = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE')
    public fileInput2 = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD2_FILE input[name="FILE"]');
    public deleteFile2 = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD2_FILE #aaRemoveFileBtn');
    public file2NoFile = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD2_FILE');
    public examAccommUpload = this.page.locator('#aaAttrty_TESTACCOMUPLOAD_FILE input[type="file"]');

    public fileInputIntlRN = this.page.locator('#aaAttrty_INTLDOCUPLOAD_FILE input[name="FILE"]');
    public deleteFileIntlRN = this.page.locator('#aaAttrty_INTLDOCUPLOAD_FILE #aaRemoveFileBtn');
    public uploadMessageIntlRN = this.page.locator('#aaAttrty_INTLDOCUPLOAD_FILE div.aafileUploadMsg');
    public submitIntlReview = this.page.getByRole('link', { name: 'Submit to Staff Review' });

    public accomUploadMessage = this.page.locator('#aaAttrty_TESTACCOMUPLOAD_FILE div.aafileUploadMsg');
    public accomNoFile = this.page.locator('#aaAttrty_TESTACCOMUPLOAD_FILE');
    public deleteExamAccom = this.page.getByLabel('Remove File');
    public militaryDocLeftBar = this.page.getByRole('link', { name: 'Military Discount Instructions' });
    public workflowTitle = this.page.locator('#workflowTitle');

    //error messages
    public rnLicenseError = this.page.locator('#aaAttrty_RNLICENSE div').nth(1);
    public rnStateError = this.page.locator('.aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner').first();
    public expirationError = this.page.locator('#aaAttrty_EXPIRATIONLICENSE div').nth(1);
    public abaMemberError = this.page.locator('#aaAttrty_ABAMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');
    public stnMemberError = this.page.locator('#aaAttrty_STNMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');
    public astnaMemberError = this.page.locator('#aaAttrty_ASTNAMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');
    public enaMemberError = this.page.locator('#aaAttrty_ENAMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');

    //TEST ASSURANCE
    public yesTestAssurance = this.page.locator('#aaAttrty_TESTASSURANCE li').filter({ hasText: 'Yes' });
    public noTestAssurance = this.page.locator('#aaAttrty_TESTASSURANCE li').filter({ hasText: 'No' });
    public assuranceError = this.page.locator('span.aaValidationTxt');
    public checkoutButton = this.page.getByRole('link', { name: 'Checkout and Make Payment' });
    public checkoutTable = this.page.getByRole('table');

    async clickYesTestAssurance() {
       await this.yesTestAssurance.click();
   }
   async clickNoTestAssurance() {
       await this.noTestAssurance.click();
   }
   async clickCheckoutButton() {
    await this.page.waitForLoadState('load');
    await this.checkoutButton.click();
    await this.page.waitForLoadState('load');
   }
   async clickCheckoutButtonRep() {
    await this.page.waitForLoadState('load');
    await this.checkoutButton.click();
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(500);


    for (let i = 0; i < 3; i++) {
        try {
            console.log(`Attempt ${i + 1}: Checking if checkout button is visible.`);
            
            // Wait for the button to be visible
            if (await this.checkoutButton.isVisible()) {
                console.log('Checkout button is visible, attempting to click...');
                
                // Click the button
                await this.checkoutButton.click();
                
                // Wait for the page to load and verify the workflow title
                await this.page.waitForLoadState('load');
                await expect(this.workflowTitle).toContainText(/Checkout and Make Payment/i);
                
                console.log('Successfully clicked the checkout button and verified workflow title.');
                return; // Exit the function if successful
            } else {
                console.log('Checkout button is not visible, reloading page...');
                await this.page.reload();
                await this.page.waitForLoadState('load');
            }
        } catch (error) {
            console.log(`Attempt ${i + 1} failed with error: ${error.message}`);
            console.log('Reloading page and retrying...');
            await this.page.reload();
            await this.page.waitForLoadState('load');
        }
    }

    // If we exit the loop without returning, all retries failed
    throw new Error('Failed to click checkout button or verify workflow title after 3 attempts.');
    
}


   //TEST ASSURANCE

    async checkAffirm(){
        await this.page.waitForLoadState('load');
        for (let i = 0; i < 3; i++) {
            try {
              if (await this.affirmCheckbox.isChecked()) {
                console.log('Checkbox is already checked.');
                break;
              }
              await this.affirmCheckbox.check();
              if (await this.affirmCheckbox.isChecked()) {
                console.log('Checkbox successfully checked.');
                break;
              }
            } catch (error) {
              console.warn(`Attempt ${i + 1} failed. Retrying...`);
              await this.page.waitForTimeout(500); // Small delay before retry
            }
          }
    }
    async fillLicenseNumber(numberRN:string) {
        await this.licenseNumber.fill(numberRN)
    }
    async selectState(state:string) {
        await this.stateDropdown.selectOption(state);
    }
    async fillIntlCountry(country:string) {
        await this.internationalInput.fill(country);
    }
    async selectMembershipABA(yesno:string) {
        await this.memberABAToggle.selectOption(yesno);
    }
    async selectMembershipSTN(yesno:string) {
        await this.memberSTNToggle.selectOption(yesno);
    }
    async selectMembershipASTNA(yesno:string) {
        await this.memberASTNAToggle.selectOption(yesno);
    }
    async selectMembershipENA(yesno:string) {
        await this.memberENAToggle.selectOption(yesno);
    }
    async fillMemberNumberABA(numberENA:string) {
        await this.memberNumberABA.fill(numberENA);
    }
    async fillMemberNumberENA(numberENA:string) {
        await this.memberNumberENA.fill(numberENA);
    }
    async fillMemberNumberSTN(numberENA:string) {
        await this.memberNumberSTN.fill(numberENA);
    }
    async fillMemberNumberASTNA(numberENA:string) {
        await this.memberNumberASTNA.fill(numberENA);
    }
    async fillExpirationDate() {
        const futureDate = await this.getOneMonthLaterDate(); 
        await this.expirationDate.fill(futureDate); 
      }
      
    async getOneMonthLaterDate() {
        const today = new Date();
        today.setMonth(today.getMonth() + 1); 
        const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits for date
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    }

    async toggleMembershipENA() {
        const selectedValue = await this.memberENAToggle.evaluate(select => {
         return (select as HTMLSelectElement).value;
        });
        console.log(selectedValue);

        if (selectedValue === 'Yes'){
            await expect(this.memberNumberENA).toBeVisible();
            await this.selectMembershipENA('No');
            await expect(this.memberNumberENA).toBeHidden();
        } else if (selectedValue === 'No' || selectedValue === '%null%') {
            await expect(this.memberNumberENA).toBeHidden();
            await this.selectMembershipENA('Yes');
            await expect(this.memberNumberENA).toBeVisible();
        }
    }
    async toggleMembershipASTNA() {
        const selectedValue = await this.memberASTNAToggle.evaluate(select => {
            return (select as HTMLSelectElement).value;
        });
        console.log(selectedValue);

        if (selectedValue === 'Yes'){
            await expect(this.memberNumberASTNA).toBeVisible();
            await this.selectMembershipASTNA('No');
            await expect(this.memberNumberASTNA).toBeHidden();
        } else if (selectedValue === 'No' || selectedValue === '%null%') {
            await expect(this.memberNumberASTNA).toBeHidden();
            await this.selectMembershipASTNA('Yes');
            await expect(this.memberNumberASTNA).toBeVisible();
        }
    }

    async toggleMembershipABA() {

        const selectedValue = await this.memberABAToggle.evaluate(select => {
            return (select as HTMLSelectElement).value;
        });
        console.log(selectedValue);
        if (selectedValue === 'Yes'){
            await expect(this.memberNumberABA).toBeVisible();
            await this.selectMembershipABA('No');
            await expect(this.memberNumberABA).toBeHidden();

        } else if (selectedValue === 'No' || selectedValue === '%null%') {
            await expect(this.memberNumberABA).toBeHidden();
            await this.selectMembershipABA('Yes');
            await expect(this.memberNumberABA).toBeVisible();
        }
    }
    async toggleMembershipSTN() {

        const selectedValue = await this.memberSTNToggle.evaluate(select => {
            return (select as HTMLSelectElement).value;
        });
        console.log(selectedValue);
        if (selectedValue === 'Yes'){
            await expect(this.memberNumberSTN).toBeVisible();
            await this.selectMembershipSTN('No');
            await expect(this.memberNumberSTN).toBeHidden();

        } else if (selectedValue === 'No' || selectedValue === '%null%') {
            await expect(this.memberNumberSTN).toBeHidden();
            await this.selectMembershipSTN('Yes');
            await expect(this.memberNumberSTN).toBeVisible();
        }
    }
    async clickNoMilDiscount() {
        await this.noMilitaryDiscountRadio.click();
    }
    async clickYesMilDiscount() {
        await this.yesMilitaryDiscountRadio.click();
    }
    async clickNoExamAccom() {
        await this.noExamAccomodations.click();
    }
    async clickYesExamAccom() {
        await this.yesExamAccomodations.click();
    }
    async checkAllAcknowBoxes() {
        await this.acknowledgementsDiv.evaluate(() => {
          const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')) as HTMLInputElement[]; 
          checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
          });
        });
      }
    async checkBoxesOneByOne() {
    // Locate all checkboxes within the acknowledgementsDiv
    const checkboxes = await this.acknowledgementsDiv.locator('input[type="checkbox"]');
    
    // Step 1: Check all checkboxes
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).check();
    }
    
    // Step 2: Verify the next button is visible after all checkboxes are checked
    await expect(this.nextButton).toBeVisible();
    
    // Step 3: Uncheck each checkbox one by one and verify the next button disappears
    for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).uncheck();
        await expect(this.nextButton).toBeHidden();
    
        // Step 4: Recheck the checkbox and verify the next button reappears
        await checkboxes.nth(i).check();
        await expect(this.nextButton).toBeVisible();
    }
    }
      
      
    async clickNext(/*expectedUrl: string*/) {
        await this.nextButton.click({ force: true });
    }
    async clickNextRep() {
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                console.log(`Attempt ${attempt + 1}: Clicking the button.`);
                
                // Add event listener for navigation
                const navigationPromise = this.page.waitForNavigation({
                    waitUntil: 'load',
                    timeout: 5000, // Set a reasonable timeout
                });
                //{ url: expectedUrl, timeout: 5000 }
                // Click the button
                await this.nextButton.click({ force: true });
                
                // Wait for navigation to occur
                await navigationPromise;
                console.log('Navigation successful after button click.');
                return; // Exit on success
            } catch (error) {
                console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
                if (attempt < 2) { // Only retry if not on the last attempt
                    console.log('Retrying...');
                    if (this.page && !this.page.isClosed()) {
                        await this.page.reload();
                        await this.page.waitForLoadState('load');
                    } else {
                        console.error('Page is closed; cannot reload.');
                        throw new Error('Page was closed during retry attempts.');
                    }
                } else {
                    console.log('Max attempts reached. Throwing error.');
                    throw new Error('Failed to navigate after 3 attempts.');
                }
            }
        }
    }

    async clearCheckout() {
        // Get all rows with the desired structure
        const deleteButtons = this.page.getByRole('link', { name: '' });
      
        // Iterate through each row
        const buttonCount = await deleteButtons.count();
        for (let i = 0; i < buttonCount; i++) {
          const deleteLink = deleteButtons.nth(i);
      
          // Attach a one-time event listener to handle the dialog
          this.page.once('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept(); // Accept the dialog
          });
      
          // Click the delete link
          await deleteLink.click();
        }
      };
    
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
    async fillOutYesMil() {
        await this.checkAffirm();
        await this.checkAllAcknowBoxes();
        await this.clickNoExamAccom();
        await this.clickYesMilDiscount();
        await this.fillLicenseNumber('1234');
        await this.fillExpirationDate();
        await this.selectState('IL');
        const submittalURL = this.page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cbrn-url.json', JSON.stringify(submittalURL));
    }

            async fillOutYesMil_CEN() {
                await this.fillOutYesMil();
                await this.selectMembershipENA('No');

                await this.clickNext();
            }
            async fillOutYesMil_CFRN() {
                await this.fillOutYesMil();
                await this.selectMembershipASTNA('No');

                await this.clickNext();
            }
            async fillOutYesMil_CPEN() {
                await this.fillOutYesMil();
                await this.selectMembershipASTNA('No');


                await this.clickNext();
            }
            async fillOutYesMil_CTRN() {
                await this.fillOutYesMil();
                await this.selectMembershipASTNA('No');


                await this.clickNext();
            }
            async fillOutYesMil_TCRN() {
                await this.fillOutYesMil();
                await this.selectMembershipSTN('No');


                await this.clickNext();
            }
            async fillOutYesMil_CBRN() {
                await this.fillOutYesMil();
                await this.selectMembershipABA('No');


                await this.clickNext();
            }
    async fillOutYesAccom() {
        await this.checkAffirm();
        await this.checkAllAcknowBoxes();
        await this.clickYesExamAccom();
        await this.clickNoMilDiscount();
        await this.fillLicenseNumber('1234');
        await this.fillExpirationDate();
        await this.selectState('IL');

        const submittalURL = this.page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cbrn-url.json', JSON.stringify(submittalURL));
    }
            async fillOutYesAccom_CEN() {
                await this.fillOutYesAccom();
                await this.selectMembershipENA('No');

                await this.clickNext();
            }
            async fillOutYesAccom_CFRN() {
                await this.fillOutYesAccom();
                await this.selectMembershipASTNA('No');

                await this.clickNext();
            }
            async fillOutYesAccom_CPEN() {
                await this.fillOutYesAccom();
                await this.selectMembershipASTNA('No');


                await this.clickNext();
            }
            async fillOutYesAccom_CTRN() {
                await this.fillOutYesAccom();
                await this.selectMembershipASTNA('No');


                await this.clickNext();
            }
            async fillOutYesAccom_TCRN() {
                await this.fillOutYesAccom();
                await this.selectMembershipSTN('No');


                await this.clickNext();
            }
            async fillOutYesAccom_CBRN() {
                await this.fillOutYesAccom();
                await this.selectMembershipABA('No');


                await this.clickNext();
            }
    async fillOutExamInfo() {
        await this.checkAffirm();
        await this.checkAllAcknowBoxes();
        await this.clickNoExamAccom();
        await this.clickNoMilDiscount();
        await this.fillLicenseNumber('1234');
        await this.fillExpirationDate();
        await this.selectState('IL');
    }
            async fillOutExamInfo_CBRN() {
                await this.fillOutExamInfo();
                await this.selectMembershipABA('No');
            }
            async fillOutExamInfo_CEN() {
                await this.fillOutExamInfo();
                await this.selectMembershipENA('No');
            }
            async fillOutExamInfo_CFRN() {
                await this.fillOutExamInfo();
                await this.selectMembershipASTNA('No');
            }
            async fillOutExamInfo_CPEN() {
                await this.fillOutExamInfo();
                await this.selectMembershipASTNA('No');
            }
            async fillOutExamInfo_CTRN() {
                await this.fillOutExamInfo();
                await this.selectMembershipASTNA('No');
            }
            async fillOutExamInfo_TCRN() {
                await this.fillOutExamInfo();
                await this.selectMembershipSTN('No');
            }

public examAccommLeftBar = this.page.getByRole('link', { name: 'Exam Accommodation Request' });
public mobileDropdown = this.page.locator('#wizard-steps-dropdown');
public examAccomHeading = this.page.getByRole('heading', { name: 'Exam Accommodation Request' }).locator('span');
public voucherErrorPopup = this.page.getByText('Error Using Voucher');
public closeButtonVoucherPopup = this.page.getByRole('button', { name: ' Close' });
public addVoucherButton = this.page.getByRole('button', { name: 'Add' });
public checkoutItem = this.page.getByRole('cell', { name: 'CEN Initial Exam' });
public paymentOptions = this.page.getByLabel('Payment Options');
public creditCardOptions = this.page.getByLabel('Payment Type *');
public recaptchaDiv = this.page.locator('#aaReCaptchaDiv');
public submitButton = this.page.getByLabel('Use A New Payment Type').getByRole('button', { name: 'Submit' });
public submitCheckButton = this.page.getByRole('button', { name: 'Check (organizations only)' });
public priceNoMemYesAssur = '450.00';
public priceNoMemNoAssur = '380.00';
public priceYesMemYesAssur = '355.00';
public priceYesMemNoAssur_CEN = '240.00';
public priceYesMemNoAssur_others = '285.00';
public priceYesMilYesAssur = '265.00';
public priceYesMilNoASsur = '195.00';


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
async clickAddVoucher() {
    await this.addVoucherButton.click();
}
async selectPaymentOption(option:string) {
    await this.paymentOptions.selectOption(option);
   }
   async selectCreditCard(option:string) {
    await this.creditCardOptions.selectOption(option);
   }
async clickCloseVoucherError() {
    await this.closeButtonVoucherPopup.click();
}
async clickSubmitCheckout() {
    await this.submitButton.click();
}
async clickSubmitCheck() {
    await this.submitCheckButton.click();
}

//payment

public nameOnCard = this.page.getByLabel('Name On Card');
public cardNumber = this.page.locator('#fullsteam-hosted-card-number-frame').contentFrame().locator('#card-number')
public month = this.page.locator('#fullsteam-hosted-expiration-month-frame').contentFrame().locator('#expiration-month')
public year = this.page.locator('#fullsteam-hosted-expiration-year-frame').contentFrame().locator('#expiration-year')
public cvv = this.page.locator('#fullsteam-hosted-cvv-frame').contentFrame().locator('#cvv')
public streetAddress = this.page.getByLabel('Street Address');
public postalCode = this.page.getByLabel('Postal Code');
public country = this.page.getByLabel('Country');
public submitPaymentButton = this.page.locator('#submitButton');
public cancelButton = this.page.getByRole('link', { name: 'Cancel'});
public nameError = this.page.locator('#NameOnCard-error');
//The Name On Card field is required.
public cardNumError = this.page.locator('span[id="fullsteam-hosted-card-number-error"]');
//The Card Number field is invalid.
public cvvError = this.page.locator('span[id="fullsteam-hosted-cvv-error"]');
//The CVV field is invalid.
public monthError = this.page.locator('span[id="fullsteam-hosted-expiration-month-error"]');
//The Exp Month field is required.
public yearError = this.page.locator('span[id="fullsteam-hosted-expiration-year-error"]');
//The Exp Year field is required.
public addressError = this.page.locator('#StreetAddress-error');
//The Street Address is required.
public zipCodeError = this.page.locator('#Zip-error');
//The Postal Code field is required.
public countryError = this.page.locator('#Country-error');
//Country is required.

async fillNameOnCard(name:string) {
    await this.nameOnCard.fill(name);
}
async fillCardNumber(cardNum:string) {
    await this.cardNumber.fill(cardNum);
}
async selectMonth(month:string) {
    await this.month.selectOption(month);
}
async selectYear(year:string) {
    await this.year.selectOption(year);
}
async fillCVV(cvvNum:string) {
    await this.cvv.fill(cvvNum);
}
async fillStreetAddress(address:string) {
    await this.streetAddress.fill(address);
}
async fillZipCode(zip:string) {
    await this.postalCode.fill(zip);
}
async selectCountry({ value: string }) {
    await this.country.click();
    await this.country.selectOption({ value: string })
}
async submitCardDetails() {
    await this.submitPaymentButton.click();
}
}