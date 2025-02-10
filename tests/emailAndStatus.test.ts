import { certCBRNFixtures, expect } from "../fixtures/certCBRN.fixtures";
import fs from 'fs';
import { BackOffice } from "../pages/backOffice.page";
import { Locator } from "@playwright/test";

certCBRNFixtures.beforeEach('wipe submittals', async ({
    certCBRN,
    page,
    homePage
    }) => {
    await homePage.visit();
        // Check if "Apply for Certification" text is present
    await homePage.removeSubmittal('CBRN');
    await certCBRN.visitCBRN();
    });
certCBRNFixtures.describe('military email and status', () => {
certCBRNFixtures.beforeEach('get to Mil Doc Review status', async ({
    certCBRN,
    page,
    homePage,
    backOffice
    }) => {
        await certCBRN.fillOutYesMil_CBRN();
        await page.waitForLoadState('networkidle');
        await expect(certCBRN.workflowTitle).toHaveText('Upload Military Documentation');
        await certCBRN.fileInput.setInputFiles(certCBRN.filePath);
        await page.waitForLoadState('networkidle');
        await expect(certCBRN.uploadMessage).toContainText('successfully uploaded');
        await certCBRN.clickNext();
        await page.getByRole('link', { name: 'Advance to Military' }).click();
        await expect(certCBRN.workflowTitle).toHaveText('Military Discount Instructions');
        //Military Documentation Review
        await homePage.visit();
        await expect(homePage.buttonCBRN).toContainText(/Military Documentation Review/i);
    });

        certCBRNFixtures('military app status and email', async ({
            certCBRN,
            page,
            homePage,
            backOffice
            }) => {
        const formattedDateTime = await backOffice.getCurrentDate();
        //for status - get the submittal number from the url, use that

        await backOffice.checkAppStatus('MILITARY_REVIEW','CBRN');
        await backOffice.checkEmailsVariable(formattedDateTime, 'Your application is under review for a Military Discount');
});

certCBRNFixtures('approve mil app, email sent, status updated', async ({
    certCBRN,
    page,
    homePage,
    backOffice
    }) => {   
        const formattedDateTime = await backOffice.getCurrentDate();
        await backOffice.reviewMil('Approve', 'CBRN');
        
        await backOffice.checkAppStatus('PENDING', 'CBRN');

        await backOffice.checkEmailsVariable(formattedDateTime, 'Your Military Discount has been approved!', 'Your application is under review for a Military Discount');

        await homePage.visit();
        await expect(homePage.buttonCBRN).toContainText(/In Process/i);

    //should try another test with this user - make sure that a new app doesn't go to the review stage when you select military discount
    });
certCBRNFixtures('deny mil app, email sent, status updated', async ({
    certCBRN,
    page,
    homePage,
    backOffice
    }) => {
        const formattedDateTime = await backOffice.getCurrentDate();
        await page.pause();
        await backOffice.reviewMil('Deny', 'CBRN');

        await backOffice.checkAppStatus('PENDING', 'CBRN');

        await backOffice.checkEmailsVariable(formattedDateTime, 'Your Military Discount was not approved', 'Your application is under review for a Military Discount');
        
        await homePage.visit();
        await expect(homePage.buttonCBRN).toContainText(/In Process/i);
    });
certCBRNFixtures('more info for mil app, email', async ({
    certCBRN,
    page,
    homePage,
    backOffice
    }) => {
        const formattedDateTime = await backOffice.getCurrentDate();
        await backOffice.reviewMil('Need More Information', 'CBRN');

        await backOffice.checkAppStatus('MILITARY_NMI', 'CBRN');

        await backOffice.checkEmailsVariable(formattedDateTime, 'More information is needed with your Military Documentation', 'Your application is under review for a Military Discount');

    await homePage.visit();
    await expect(homePage.buttonCBRN).toContainText(/Need More Information for Military Documentation/i);
    });

    certCBRNFixtures.afterEach('restore non-military status', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
        await backOffice.visit();
        await backOffice.clickRecentsButton();
        await backOffice.clickJohnetteAccount();

        await page.getByRole('link', { name: 'Customer Attributes' }).click();
        await page.getByRole('link', { name: 'Update Customer Attributes' }).first().click();
        await page.getByLabel('No', { exact: true }).check();
        await page.getByRole('button', { name: 'Update' }).nth(1).click();
        });
});
certCBRNFixtures.describe('international RN, email and status', () => {
    certCBRNFixtures.beforeEach('get to international RN audit status', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
            await certCBRN.fillOutExamInfo_CBRN();
            await certCBRN.selectState('International');
            await certCBRN.fillIntlCountry('Russia');
            await certCBRN.clickNoMilDiscount();
            await expect(page.locator('#aaAttrty_RNSTATE')).toContainText('If you are practicing internationally but hold a current, unrestricted RN license in the US or its territories, please do not select INTERNATIONAL. Instead, select the State where your RN license has been issued.');
            await certCBRN.clickNext();
            await page.waitForLoadState('networkidle');
            await expect(certCBRN.workflowTitle).toHaveText('International Nursing Licensure Evaluation Instructions');
            await certCBRN.clickNext();
            await certCBRN.fileInputIntlRN.setInputFiles(certCBRN.filePath);
            await page.waitForLoadState('networkidle');
            await expect(certCBRN.uploadMessageIntlRN).toContainText('successfully uploaded');
            await certCBRN.clickNext();
            await certCBRN.submitIntlReview.click();
            await expect(certCBRN.workflowTitle).toHaveText('International Credential Review Instructions');
            //Military Documentation Review
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/International RN License Review/i);
        });
        certCBRNFixtures('intl rn app status and email', async ({
            certCBRN,
            page,
            homePage,
            backOffice
            }) => {
                //INTL_RN_REVIEW (status), (messages) International RN Audit Under Review, Your application was selected for International RN Audit
                const formattedDateTime = await backOffice.getCurrentDate();
        
                await backOffice.checkAppStatus('INTL_RN_REVIEW','CBRN');
                await backOffice.checkEmailsVariable(formattedDateTime, 'International RN Audit Under Review', 'Your application was selected for International RN Audit');
        
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/International RN License Review/i);
        });

            
        certCBRNFixtures('approve intl rn, get app status and email', async ({
            certCBRN,
            page,
            homePage,
            backOffice
            }) => {         
                const formattedDateTime = await backOffice.getCurrentDate();  
                await backOffice.reviewIntlRN('Approved', 'CBRN');//'Rejected' 'Need More Information'
             
                await backOffice.checkAppStatus('PENDING', 'CBRN');
                await backOffice.checkEmailsVariable(formattedDateTime, 'International RN Audit Under Review', 'Your application was selected for International RN Audit', 
                    'International RN Audit - Approved');
                await homePage.visit();
                await expect(homePage.buttonCBRN).toContainText(/In Process/i);
            });
        certCBRNFixtures('deny intl rn, get app status and email', async ({
            certCBRN,
            page,
            homePage,
            backOffice
            }) => {         
                const formattedDateTime = await backOffice.getCurrentDate();  
                await backOffice.reviewIntlRN('Rejected', 'CBRN');//'Need More Information'
                
                await backOffice.checkAppStatus('INTL_RN_REJECTED', 'CBRN');
                await backOffice.checkEmailsVariable(formattedDateTime, 'International RN Audit Under Review', 'Your application was selected for International RN Audit', 
                    'International RN Audit - Not Approved');
                await homePage.visit();
                await expect(homePage.buttonCBRN).toContainText(/Apply for Certification/i);
            });
        certCBRNFixtures('intl rn, need more information get app status and email', async ({
            certCBRN,
            page,
            homePage,
            backOffice
            }) => {         
                const formattedDateTime = await backOffice.getCurrentDate();
                await backOffice.reviewIntlRN('Need More Information', 'CBRN');
                
                await backOffice.checkAppStatus('INTL_RN_NMI', 'CBRN');
                await backOffice.checkEmailsVariable(formattedDateTime, 'International RN Audit Under Review', 'Your application was selected for International RN Audit', 
                    'International RN Audit - Need More Information');
                await homePage.visit();
                await expect(homePage.buttonCBRN).toContainText(/International RN License - Need More Information/i);
            });
});

