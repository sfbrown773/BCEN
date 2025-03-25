import { expect } from "@playwright/test";
import { ExamInfo } from "../general/page1_examInfo.page";

export class TCRNExamInfo extends ExamInfo {
    public pagePath = `/`

    public memberSTNToggle = this.page.locator('#aaAttrTy_STNMEMBER_LOV');
    public memberNumberSTN = this.page.locator('#aaAttrty_STNMEMBER input[name="f47"]');

    public stnMemberError = this.page.locator('#aaAttrty_STNMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');

    async selectMembershipSTN(yesno:string) {
        await this.memberSTNToggle.selectOption(yesno);
        console.log('Selecting whether you are a member of the STN');
    }
    async fillMemberNumberSTN(numberSTN:string) {
        await this.memberNumberSTN.fill(numberSTN);
        console.log('You have indicated that you are an STN member. Entering your member number.');
    }  
    async toggleMembership() {

        const selectedValue = await this.memberSTNToggle.evaluate(select => {
            return (select as HTMLSelectElement).value;
        });
        console.log('If membership is selected no, switching to yes and vice verse. Expecting the member number input to appear and disappear');
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
    async fillOutExamInfo_TCRN({
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
        await this.selectMembershipSTN(membership);
        if (membership === 'Yes' && memberNumber) {
            await this.fillMemberNumberSTN(memberNumber);
        }
    }
    async checkErrorMessages() {
        await this.licenseNumberber.fill('');
        await this.selectState('Select One');
        await this.expirationDate.fill('');
        await this.selectMembershipSTN('Select One');
        await this.requestMilDiscount(false);
        await expect(this.rnLicenseError).toBeVisible();
        await expect(this.rnStateError).toBeVisible();
        await expect(this.expirationError).toBeVisible();
        await expect(this.stnMemberError).toBeVisible();
    }
}