import { certCBRNFixtures, expect } from "../fixtures/certCBRN.fixtures";
import { BackOffice } from "../pages/backOffice.page";
import { LandingPage } from "../pages/landingPage.page";
import fs from 'fs';


  certCBRNFixtures('wipe submittals', async ({
    certCBRN,
    page,
    homePage
    }) => {
        await homePage.visit();
        await homePage.removeSubmittal('CBRN');
        await certCBRN.visitCBRN();
    });

certCBRNFixtures('update home page label to in progress', async ({
    certCBRN,
    homePage,
    page
    }) => {
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCBRN.workflowTitle).toHaveText('Test Assurance');
    await homePage.visit();
    await expect(homePage.buttonCBRN).toContainText(/In Process/i);
    });

certCBRNFixtures('update home page label to checkout', async ({
    certCBRN,
    homePage,
    page
    }) => {
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCBRN.workflowTitle).toHaveText('Test Assurance');
    await certCBRN.clickNoTestAssurance();
    await certCBRN.clickNext();
    await certCBRN.clickNext();
    await certCBRN.clickCheckoutButton();
    await page.waitForLoadState('load');
    await expect(certCBRN.workflowTitle).toHaveText('Checkout and Make Payment');
    //Checkout
    await homePage.visit();
    await expect(homePage.buttonCBRN).toContainText(/Checkout/i);
    });

certCBRNFixtures('update home page label to military documentation review', async ({
    certCBRN,
    homePage,
    page
    }) => {
    await certCBRN.fillOutYesMil_CBRN();
    await page.waitForLoadState('load');
    await expect(certCBRN.workflowTitle).toHaveText('Upload Military Documentation');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');
    await certCBRN.fileInput.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(page.locator('#aaAttrty_MILITARYDOCUPLOAD_FILE div.aafileUploadMsg')).toContainText('successfully uploaded');
    await certCBRN.clickNext();
    await page.getByRole('link', { name: 'Advance to Military' }).click();
    await expect(certCBRN.workflowTitle).toHaveText('Military Discount Instructions');
    //Military Documentation Review
    await homePage.visit();
    await expect(homePage.buttonCBRN).toContainText(/Military Documentation Review/i);
    });
    
certCBRNFixtures('yes exam accomodation, add step to left bar', async ({
    certCBRN,
    page
    }) => {
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCBRN.examAccommLeftBar).toBeVisible();
    });

certCBRNFixtures('expect next button hidden', async ({
    certCBRN,
    page
    }) => {
    await expect(certCBRN.pagination).toContainText('Please complete all required fields');
    await expect(certCBRN.nextButton).toBeHidden();
    await certCBRN.fillOutExamInfo_CBRN();
    await expect(certCBRN.nextButton).toBeVisible();
    await certCBRN.clickNext();
});

certCBRNFixtures('test assurance error message', async ({
    certCBRN,
    page
    }) => {
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.clickNext();
    await certCBRN.clickNext();
    await expect(page.locator('span.aaValidationTxt')).toHaveText('"Would you like to purchase test assurance?" is required.');
});

certCBRNFixtures('error messages on exam information', async ({
    certCBRN,
    page
    }) => {
        await certCBRN.fillOutExamInfo_CBRN();
        await certCBRN.licenseNumber.fill('');
        await certCBRN.selectState('Select One');
        await certCBRN.expirationDate.fill('');
        await certCBRN.selectMembershipABA('Select One');
        await certCBRN.clickNoMilDiscount();


    //In CBRN flow, RN License Error doesn't display
        //await expect(certCBRN.rnLicenseError).toBeVisible();
        await expect(certCBRN.rnStateError).toBeVisible();
        await expect(certCBRN.expirationError).toBeVisible();
        await expect(certCBRN.abaMemberError).toBeVisible();
    });

certCBRNFixtures('toggle membership - memberNumber input opens and closes', async ({
    certCBRN,
    page
    }) => {
        await certCBRN.toggleMembershipABA();
        await certCBRN.toggleMembershipABA();
});