certCBRNFixtures.describe('exam accommodation tests, email and status', () => {
    certCBRNFixtures.beforeEach('request exam accommodation, go to payment', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
            await certCBRN.fillOutExamInfo_CBRN();
            await certCBRN.clickYesExamAccom();
            await certCBRN.clickNext();
            await page.waitForLoadState('networkidle');
        
            if (await certCBRN.mobileDropdown.isVisible()) {
                // Mobile View: Check if the dropdown contains "Exam Accommodation"
                const options = await certCBRN.mobileDropdown.locator('option').allTextContents();
                expect(options).toContain('Exam Accommodation Request');
            } else {
                // Desktop View: Check if the left bar step is visible
                await expect(certCBRN.examAccommLeftBar).toBeVisible();
            }
            await expect(certCBRN.workflowTitle).toHaveText('Exam Accommodation Request');
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');

            await certCBRN.examAccommUpload.setInputFiles(filePath);
            await page.waitForLoadState('load');
            await expect(certCBRN.accomUploadMessage).toContainText('successfully uploaded');
            await certCBRN.clickNext();

            await certCBRN.clickNoTestAssurance();
          await certCBRN.clickNext();
          await page.waitForLoadState('networkidle');
          await certCBRN.clickNext();
          await page.waitForLoadState('networkidle');
          await certCBRN.clickCheckoutButton();
          await page.waitForLoadState('networkidle');
  
          await certCBRN.selectPaymentOption('CREDIT CARD');
          await expect(certCBRN.creditCardOptions).toBeVisible();
          await certCBRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
          await expect(certCBRN.submitButton).toBeVisible();
          await certCBRN.clickSubmitCheckout();
          await certCBRN.fillCardNumber('341111597242000');
          await certCBRN.fillCVV('1154');
          await certCBRN.selectMonth('12');
          await certCBRN.selectYear('2025');
          await certCBRN.submitCardDetails();
          await page.waitForLoadState('networkidle');
          await expect(certCBRN.workflowTitle).toContainText('Exam Accommodation Instructions');
          await certCBRN.clickNext();
        });

    certCBRNFixtures('check status and email', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
            const formattedDateTime = await backOffice.getCurrentDate();
        
            await backOffice.checkAppStatus('ACCOMMODATION_REVIEW','CBRN');
            await backOffice.checkEmailsVariable(formattedDateTime, 'Consolidated Receipt', 'BCEN is reviewing your Exam Accommodation');
    
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/Accommodation Review/i);
        });
    certCBRNFixtures('approve accom, check status and email', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await backOffice.reviewAccom('Approve', 'CBRN'); //three options, Approve, Reject, and NMI
        
            await backOffice.checkAppStatus('EXAM_ELIGIBLE','CBRN');
            await backOffice.checkEmailsVariable(formattedDateTime, 'Consolidated Receipt', 'BCEN is reviewing your Exam Accommodation');
    
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/SCHEDULE\/MANAGE EXAM/i);
        });

    certCBRNFixtures('deny accom, check status and email', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await backOffice.reviewAccom('Reject', 'CBRN'); //three options, Approve, Reject, and NMI
        
            await backOffice.checkAppStatus('EXAM_ELIGIBLE','CBRN');
            await backOffice.checkEmailsVariable(formattedDateTime, 'Consolidated Receipt', 'BCEN is reviewing your Exam Accommodation', 'Authorized to test and test accommodation not approved');
    
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/SCHEDULE\/MANAGE EXAM/i);
        });
    certCBRNFixtures('NMI for accom, check status and email', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await backOffice.reviewAccom('NMI', 'CBRN'); //three options, Approve, Reject, and NMI
            await page.pause();
            await backOffice.checkAppStatus('ACCOMMODATION_NMI','CBRN');
            await backOffice.checkEmailsVariable(formattedDateTime, 'Consolidated Receipt', 'BCEN is reviewing your Exam Accommodation', 'Exam Accommodation - Need More Information');
    
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/Accommodation Additional Information Needed/i);
        });
});