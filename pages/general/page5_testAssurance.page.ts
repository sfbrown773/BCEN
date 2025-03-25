import { expect } from "@playwright/test";
import { Flow } from "../flows.page";

export class TestAssurance extends Flow {
    public pagePath = `/`

    public yesTestAssurance = this.page.locator('#aaAttrty_TESTASSURANCE li').filter({ hasText: 'Yes' });
    public noTestAssurance = this.page.locator('#aaAttrty_TESTASSURANCE li').filter({ hasText: 'No' });
    public assuranceError = this.page.locator('span.aaValidationTxt');

    async selectTestAssurance(truefalse:boolean) {
        if(truefalse){
            await this.yesTestAssurance.click();
        } else if (!truefalse) {
            await this.noTestAssurance.click();
        } else {
            throw new Error('This function takes a boolean value. Choose true or false.')
        }
    }
}