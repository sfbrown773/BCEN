import { AppPage } from "./page.holder";

export class HomePage extends AppPage {
    public pagePath = '/'
//locators
    public buttonCEN = this.page.locator('ul').locator('li:has-text("Certified Emergency Nurse")').locator('~ li').last();
    //this.page.getByText('Certified Emergency Nurse');
    public buttonCTRN = this.page.getByText('Certified Transport');
    public buttonCPEN = this.page.getByText('Certified Pediatric Emergency');
    public buttonTCRN = this.page.getByText('Trauma Certified Registered');
    public buttonCFRN = this.page.getByText('Certified Flight Registered');
    public buttonCBRN = this.page.getByText('Certified Burn Registered');
    public loggedIn = this.page.locator('#BCEN_LOGGED_IN_USER');
//methods
    async visit() {
        await this.page.goto('https://online.bcen.org/bcendevssa/f?p=700:2222:7932820419680:');
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
}


