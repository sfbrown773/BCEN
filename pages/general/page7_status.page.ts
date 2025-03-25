import { expect } from "@playwright/test";
import { Flow } from "../flows.page";

export class Status extends Flow {
    public pagePath = `/`
    public checkoutButton = this.page.getByRole('link', { name: 'Checkout and Make Payment' });

    async clickCheckoutButton() {
        await this.page.waitForLoadState('load');
        await this.checkoutButton.click();
        await this.page.waitForLoadState('load');
       }
}