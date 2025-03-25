import { expect } from "@playwright/test";
import fs from 'fs';
import { Flow } from "../flows.page";

export class CredVerification extends Flow {
    public pagePath = `/`

    public email1 = this.page.locator('#aaAttrty_APPREQNOTIFICATIONA_input');
    public email2 = this.page.locator('#aaAttrty_APPREQNOTIFICATIONB_input');
    public email3 = this.page.locator('#aaAttrty_APPREQNOTIFICATIONC_input');
    public email4 = this.page.locator('#aaAttrty_APPREQNOTIFICATIOND_input');
    public email5 = this.page.locator('#aaAttrty_APPREQNOTIFICATIONE_input');
    public credVerificationLeftBar = this.page.getByRole('link', { name: 'Credential Verification' });

    async fillEmail1(email:string) {
        await this.email1.fill(email);
    }
    async fillEmail2(email:string) {
        await this.email2.fill(email);
    }
    async fillEmail3(email:string) {
        await this.email3.fill(email);
    }
    async fillEmail4(email:string) {
        await this.email4.fill(email);
    }
    async fillEmail5(email:string) {
        await this.email5.fill(email);
    }
}