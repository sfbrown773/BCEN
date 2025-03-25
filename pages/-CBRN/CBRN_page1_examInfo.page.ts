import { expect } from "@playwright/test";
import { ExamInfo } from "../general/page1_examInfo.page";

export class CBRNExamInfo extends ExamInfo {
    public pagePath = `/`

    public memberABAToggle = this.page.locator('#aaAttrTy_ABAMEMBER_LOV');
    public memberNumberABA = this.page.locator('#aaAttrty_ABAMEMBER input[name="f47"]');

    public abaMemberError = this.page.locator('#aaAttrty_ABAMEMBER > .aaAttrGroupError > .aaInlineValidationWrapper > .aaValidationWrapper-Inner');

    async selectMembershipABA(yesno:string) {
        await this.memberABAToggle.selectOption(yesno);
        console.log('Selecting whether you are a member of the ABA')
    }
    async fillMemberNumberABA(numberABA:string) {
        await this.memberNumberABA.fill(numberABA);
        console.log('You have indicated that you are an ABA member. Entering your member number.');
    }
    
    async toggleMembership() {

        const selectedValue = await this.memberABAToggle.evaluate(select => {
            return (select as HTMLSelectElement).value;
        });
        console.log('If membership is selected no, switching to yes and vice versa. Expecting the member number input to appear and disappear');
        if (selectedValue === 'Yes'){
            await expect(this.memberNumberABA).toBeVisible();
            await this.selectMembershipABA('No');
            await expect(this.memberNumberABA).toBeHidden();

        } else if (selectedValue === 'No' || selectedValue === '%null%') {
            await expect(this.memberNumberABA).toBeHidden();
            await this.selectMembershipABA('Yes');
            await expect(this.memberNumberABA).toBeVisible();
        }
    }
    async fillOutExamInfo_CBRN({
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
        await this.selectMembershipABA(membership);
        if (membership === 'Yes' && memberNumber) {
            await this.fillMemberNumberABA(memberNumber);
        }
        await this.page.locator('body').click();
    }

    async checkErrorMessages() {
        await this.licenseNumberber.fill('');
        await this.selectState('Select One');
        await this.expirationDate.fill('');
        await this.selectMembershipABA('Select One');
        await this.requestMilDiscount(false);
        await expect(this.rnLicenseError).toBeVisible();
        await expect(this.rnStateError).toBeVisible();
        await expect(this.expirationError).toBeVisible();
        await expect(this.abaMemberError).toBeVisible();
    }
}