import { certCENFixtures } from "./fixtures/certCEN.fixtures";
import {test, expect, Page} from "@playwright/test";
import { User } from "./user";
import { HomePage } from "./pages/home.page";
import { CENPayment } from "./pages/-CEN/CEN_page9_payment.page";
import { BackOffice } from "./pages/backOffice.page";
import { CENCheckout } from "./pages/-CEN/CEN_page8_checkout.page";
import { CENStatus } from "./pages/-CEN/CEN_page7_status.page";
import { CENCredVerification } from "./pages/-CEN/CEN_page6_credentialVerification.page";
import { CENTestAssurance } from "./pages/-CEN/CEN_page5_testAssurance.page";
import { CENExamInfo } from "./pages/-CEN/CEN_page1_examInfo.page";
import { UserManager } from "./userManager";

export class UserStates {
    async changeStateToRetest(user: User, page: Page) {
        const homePage = new HomePage(page);
        const cenPayment = new CENPayment(page);
        const backOffice = new BackOffice(page);
        const cenCheckout = new CENCheckout(page);
        const cenStatus = new CENStatus(page);
        const cenCredVerification = new CENCredVerification(page);
        const cenTestAssurance = new CENTestAssurance(page);
        const cenExamInfo = new CENExamInfo(page);
        
        const encodedCredentials = Buffer.from(`${process.env.AA_BACKOFFICE_USERNAME}:${process.env.AA_BACKOFFICE_PASSWORD}`).toString('base64');
        await page.setExtraHTTPHeaders({
          'Authorization': `Basic ${encodedCredentials}`
        });
        
        await page.goto(process.env.AA_BACKOFFICE_URL! + '/f?p=600:1200:::::P1200_KEY:' + user.customerId);
    
        // Wait until the page receives the cookies.
        //
        // Sometimes login flow sets cookies in the process of several redirects.
        // Wait for the final URL to ensure that the cookies are actually set.
        await page.waitForURL('**\/loggedin');
        
        await homePage.visit();
        await homePage.visitCEN();
        
        const examInfoArgs = {
            accommodationRequest: false,
            militaryStatusRequest: false,
            licenseNumber: '1234',
            state: 'IL',
            membership: 'No'
        };

        await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
        await cenExamInfo.clickNext(page);
        await page.waitForLoadState('networkidle');
        
        let submittalNum: string | undefined;
        let workflowNum: string | undefined;

        const url = page.url();
        console.log('Current URL:', url); // Log the URL for debugging

        if (url) {
            // Extract the values after `P0_SUBMITTAL_SERNO,G_WKF_FL,G_WKF_SERNO,...`
            const match = url.match(/P0_SUBMITTAL_SERNO,G_WKF_FL,G_WKF_SERNO[^:]*:([^,]+),Y,([^,]+)/);

            if (match) {
                submittalNum = match[1]; // First value (462549)
                workflowNum = match[2];   // Second value (629850)
                console.log('Extracted submittalNum:', submittalNum); // Log extracted values
                console.log('Extracted workflowNum:', workflowNum);
            } else {
                console.error('Could not find submittalNum and workflowNum in the URL.');
            }
        } else {
            console.error('URL is undefined.');
        }
    
        const testAssuranceArg = false
        await page.waitForLoadState('networkidle');
        await cenTestAssurance.selectTestAssurance(testAssuranceArg);
        await cenTestAssurance.clickNext(page);
        
        await cenCredVerification.clickNext(page);

        //new user must agree to data sharing policy, add an email.
        const page2Promise = page.waitForEvent('popup');
        await page.getByRole('row', { name: 'Email Required  Email' }).getByRole('link').click();
        const page2 = await page2Promise;
        page2.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await page2.locator('#aaCenssaprofileDispProfHdrContactInformationEdit').click();
        await page2.locator('#aaProfilePhoneField-3').click();
        await page2.locator('#aaProfilePhoneField-3').fill('555-555-5555');
        await page2.locator('#aaProfileCyberTxtField-1').click();
        await page2.locator('#aaProfileCyberTxtField-1').fill(`${user.customerId}@test.com`);
        await page2.locator('#aaProfilePrefCyberField').selectOption('NEW:EMAIL');
        await page2.locator('#DATAUSAGECONSENT_tr').getByRole('combobox').selectOption('0::!!!DATA_USAGE_CONSENT!:0YES');
        await page2.locator('#DATASHARINGCONSENT_tr').getByRole('combobox').selectOption('0::!!!DATA_SHARING_CONSENT!:0YES');
        page2.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await page2.getByRole('button', { name: 'Update' }).click();
        //end of adding new user email, agreeing to data policy etc.
        
        await cenStatus.open(`bcendevssa/f?p=SBMSSA:25250:13086111363108::::P0_SUBMITTAL_SERNO,G_WKF_FL,G_WKF_SERNO,G_WKF_TRANS_VERB,CUST_CONTEXT,P25250_STATE_CD,P0_CONTEXT_HEADER_CD,G_CUST_ID:${submittalNum},Y,${workflowNum},STATUS,STATUS_SUMMARY,CHECKOUT,SBM,${user.customerId}`);
        const thisUrl = page.url()
        console.log(thisUrl);
        await cenStatus.clickCheckoutButton();
        await expect(cenCheckout.workflowTitle).toHaveText(
            "Checkout and Make Payment"
        );
        
        await cenCheckout.selectPaymentOption("CREDIT CARD");
        await expect(cenCheckout.creditCardOptions).toBeVisible();
        await cenCheckout.selectCreditCard("0K"); //'OK' is AE, 'OJ' is Visa/Discover/MC
        await expect(cenCheckout.submitButton).toBeVisible();
        await cenCheckout.clickSubmitCheckout();
        await page.waitForLoadState("networkidle");
            
        await cenPayment.fillOutAndSubmitPayment({
            cardNum: '341111597242000',
            cardName: 'Test Tester',
            cvv: '1154',
            month: '12',
            year: '2025',
            address: '1234qwre',
            country: 'US',
            zip: '60625'
        });
        await page.waitForLoadState("networkidle");
        await expect(cenPayment.workflowTitle).toBeVisible();
        
            if (submittalNum && workflowNum) {
                await backOffice.visit();
                
                //redo with process.env!
                await page.goto(`https://dbrown:Catalyst1@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
                const url = `https://online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`
                console.log(url)
            } else {
                throw new Error('Error in navigation to back office.')
            }
            
            await backOffice.updateExamStatus("CEN", "F");
            
        if (submittalNum && workflowNum) {
            await page.goto(
                `https://dbrown:Catalyst1@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`
            );
        } else {
            console.log("Submittal or workflow number is undefined.");
        }
        
            if(submittalNum && workflowNum) {
                await backOffice.convertFailedToSecondApp(submittalNum, workflowNum);
            }

            user.state = 'retest';
            console.log(`User state updated to: ${user.state}`);
        }

    async changeStateToSecondAttempt(user: User, page: Page) {
            const homePage = new HomePage(page);
            const cenPayment = new CENPayment(page);
            const backOffice = new BackOffice(page);
            const cenCheckout = new CENCheckout(page);
            const cenStatus = new CENStatus(page);
            const cenCredVerification = new CENCredVerification(page);
            const cenTestAssurance = new CENTestAssurance(page);
            const cenExamInfo = new CENExamInfo(page);
            
            const encodedCredentials = Buffer.from(`${process.env.AA_BACKOFFICE_USERNAME}:${process.env.AA_BACKOFFICE_PASSWORD}`).toString('base64');
            await page.setExtraHTTPHeaders({
              'Authorization': `Basic ${encodedCredentials}`
            });
            
            await page.goto(process.env.AA_BACKOFFICE_URL! + '/f?p=600:1200:::::P1200_KEY:' + user.customerId);
            
        
            // Wait until the page receives the cookies.
            //
            // Sometimes login flow sets cookies in the process of several redirects.
            // Wait for the final URL to ensure that the cookies are actually set.
            await page.waitForURL('**\/loggedin');
            
            await homePage.visit();
            await homePage.visitCEN();
            
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            };
    
            await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
            await cenExamInfo.clickNext(page);
            await page.waitForLoadState('networkidle');
            
            let submittalNum: string | undefined;
            let workflowNum: string | undefined;
    
            const url = page.url();
            console.log('Current URL:', url); // Log the URL for debugging
    
            if (url) {
                // Extract the values after `P0_SUBMITTAL_SERNO,G_WKF_FL,G_WKF_SERNO,...`
                const match = url.match(/P0_SUBMITTAL_SERNO,G_WKF_FL,G_WKF_SERNO[^:]*:([^,]+),Y,([^,]+)/);
    
                if (match) {
                    submittalNum = match[1]; // First value (462549)
                    workflowNum = match[2];   // Second value (629850)
                    console.log('Extracted submittalNum:', submittalNum); // Log extracted values
                    console.log('Extracted workflowNum:', workflowNum);
                } else {
                    console.error('Could not find submittalNum and workflowNum in the URL.');
                }
            } else {
                console.error('URL is undefined.');
            }
        
            const testAssuranceArg = true
            await page.waitForLoadState('networkidle');
            await cenTestAssurance.selectTestAssurance(testAssuranceArg);
            await cenTestAssurance.clickNext(page);
            
            await cenCredVerification.clickNext(page);
    
            //new user must agree to data sharing policy, add an email.
            const page2Promise = page.waitForEvent('popup');
            await page.getByRole('row', { name: 'Email Required  Email' }).getByRole('link').click();
            const page2 = await page2Promise;
            page2.once('dialog', dialog => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.dismiss().catch(() => {});
            });
            await page2.locator('#aaCenssaprofileDispProfHdrContactInformationEdit').click();
            await page2.locator('#aaProfilePhoneField-3').click();
            await page2.locator('#aaProfilePhoneField-3').fill('555-555-5555');
            await page2.locator('#aaProfileCyberTxtField-1').click();
            await page2.locator('#aaProfileCyberTxtField-1').fill(`${user.customerId}@test.com`);
            await page2.locator('#aaProfilePrefCyberField').selectOption('NEW:EMAIL');
            await page2.locator('#DATAUSAGECONSENT_tr').getByRole('combobox').selectOption('0::!!!DATA_USAGE_CONSENT!:0YES');
            await page2.locator('#DATASHARINGCONSENT_tr').getByRole('combobox').selectOption('0::!!!DATA_SHARING_CONSENT!:0YES');
            page2.once('dialog', dialog => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.dismiss().catch(() => {});
            });
            await page2.getByRole('button', { name: 'Update' }).click();
            await page2.waitForTimeout(3000);
            await expect(page2.locator('#aaCenssaprofileDispProfHdrContactInformationEdit')).toBeVisible();
            //end of adding new user email, agreeing to data policy etc.
            await page2.close();
            
            await cenStatus.open(`bcendevssa/f?p=SBMSSA:25250:13086111363108::::P0_SUBMITTAL_SERNO,G_WKF_FL,G_WKF_SERNO,G_WKF_TRANS_VERB,CUST_CONTEXT,P25250_STATE_CD,P0_CONTEXT_HEADER_CD,G_CUST_ID:${submittalNum},Y,${workflowNum},STATUS,STATUS_SUMMARY,CHECKOUT,SBM,${user.customerId}`);
            const thisUrl = page.url()
            console.log(thisUrl);
            await cenStatus.clickCheckoutButton();
            await expect(cenCheckout.workflowTitle).toHaveText(
                "Checkout and Make Payment"
            );
            
            await cenCheckout.selectPaymentOption("CREDIT CARD");
            await expect(cenCheckout.creditCardOptions).toBeVisible();
            await cenCheckout.selectCreditCard("0K"); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(cenCheckout.submitButton).toBeVisible();
            await cenCheckout.clickSubmitCheckout();
            await page.waitForLoadState("networkidle");
                
            await cenPayment.fillOutAndSubmitPayment({
                cardNum: '341111597242000',
                cardName: 'Test Tester',
                cvv: '1154',
                month: '12',
                year: '2025',
                address: '1234qwre',
                country: 'US',
                zip: '60625'
            });
            await page.waitForLoadState("networkidle");
            await expect(cenPayment.workflowTitle).toBeVisible();
            
                if (submittalNum && workflowNum) {
                    await backOffice.visit();
                    
                    //redo with process.env!
                    await page.goto(`https://dbrown:Catalyst1@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
                    const url = `https://online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`
                    console.log(url)
                } else {
                    throw new Error('Error in navigation to back office.')
                }
                
                await backOffice.updateExamStatus("CEN", "F");
                
            if (submittalNum && workflowNum) {
                await page.goto(
                    `https://dbrown:Catalyst1@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`
                );
            } else {
                console.log("Submittal or workflow number is undefined.");
            }
            
                if(submittalNum && workflowNum) {
                    await backOffice.convertFailedToSecondApp(submittalNum, workflowNum);
                }

            user.state = 'second attempt';
            console.log(`User state updated to: ${user.state}`);
            }

    async expireUser(user: User) {
        user.state = 'expired';
        const userManager = new UserManager();
        userManager.saveUsersToFile(); // Save after modification
    }

}