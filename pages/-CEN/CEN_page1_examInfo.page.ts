import { expect } from "@playwright/test";
import { ExamInfo } from "../general/page1_examInfo.page";

export class CENExamInfo extends ExamInfo {
    public pagePath = `/`

    public memberENAToggle = this.page.locator('#aaAttrTy_ENAMEMBER_LOV');
    public memberNumberENA = this.page.locator('#aaAttrty_ENAMEMBER input[name="f47"]');

    public enaMemberError = this.page.locator('#aaAttrty_ENAMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');

    async selectMembershipENA(yesno:string) {
        await this.memberENAToggle.selectOption(yesno);
        console.log('Selecting whether you are a member of the ENA');
    }
    async fillMemberNumberENA(numberENA:string) {
        await this.memberNumberENA.fill(numberENA);
        console.log('You have indicated that you are an ENA member. Entering your member number.');
    }    
    async toggleMembership() {
        const selectedValue = await this.memberENAToggle.evaluate(select => {
         return (select as HTMLSelectElement).value;
        });
        console.log('If membership is selected no, switching to yes and vice versa. Expecting the member number input to appear and disappear');

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
    async fillOutExamInfo_CEN({
        accommodationRequest,
        militaryStatusRequest,
        licenseNumber,
        state,
        country, //optional paramter
        membership,
        memberNumber
    }: {
        accommodationRequest: boolean;
        militaryStatusRequest: boolean;
        licenseNumber: string;
        state: string;
        country?: string;
        membership: string;
        memberNumber?: string
    }) {
        await this.fillOutExamInfo({
            accommodationRequest,
            militaryStatusRequest,
            licenseNumber,
            state,
            country
        });
        await this.selectMembershipENA(membership);
        if (membership === 'Yes' && memberNumber) {
            await this.fillMemberNumberENA(memberNumber);
        }
    }
    async checkErrorMessages() {
        await this.licenseNumberber.fill('');
        await this.selectState('Select One');
        await this.expirationDate.fill('');
        await this.selectMembershipENA('Select One');
        await this.requestMilDiscount(false);
        await expect(this.rnLicenseError).toBeVisible();
        await expect(this.rnStateError).toBeVisible();
        await expect(this.expirationError).toBeVisible();
        await expect(this.enaMemberError).toBeVisible();
    }
}