certCBRNFixtures('side graphic matches header, has orange color', async ({
    certCBRN
    }) => {
        //exam info
        await certCBRN.checkHeaderMatchesSidebar();
        await certCBRN.fillOutExamInfo_CBRN();
        await certCBRN.clickNext();
        //test assurance
        await certCBRN.goToTestAssurance();
        await certCBRN.checkHeaderMatchesSidebar();
        //credential verification
        await certCBRN.goToCredentialVerification();
        await certCBRN.checkHeaderMatchesSidebar();
        //status
        await certCBRN.goToStatus();
        await certCBRN.checkHeaderMatchesSidebar();
    });

  certCBRNFixtures.describe('no member', () => {
    certCBRNFixtures.beforeEach('no member', async ({
        certCBRN
        }) => {
            await certCBRN.fillOutExamInfo_CBRN();
            await certCBRN.selectMembershipABA('No');
    
            await certCBRN.clickNext();
        });

        certCBRNFixtures('not member, yes assurance', async ({
            certCBRN,
            page
            }) => {
                await certCBRN.clickYesTestAssurance();
                await certCBRN.clickNext();
                //move to Credential Verification
                await certCBRN.clickNext();
                //move to Status
                await certCBRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout
                await certCBRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCBRN.checkoutTable).toContainText('450.00')
                await expect(certCBRN.checkoutTable).toContainText('includes Test Assurance');
                await certCBRN.clearCheckout();

                await expect(certCBRN.checkoutTable).toBeHidden();
            });
        certCBRNFixtures('not member, no assurance', async ({
            page,
            certCBRN
            }) => {
                await certCBRN.clickNoTestAssurance();
                await certCBRN.clickNext();
                //move to Credential Verification
                await certCBRN.clickNext();
                //move to Status
                await certCBRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout'
                await certCBRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCBRN.checkoutTable).toContainText('380.00')
                await certCBRN.clearCheckout();
    
                await expect(certCBRN.checkoutTable).toBeHidden();
            });
  });

  certCBRNFixtures.describe('yes member', () => {
    certCBRNFixtures.beforeEach('yes member', async ({
        certCBRN
        }) => {
            await certCBRN.fillOutExamInfo_CBRN();
            await certCBRN.selectMembershipABA('Yes');
            await certCBRN.fillMemberNumberABA('1234');
            await certCBRN.clickNoMilDiscount();
    
            await certCBRN.clickNext();
        });

        certCBRNFixtures('yes member, yes assurance', async ({
            page,
            certCBRN
            }) => {
                await certCBRN.clickYesTestAssurance();
                await certCBRN.clickNext();
                //move to Credential Verification
                await certCBRN.clickNext();
                //move to Status
                await certCBRN.clickCheckoutButton();
                //move to checkout
                await page.waitForLoadState('load');
                await certCBRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCBRN.checkoutTable).toContainText('355.00');
                await expect(certCBRN.checkoutTable).toContainText('includes Test Assurance');
                await certCBRN.clearCheckout();
    
                await expect(certCBRN.checkoutTable).toBeHidden();
            });
        certCBRNFixtures('yes member, no assurance', async ({
            page,
            certCBRN
            }) => {
                await certCBRN.clickNoTestAssurance();
                await certCBRN.clickNext();
                //move to Credential Verification
                await certCBRN.clickNext();
                //move to Status
                await certCBRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                await page.waitForLoadState('load');
                await certCBRN.checkoutTable.waitFor({ state: 'visible' });
                //move to checkout
                await expect(certCBRN.checkoutTable).toContainText('285.00')
                await certCBRN.clearCheckout();
    
                await expect(certCBRN.checkoutTable).toBeHidden();
            });
  });

certCBRNFixtures.describe('checkout tests', () => {
    let submittalURL;
    //THIS METHODOLOGY IS TEMPORARY...SAVES A GIVEN CHECKOUT SCREEN'S TO A JSON FILE TO RETURN TO IN OTHER TESTS
certCBRNFixtures('grab checkout url, save to json', async ({
    certCBRN,
    page
    }) => {
        await certCBRN.fillOutExamInfo_CBRN();
        await certCBRN.clickNext();
        await certCBRN.clickNoTestAssurance();
        await certCBRN.clickNext();
        await certCBRN.clickNext();
        await certCBRN.clickCheckoutButton();
        await expect(certCBRN.workflowTitle).toHaveText('Checkout and Make Payment');
        //grab the unique url for this submittal
        const submittalURL = page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cbrn-url-checkout.json', JSON.stringify(submittalURL));
    });
  certCBRNFixtures('add blank voucher', async ({
    certCBRN,
    page
    }) => {
        const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
        await page.goto(url);
        await certCBRN.clickAddVoucher();
        await expect(certCBRN.voucherErrorPopup).toBeVisible();
        await certCBRN.clickCloseVoucherError();
        await expect(certCBRN.addVoucherButton).toBeVisible();
    });

    certCBRNFixtures('payment type visibility - credit', async ({
        certCBRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCBRN.selectPaymentOption('CREDIT CARD');
            await expect(certCBRN.creditCardOptions).toBeVisible();
            await certCBRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(certCBRN.submitButton).toBeVisible();
        });

    certCBRNFixtures('payment type visibility - echeck/ach', async ({
        certCBRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCBRN.selectPaymentOption('ACHRT');
            await expect(certCBRN.submitButton).toBeVisible();
        });

    certCBRNFixtures('payment type visibility - check', async ({
        certCBRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await page.waitForLoadState('load');
            await certCBRN.paymentOptions.click();
            await certCBRN.selectPaymentOption('PAY_BY_CHECK');
            await certCBRN.paymentOptions.click();
            await expect(certCBRN.submitButton).toBeVisible();
        });
  });

  certCBRNFixtures.describe.only('payment tests', () => {
  certCBRNFixtures.beforeAll('get to payment', async ({
    certCBRN,
    page
    }) => {
        await certCBRN.fillOutExamInfo_CBRN();
        await certCBRN.clickNext();
        await certCBRN.clickNoTestAssurance();
        await certCBRN.clickNext();
        await certCBRN.clickNext();
        await certCBRN.clickCheckoutButton();

        await certCBRN.selectPaymentOption('CREDIT CARD');
        await expect(certCBRN.creditCardOptions).toBeVisible();
        await certCBRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
        await expect(certCBRN.submitButton).toBeVisible();
        await certCBRN.clickSubmitCheckout();
    });
    certCBRNFixtures('submit blank', async ({
        certCBRN,
        page
        }) => {
            await certCBRN.fillNameOnCard('');
            await certCBRN.fillCardNumber('');
            await certCBRN.fillCVV('');
            await certCBRN.selectMonth('');
            await certCBRN.selectYear('');
            await certCBRN.fillStreetAddress('');
            await certCBRN.fillZipCode('');
            await certCBRN.selectCountry({ value: '' });
            await certCBRN.submitCardDetails();

            await expect(certCBRN.nameError).toBeVisible();
            await expect(certCBRN.cardNumError).toBeVisible();
            await expect(certCBRN.cvvError).toBeVisible();
            await expect(certCBRN.monthError).toBeVisible();
            await expect(certCBRN.yearError).toBeVisible();
            await expect(certCBRN.addressError).toBeVisible();
            await expect(certCBRN.zipCodeError).toBeVisible();
            await expect(certCBRN.countryError).toBeVisible();
            await expect(certCBRN.countryError).toBeVisible();
            });
});