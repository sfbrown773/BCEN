import { certTCRNFixtures, expect } from "../fixtures/certTCRN.fixtures";
import fs from 'fs';


  certTCRNFixtures.beforeEach('wipe submittals', async ({
    certTCRN,
    page,
    homePage
    }) => {
    await homePage.visit();
        // Check if "Apply for Certification" text is present
    await homePage.removeSubmittal('TCRN');
    await certTCRN.visitTCRN();
    });

  //structure as an if-then. If the application isn't clean, then run the submittal-remover and then start the process again. Otherwise run the test.
certTCRNFixtures('update home page label to in progress', async ({
    certTCRN,
    homePage,
    page
    }) => {
    await certTCRN.fillOutExamInfo_TCRN();
    await certTCRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certTCRN.workflowTitle).toHaveText('Test Assurance');
    await homePage.visit();
    await expect(homePage.buttonTCRN).toContainText(/In Process/i);
    });

certTCRNFixtures('update home page label to checkout', async ({
    certTCRN,
    homePage,
    page
    }) => {
    await certTCRN.fillOutExamInfo_TCRN();
    await certTCRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certTCRN.workflowTitle).toHaveText('Test Assurance');
    await certTCRN.clickNoTestAssurance();
    await certTCRN.clickNext();
    await certTCRN.clickNext();
    await certTCRN.clickCheckoutButton();
    //the problem with this next step is a simple timeout issue due to load time.
    await page.waitForLoadState('load');
    await expect(certTCRN.workflowTitle).toHaveText('Checkout and Make Payment');
    //Checkout
    await homePage.visit();
    await expect(homePage.buttonTCRN).toContainText(/Checkout/i);
    });

certTCRNFixtures('update home page label to military documentation review', async ({
    certTCRN,
    homePage,
    page
    }) => {
    await certTCRN.fillOutYesMil_TCRN();
    await page.waitForLoadState('load');
    await expect(certTCRN.workflowTitle).toHaveText('Upload Military Documentation');
    await certTCRN.fileInput.setInputFiles(certTCRN.filePath);
    await page.waitForLoadState('load');
    await expect(certTCRN.uploadMessage).toContainText('successfully uploaded');
    await certTCRN.clickNext();
    await page.getByRole('link', { name: 'Advance to Military' }).click();
    await expect(certTCRN.workflowTitle).toHaveText('Military Discount Instructions');
    //Military Documentation Review
    await homePage.visit();
    await expect(homePage.buttonTCRN).toContainText(/Military Documentation Review/i);
    });

certTCRNFixtures('can remove uploaded files from military docs', async ({
    certTCRN,
    homePage,
    page
    }) => {
    await certTCRN.fillOutYesMil_TCRN();
    await page.waitForLoadState('load');
    await expect(certTCRN.workflowTitle).toHaveText('Upload Military Documentation');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');
    const fileInput = certTCRN.fileInput;
    await fileInput.setInputFiles(filePath);

    const fileInput2 = certTCRN.fileInput2;
    await fileInput2.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certTCRN.uploadMessage).toContainText('successfully uploaded');
    //delete and confirm delete
    await certTCRN.deleteFile1.click();
    await certTCRN.deleteFile2.click();
    await expect(certTCRN.file1NoFile).toContainText(/No file chosen/);
    await expect(certTCRN.file2NoFile).toContainText(/No file chosen/);
    });

certTCRNFixtures('can remove uploaded files from exam accommodation', async ({
    certTCRN,
    homePage,
    page
    }) => {
    await certTCRN.fillOutYesAccom_TCRN();
    await page.waitForLoadState('load');
    await expect(certTCRN.workflowTitle).toHaveText('Exam Accommodation Request');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');

    await certTCRN.examAccommUpload.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certTCRN.accomUploadMessage).toContainText('successfully uploaded');
    await certTCRN.deleteExamAccom.click();
    await expect(certTCRN.accomNoFile).toContainText(/No file chosen/);
    });
    
certTCRNFixtures('yes exam accomodation, add step to left bar', async ({
    certTCRN,
    page
    }) => {
        await certTCRN.fillOutExamInfo_TCRN();
        await certTCRN.clickYesExamAccom();
        await certTCRN.clickNext();
        await page.waitForLoadState('networkidle');
    
        if (await certTCRN.mobileDropdown.isVisible()) {
            // Mobile View: Check if the dropdown contains "Exam Accommodation"
            const options = await certTCRN.mobileDropdown.locator('option').allTextContents();
            expect(options).toContain('Exam Accommodation Request');
            console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
        } else {
            // Desktop View: Check if the left bar step is visible
            await expect(certTCRN.examAccommLeftBar).toBeVisible();
            console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
        }
    });

certTCRNFixtures('expect next button hidden', async ({
    certTCRN,
    page
    }) => {
        await page.pause();
    await expect(certTCRN.pagination).toContainText('Please complete all required fields');
    await expect(certTCRN.nextButton).toBeHidden();
    await certTCRN.fillOutExamInfo_TCRN();
    await certTCRN.checkBoxesOneByOne();
});

