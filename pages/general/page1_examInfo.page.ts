import { expect } from "@playwright/test";
import fs from 'fs';
import { Flow } from "../flows.page";

export class ExamInfo extends Flow {
    public pagePath = `/`


    public affirmCheckbox = this.page.getByLabel('I AFFIRM');
    public licenseNumberber = this.page.getByLabel('Enter your United States or');
    public stateDropdown = this.page.locator('#aaAttrTy_RNSTATE_LOV');
    public internationalMessage = this.page.locator('#aaAttrTy_RNSTATE')
    public internationalInput = this.page.getByPlaceholder('Enter Country');
    public expirationDate = this.page.getByLabel('Expiration date of your');
    public noMilitaryDiscountRadio = this.page.locator('#aaAttrty_MILITARYDISCOUNT').getByText('No');
    public yesMilitaryDiscountRadio = this.page.locator('#aaAttrty_MILITARYDISCOUNT').getByText('Yes');
    public noExamAccomodations = this.page.locator('#aaAttrty_EXAMSPECACCOMM').getByText('No');
    public yesExamAccomodations = this.page.locator('#aaAttrty_EXAMSPECACCOMM').getByText('Yes');
    public acknowledgementsDiv = this.page.getByText('Candidate Acknowledgement Please acknowledge the following statements by');


    public rnLicenseError = this.page.locator('#aaAttrty_RNLICENSE div').nth(1);
    public intlRNMessage = this.page.locator('#aaAttrty_RNSTATE');
    public rnStateError = this.page.locator('.aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner').first();
    public expirationError = this.page.locator('#aaAttrty_EXPIRATIONLICENSE div').nth(1);

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
                console.log('Checking affirm.');
                break;
              }
            } catch (error) {
              console.warn(`Attempt ${i + 1} to check Affirm failed. Retrying...`);
              await this.page.waitForTimeout(500); // Small delay before retry
            }
          }
    }
    async filllicenseNumberber(numberRN:string) {
        await this.licenseNumberber.fill(numberRN)
        console.log('Filling RN License number.')
    }
    async selectState(state:string) {
        await this.stateDropdown.selectOption(state);
        console.log('Selecting state where candidate is registered.')
    }
    async fillIntlCountry(country:string) {
        await this.internationalInput.fill(country);
        console.log('You have selected International in the State dropdown. Writing in the country where you are registered.')
    }
    async fillExpirationDateOneMonthLater() {
        const futureDate = await this.getOneMonthLaterDate(); 
        await this.expirationDate.fill(futureDate); 
        console.log('Automatically filling in license expiration date with a date one month in the future.');
      }
      
    async getOneMonthLaterDate() {
        const today = new Date();
        today.setMonth(today.getMonth() + 1); 
        const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits for date
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    }
    async requestMilDiscount(choice:boolean) {
        if (choice) {
            await this.yesMilitaryDiscountRadio.click();
            console.log('Indicating that you are eligible for military discount');

        } else if (!choice) {
            await this.noMilitaryDiscountRadio.click();
            console.log('Indicating that you are not eligible for military discount.');
        } else {
            throw new Error('This is a boolean variable. Choose true or false')
        }
    }
    async requestExamAccom(choice:boolean) {
        if (choice) {
            await this.yesExamAccomodations.click();
            console.log('Indicating that you are eligible for exam accommodations');

        } else if (!choice) {
            await this.noExamAccomodations.click();
            console.log('Indicating that you are not eligible for exam accommodations.');
        } else {
            throw new Error('This is a boolean variable. Choose true or false')
        }
    }
    async checkAllAcknowBoxes() {
        await this.acknowledgementsDiv.evaluate(() => {
          const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')) as HTMLInputElement[]; 
          checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
          });
        });
        console.log('Checking all the acknowledgment boxes.')
      }
    async checkBoxesOneByOne() {
    // Locate all checkboxes within the acknowledgementsDiv
        const checkboxes = await this.acknowledgementsDiv.locator('input[type="checkbox"]');
        console.log('Checking and unchecking all the acknowledgment boxes - expect the Next button to be visible only when all boxes are checked')
        
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

    async fillOutExamInfo({
        accommodationRequest,
        militaryStatusRequest,
        licenseNumber,
        state,
        country //optional paramter
    }: {
        accommodationRequest: boolean;
        militaryStatusRequest: boolean;
        licenseNumber: string;
        state: string;
        country?: string;
    }) {
        await this.checkAffirm();
        await this.checkAllAcknowBoxes();
        await this.requestExamAccom(accommodationRequest);//boolean
        await this.requestMilDiscount(militaryStatusRequest);//boolean
        await this.filllicenseNumberber(licenseNumber);//string
        await this.fillExpirationDateOneMonthLater();
        await this.selectState(state);//string
        if (state === 'International' && country) {
            await this.fillIntlCountry(country);
        }
    }
}