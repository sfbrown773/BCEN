import { expect } from "@playwright/test";
import { Flow } from "../flows.page";

export class ExamAccommodations extends Flow {
    public pagePath = `/`

    public examAccommodationsUploadInput = this.page.locator('#aaAttrty_TESTACCOMUPLOAD_FILE input[type="file"]');
    public uploadMessage = this.page.locator('#aaAttrty_TESTACCOMUPLOAD_FILE div.aafileUploadMsg');
    public deleteFile1 = this.page.locator('#aaAttrty_TESTACCOMUPLOAD_FILE #aaRemoveFileBtn');
    public path = require('path');
    public filePath = this.path.resolve(__dirname, '../600.jpg');
    public fileInput = this.page.locator('#aaAttrty_TESTACCOMUPLOAD_FILE input[name="FILE"]');
    public examAccommodationsLeftBar = this.page.getByRole('link', { name: 'Exam Accommodation Request' });
    public mobileDropdown = this.page.locator('#wizard-steps-dropdown');
    public examAccommodationsHeading = this.page.getByRole('heading', { name: 'Exam Accommodation Request' }).locator('span');
    public errorMessageNoFile = this.page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE');

    async uploadExamAccomDoc(filepath:string) {
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
}