certTCRNFixtures('test assurance error message', async ({
    certTCRN,
    page
    }) => {
    await certTCRN.fillOutExamInfo_TCRN();
    await certTCRN.clickNext();
    await certTCRN.nextButton.click();
    await expect(certTCRN.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
});

certTCRNFixtures('error messages on exam information', async ({
    certTCRN,
    page
    }) => {
        await certTCRN.fillOutExamInfo_TCRN();
        await certTCRN.licenseNumber.fill('');
        await certTCRN.selectState('Select One');
        await certTCRN.expirationDate.fill('');
        await certTCRN.selectMembershipSTN('Select One');
        await certTCRN.clickNoMilDiscount();
        await expect(certTCRN.rnLicenseError).toBeVisible();
        await expect(certTCRN.rnStateError).toBeVisible();
        await expect(certTCRN.expirationError).toBeVisible();
        await expect(certTCRN.stnMemberError).toBeVisible();
    });

certTCRNFixtures('toggle membership - memberNumber input opens and closes', async ({
    certTCRN,
    page
    }) => {
        await certTCRN.toggleMembershipSTN();
        await certTCRN.toggleMembershipSTN();
});

certTCRNFixtures('side graphic matches header, has orange color', async ({
    certTCRN,
    page
    }) => {
        await page.waitForLoadState('load');
        //exam info
        await certTCRN.checkHeaderMatchesSidebar();
        await certTCRN.fillOutExamInfo_TCRN();
        await certTCRN.clickNext();
        //test assurance
        await certTCRN.checkHeaderMatchesSidebar();
        await certTCRN.clickNoTestAssurance();
        await certTCRN.clickNext();
        //credential verification
        await certTCRN.checkHeaderMatchesSidebar();
        await certTCRN.clickNext();
        //status
        await certTCRN.checkHeaderMatchesSidebar();
    });

  certTCRNFixtures.describe('no member', () => {
    certTCRNFixtures.beforeEach('no member', async ({
        certTCRN
        }) => {
            await certTCRN.fillOutExamInfo_TCRN();
            await certTCRN.selectMembershipSTN('No');
    
            await certTCRN.clickNext();
        });

        certTCRNFixtures('not member, yes assurance', async ({
            certTCRN,
            page
            }) => {
                await certTCRN.clickYesTestAssurance();
                await certTCRN.clickNext();
                //move to Credential Verification
                await certTCRN.clickNext();
                //move to Status
                await certTCRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout
                await certTCRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certTCRN.checkoutTable).toContainText(certTCRN.priceNoMemYesAssur)
                await expect.soft(certTCRN.checkoutTable).toContainText('includes Test Assurance');
                await certTCRN.clearCheckout();

                await expect(certTCRN.checkoutTable).toBeHidden();
            });
        certTCRNFixtures('not member, no assurance', async ({
            page,
            certTCRN
            }) => {
                await certTCRN.clickNoTestAssurance();
                await certTCRN.clickNext();
                //move to Credential Verification
                await certTCRN.clickNext();
                //move to Status
                await certTCRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout'
                await certTCRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certTCRN.checkoutTable).toContainText(certTCRN.priceNoMemNoAssur)
                await certTCRN.clearCheckout();
    
                await expect(certTCRN.checkoutTable).toBeHidden();
            });
  });

  certTCRNFixtures.describe('yes member', () => {
    certTCRNFixtures.beforeEach('yes member', async ({
        certTCRN
        }) => {
            await certTCRN.fillOutExamInfo_TCRN();
            await certTCRN.selectMembershipSTN('Yes');
            await certTCRN.fillMemberNumberSTN('1234');
            await certTCRN.clickNoMilDiscount();
    
            await certTCRN.clickNext();
        });

        certTCRNFixtures('yes member, yes assurance', async ({
            page,
            certTCRN
            }) => {
                await certTCRN.clickYesTestAssurance();
                await certTCRN.clickNext();
                //move to Credential Verification
                await certTCRN.clickNext();
                //move to Status
                await certTCRN.clickCheckoutButton();
                //move to checkout
                await page.waitForLoadState('load');
                await certTCRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certTCRN.checkoutTable).toContainText(certTCRN.priceYesMemYesAssur);
                await expect.soft(certTCRN.checkoutTable).toContainText('includes Test Assurance');
                await certTCRN.clearCheckout();
    
                await expect(certTCRN.checkoutTable).toBeHidden();
            });
        certTCRNFixtures('yes member, no assurance', async ({
            page,
            certTCRN
            }) => {
                await certTCRN.clickNoTestAssurance();
                await certTCRN.clickNext();
                //move to Credential Verification
                await certTCRN.clickNext();
                //move to Status
                await certTCRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                await certTCRN.checkoutTable.waitFor({ state: 'visible' });
                //move to checkout
                await expect(certTCRN.checkoutTable).toContainText(certTCRN.priceYesMemNoAssur_others);
                await certTCRN.clearCheckout();
    
                await expect(certTCRN.checkoutTable).toBeHidden();
            });
  });


