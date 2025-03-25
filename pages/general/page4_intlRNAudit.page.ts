import { expect } from "@playwright/test";
import { Flow } from "../flows.page";

export class InternationalAudit extends Flow {
        public pagePath = `/`
        public fileInputIntlRN = this.page.locator('#aaAttrty_INTLDOCUPLOAD_FILE input[name="FILE"]');
        public deleteFileIntlRN = this.page.locator('#aaAttrty_INTLDOCUPLOAD_FILE #aaRemoveFileBtn');
        public uploadMessageIntlRN = this.page.locator('#aaAttrty_INTLDOCUPLOAD_FILE div.aafileUploadMsg');
        public submitIntlReview = this.page.getByRole('link', { name: 'Submit to Staff Review' });
        
        async uploadRNAuditDoc(filepath:string) {
            await this.fileInputIntlRN.setInputFiles(filepath);
            await this.page.waitForLoadState('networkidle');
            for (let i = 0; i < 10; i++) {
                const message = await this.uploadMessageIntlRN.textContent();
                if (message && message.includes('is being uploaded... (please wait)')) {
                    // Wait for 3 seconds if the file is still being uploaded
                    await this.page.waitForTimeout(3000);
                } else {
                    // If the message changes (upload complete), break out of the loop
                    break;
                }
            }
            await expect(this.uploadMessageIntlRN).toContainText('successfully uploaded');
    }
    }