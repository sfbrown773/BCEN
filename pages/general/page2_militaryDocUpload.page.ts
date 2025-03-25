import { expect } from "@playwright/test";
import { Flow } from "../flows.page";

export class MilitaryDoc extends Flow {
    public pagePath = `/`

    public militaryDocUpload = this.page.getByText('Upload Military Documentation');
    public uploadMessage = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE div.aafileUploadMsg');
    public fileInput = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE input[name="FILE"]');
    public deleteButtonFile1 = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE #aaRemoveFileBtn');
    public file1NoFile = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE')
    public fileInput2 = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD2_FILE input[name="FILE"]');
    public deleteButtonFile2 = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD2_FILE #aaRemoveFileBtn');
    public uploadMessage2 = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD2_FILE div.aafileUploadMsg');
    public file2NoFile = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD2_FILE');
    public militaryDocLeftBar = this.page.getByRole('link', { name: 'Military Discount Instructions' });
    public advanceToMilitaryButton = this.page.getByRole('link', { name: 'Advance to Military' });

    async uploadMilDoc(filepath:string) {
            await this.fileInput.setInputFiles(filepath);
            await this.page.waitForLoadState('networkidle');
            for (let i = 0; i < 10; i++) {
                const message = await this.uploadMessage.textContent();
                if (message && message.includes('is being uploaded... (please wait)')) {
                    // Wait for 3 seconds if the file is still being uploaded
                    await this.page.waitForTimeout(3000);
                } else {
                    // If the message changes (upload complete), break out of the loop
                    break;
                }
            }
            await expect(this.uploadMessage).toContainText('successfully uploaded');
    }
    async uploadMilDoc2(filepath:string) {
        await this.fileInput2.setInputFiles(filepath);
        await this.page.waitForLoadState('networkidle');
        for (let i = 0; i < 10; i++) {
            const message = await this.uploadMessage2.textContent();
            if (message && message.includes('is being uploaded... (please wait)')) {
                // Wait for 3 seconds if the file is still being uploaded
                await this.page.waitForTimeout(3000);
            } else {
                // If the message changes (upload complete), break out of the loop
                break;
            }
        }
        await expect(this.uploadMessage2).toContainText('successfully uploaded');
}
    async clickAdvanceToMilitary() {
        await this.advanceToMilitaryButton.click();        
    }
    async deleteMilUpload1() {
        await this.deleteButtonFile1.click();
    }
    async deleteMilUpload2() {
        await this.deleteButtonFile2.click();
    }
}