certTCRNFixtures.describe('checkout tests', () => {
    //THIS METHODOLOGY IS TEMPORARY...SAVES A GIVEN CHECKOUT SCREEN'S TO A JSON FILE TO RETURN TO IN OTHER TESTS
certTCRNFixtures('grab checkout url, save to json', async ({
    certTCRN,
    page
    }) => {
        await certTCRN.fillOutExamInfo_TCRN();
        await certTCRN.clickNext();
        await certTCRN.clickNoTestAssurance();
        await certTCRN.clickNext();
        await certTCRN.clickNext();
        await certTCRN.clickCheckoutButton();
        await expect(certTCRN.workflowTitle).toHaveText('Checkout and Make Payment');
        //grab the unique url for this submittal
        const submittalURL = page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cen-url-checkout.json', JSON.stringify(submittalURL));
    });
  certTCRNFixtures('add blank voucher', async ({
    certTCRN,
    page
    }) => {
        const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
        await page.goto(url);
        await certTCRN.clickAddVoucher();
        await expect(certTCRN.voucherErrorPopup).toBeVisible();
        await certTCRN.clickCloseVoucherError();
        await expect(certTCRN.addVoucherButton).toBeVisible();
    });

    certTCRNFixtures('payment type visibility - credit', async ({
        certTCRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certTCRN.selectPaymentOption('CREDIT CARD');
            await expect(certTCRN.creditCardOptions).toBeVisible();
            await certTCRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(certTCRN.submitButton).toBeVisible();
        });

    certTCRNFixtures('payment type visibility - echeck/ach', async ({
        certTCRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certTCRN.selectPaymentOption('ACHRT');
            await expect(certTCRN.submitButton).toBeVisible();
        });

    certTCRNFixtures('payment type visibility - check', async ({
        certTCRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await page.waitForLoadState('load');
            await certTCRN.paymentOptions.click();
            await certTCRN.selectPaymentOption('PAY_BY_CHECK');
            await certTCRN.paymentOptions.click();
            await expect(certTCRN.submitCheckButton).toBeVisible();
        });
  });
  certTCRNFixtures.describe('payment tests', () => {
    certTCRNFixtures.beforeEach('get to payment', async ({
      certTCRN,
      page
      }) => {
          await certTCRN.fillOutExamInfo_TCRN();
          await certTCRN.clickNext();
          await certTCRN.clickNoTestAssurance();
          await certTCRN.clickNext();
          await page.waitForLoadState('load');
          await certTCRN.clickNext();
          await page.waitForLoadState('load');
          await certTCRN.clickCheckoutButton();
          await page.waitForLoadState('load');
  
          await certTCRN.selectPaymentOption('CREDIT CARD');
          await expect(certTCRN.creditCardOptions).toBeVisible();
          await certTCRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
          await expect(certTCRN.submitButton).toBeVisible();
          await certTCRN.clickSubmitCheckout();
      });
      certTCRNFixtures('submit blank', async ({
          certTCRN,
          page
          }) => {
              await certTCRN.fillNameOnCard('');
              await certTCRN.fillCardNumber('');
              await certTCRN.fillCVV('');
              await certTCRN.selectMonth('Select');
              await certTCRN.selectYear('Select');
              await certTCRN.fillStreetAddress('');
              await certTCRN.fillZipCode('');
              await certTCRN.selectCountry({ value: '' });
              await certTCRN.submitCardDetails();
  
              await expect(certTCRN.nameError).toBeVisible();
              await expect(certTCRN.cardNumError).toBeVisible();
              await expect(certTCRN.cvvError).toBeVisible();
              await expect(certTCRN.monthError).toBeVisible();
              await expect(certTCRN.yearError).toBeVisible();
              await expect(certTCRN.addressError).toBeVisible();
              await expect(certTCRN.zipCodeError).toBeVisible();
              await expect(certTCRN.countryError).toBeVisible();
              await expect(certTCRN.countryError).toBeVisible();
              });
        certTCRNFixtures('cancel, back to checkout', async ({
        certTCRN,
        page
        }) => {
            await certTCRN.cancelButton.click();
            await page.waitForLoadState('networkidle');
            await expect(certTCRN.workflowTitle).toContainText('Checkout and Make Payment');
    });
//DO NOT RUN THIS NEXT TEST UNTIL WE HAVE A WAY TO UNDO THIS PROCESS
    certTCRNFixtures.skip('successful case', async ({
        certTCRN,
        page,
        homePage
        }) => {
            await certTCRN.fillCardNumber('341111597242000');
            await certTCRN.fillCVV('1154');
            await certTCRN.selectMonth('12');
            await certTCRN.selectYear('2025');
            await certTCRN.submitCardDetails();
            await page.waitForLoadState('load');

            await homePage.visit();
            await expect(homePage.buttonTCRN).toContainText(/SCHEDULE\/MANAGE EXAM/i);

    });
  });