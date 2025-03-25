import { expect } from "@playwright/test";
import { ExamInfo } from "../general/page1_examInfo.page";

export class CFRNExamInfo extends ExamInfo {
    public pagePath = `/`

    public memberASTNAToggle = this.page.locator('#aaAttrTy_ASTNAMEMBER_LOV');
    public memberNumberASTNA = this.page.locator('#aaAttrty_ASTNAMEMBER input[name="f47"]');

    public astnaMemberError = this.page.locator('#aaAttrty_ASTNAMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');

    async selectMembershipASTNA(yesno:string) {
        await this.memberASTNAToggle.selectOption(yesno);
        console.log('Selecting whether you are a member of the ASTNA');
    }
    async fillMemberNumberASTNA(numberASTNA:string) {
        await this.memberNumberASTNA.fill(numberASTNA);
        console.log('You have indicated that you are an ASTNA member. Entering your member number.');
    }  
    async toggleMembership() {
        const selectedValue = await this.memberASTNAToggle.evaluate(select => {
            return (select as HTMLSelectElement).value;
        });
        console.log('If membership is selected no, switching to yes and vice versa. Expecting the member number input to appear and disappear');

        if (selectedValue === 'Yes'){
            await expect(this.memberNumberASTNA).toBeVisible();
            await this.selectMembershipASTNA('No');
            await expect(this.memberNumberASTNA).toBeHidden();
        } else if (selectedValue === 'No' || selectedValue === '%null%') {
            await expect(this.memberNumberASTNA).toBeHidden();
            await this.selectMembershipASTNA('Yes');
            await expect(this.memberNumberASTNA).toBeVisible();
        }
    }
    async fillOutExamInfo_CFRN({
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
        await this.selectMembershipASTNA(membership);
        if (membership === 'Yes' && memberNumber) {
            await this.fillMemberNumberASTNA(memberNumber);
        }
    }
    async checkErrorMessages() {
        await this.licenseNumberber.fill('');
        await this.selectState('Select One');
        await this.expirationDate.fill('');
        await this.selectMembershipASTNA('Select One');
        await this.requestMilDiscount(false);
        await expect(this.rnLicenseError).toBeVisible();
        await expect(this.rnStateError).toBeVisible();
        await expect(this.expirationError).toBeVisible();
        await expect(this.astnaMemberError).toBeVisible();
    }
}