import { AppPage } from "./page.holder";

export class LandingPage extends AppPage {
    public pagePath = '/'
    public myAccountLink = this.page.getByText('My Account');

    async clickMyAccount(){
        await this.myAccountLink.click()
    }   
}