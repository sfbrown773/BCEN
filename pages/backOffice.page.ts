import { AppPage } from "./page.holder";
import { expect } from "@playwright/test";

export class BackOffice extends AppPage {
    public pagePath = '/'
    public logoutDropdown = this.page.locator('#n2-user-menu-button')
    public recentsButton = this.page.locator('#toggle-recents-menu')
    public johnetteAccount = this.page.getByRole('link', { name: 'badge Johnette K Bennage' });
    public fernandoAccount = this.page.getByRole('link', { name: 'badge Fernando Antonio Chila' });
    //here we go to a different page, so this should technically be a different page
    public loginAsCust = this.page.getByText('Login as this Customer');
    public myAccount = this.page.getByText('My Account');
    

   async visit(){
    await this.page.goto('https://dbrown:Catalyst1@online.bcen.org/bcendev/home', {
        waitUntil: 'load', // Wait until network activity has stopped
      })
   }

   async clickRecentsButton(){
        await this.recentsButton.click()
    }

    async clickLoginAsCust(){
        await this.loginAsCust.click();
    }

    async clickJohnetteAccount(){
        await this.johnetteAccount.click()
    }

    async clickFernandoAccount(){
        await this.fernandoAccount.click()
    }

    async clickMyAccount(){
        await this.myAccount.click()
    }

    async setUsernameFilled(email:string){
       // await this.userName.type(email);
    }  
    async removeSubmittal() {
    // Launch the browser and create a new page
    const thisUrl = this.page.url();
    // Use a regular expression to find two sequences of exactly six digits
    const match = thisUrl.match(/(\d{6})\D+(\d{6})/);
    console.log(match);

    if (match) {
    const submittalNum = match[1];
    const workflowNum = match[2];
    console.log(`Submittal Number: ${submittalNum}`);
    console.log(`Workflow Number: ${workflowNum}`);
    await this.page.goto(`https://online.bcen.org/bcendevssa/acgiapps.cf_remove_submittal?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
    await expect(this.page.locator('body')).toHaveText(`Submittal ${submittalNum} Removed`);
    } else {
    console.log('No matching sequences of six numbers found in the URL.');
    }
    }
}


