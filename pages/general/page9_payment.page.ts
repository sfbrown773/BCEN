import { expect } from "@playwright/test";
import { Flow } from "../flows.page";

export class Payment extends Flow {
    public pagePath = `/`
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
    async selectCountry(value: string) {
        await this.country.click();
        await this.page.getByLabel('Country').selectOption(value);
    }
    async submitCardDetails() {
        await this.submitPaymentButton.click();
        
        const maxRetries = 10; // Maximum number of retries
        const interval = 1000; // Time between retries (1 second)
        let retries = 0;
    
        while (retries < maxRetries) {
            // Check if the 'Payment is processing' text is visible
            const processingTextVisible = await this.page.isVisible('text=Payment is processing');
            
            if (processingTextVisible) {
                // If the text is visible, wait a bit longer before checking again
                await this.page.waitForTimeout(interval);
            } else {
                // If the text is not visible, break the loop
                break;
            }
            
            retries++;
        }
    }
    

    async fillOutAndSubmitPayment({
        cardNum,
        cardName,
        cvv,
        address,
        zip,
        country,
        month,
        year
    }: {
        cardNum: string;
        cardName: string | undefined;
        cvv: string;
        address: string | undefined;
        zip: string | undefined;
        country?:any;
        month:string;
        year:string
    }) {
        await this.fillCardNumber(cardNum);
        await this.fillCVV(cvv);
        await this.selectCountry(country);
        await this.selectMonth(month);
        await this.selectYear(year);
        console.log(year)
        await this.page.waitForLoadState('load');
        if(cardName){        
        await this.fillNameOnCard(cardName);
        }
        if(address) {
            await this.fillStreetAddress(address);
        }
        if(zip) {
            await this.fillZipCode(zip);
        }

        await this.submitCardDetails();
        await this.page.waitForLoadState('networkidle');
    }
}