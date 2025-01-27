import { AppPage } from "./page.holder";

export class BackOffice extends AppPage {
    public pagePath = '/'
    public logoutDropdown = this.page.locator('#n2-user-menu-button')
    public recentsButton = this.page.locator('#toggle-recents-menu')
    public johnetteAccount = this.page.getByRole('link', { name: 'badge Johnette K Bennage' });
    //here we go to a different page, so this should technically be a different page
    public loginAsCust = this.page.getByText('Login as this Customer');
    public myAccount = this.page.getByText('My Account');
    

   async visit(){
    await this.page.goto('https://dbrown:Catalyst1@online.bcen.org/bcendev/home')
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

    async clickMyAccount(){
        await this.myAccount.click()
    }

    async setUsernameFilled(email:string){
       // await this.userName.type(email);
    }    
}


