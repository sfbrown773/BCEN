import { certCTRNFixtures, expect } from "../fixtures/certCTRN.fixtures";
import fs from 'fs';


  certCTRNFixtures.beforeEach('wipe submittals', async ({
    certCTRN,
    page,
    homePage
    }) => {
    await homePage.visit();
        // Check if "Apply for Certification" text is present
    await homePage.removeSubmittal('CTRN');
    await certCTRN.visitCTRN();
    });

  //structure as an if-then. If the application isn't clean, then run the submittal-remover and then start the process again. Otherwise run the test.
certCTRNFixtures('update home page label to in progress', async ({
    certCTRN,
    homePage,
    page
    }) => {
    await certCTRN.fillOutExamInfo_CTRN();
    await certCTRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCTRN.workflowTitle).toHaveText('Test Assurance');
    await homePage.visit();
    await expect(homePage.buttonCTRN).toContainText(/In Process/i);
    });

certCTRNFixtures('update home page label to checkout', async ({
    certCTRN,
    homePage,
    page
    }) => {
    await certCTRN.fillOutExamInfo_CTRN();
    await certCTRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCTRN.workflowTitle).toHaveText('Test Assurance');
    await certCTRN.clickNoTestAssurance();
    await certCTRN.clickNext();
    await certCTRN.clickNext();
    await certCTRN.clickCheckoutButton();
    //the problem with this next step is a simple timeout issue due to load time.
    await page.waitForLoadState('load');
    await expect(certCTRN.workflowTitle).toHaveText('Checkout and Make Payment');
    //Checkout
    await homePage.visit();
    await expect(homePage.buttonCTRN).toContainText(/Checkout/i);
    });

certCTRNFixtures('update home page label to military documentation review', async ({
    certCTRN,
    homePage,
    page
    }) => {
    await certCTRN.fillOutYesMil_CTRN();
    await page.waitForLoadState('load');
    await expect(certCTRN.workflowTitle).toHaveText('Upload Military Documentation');
    await certCTRN.fileInput.setInputFiles(certCTRN.filePath);
    await page.waitForLoadState('load');
    await expect(certCTRN.uploadMessage).toContainText('successfully uploaded');
    await certCTRN.clickNext();
    await page.getByRole('link', { name: 'Advance to Military' }).click();
    await expect(certCTRN.workflowTitle).toHaveText('Military Discount Instructions');
    //Military Documentation Review
    await homePage.visit();
    await expect(homePage.buttonCTRN).toContainText(/Military Documentation Review/i);
    });

certCTRNFixtures('can remove uploaded files from military docs', async ({
    certCTRN,
    homePage,
    page
    }) => {
    await certCTRN.fillOutYesMil_CTRN();
    await page.waitForLoadState('load');
    await expect(certCTRN.workflowTitle).toHaveText('Upload Military Documentation');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');
    const fileInput = certCTRN.fileInput;
    await fileInput.setInputFiles(filePath);

    const fileInput2 = certCTRN.fileInput2;
    await fileInput2.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCTRN.uploadMessage).toContainText('successfully uploaded');
    //delete and confirm delete
    await certCTRN.deleteFile1.click();
    await certCTRN.deleteFile2.click();
    await expect(certCTRN.file1NoFile).toContainText(/No file chosen/);
    await expect(certCTRN.file2NoFile).toContainText(/No file chosen/);
    });

certCTRNFixtures('can remove uploaded files from exam accommodation', async ({
    certCTRN,
    homePage,
    page
    }) => {
    await certCTRN.fillOutYesAccom_CTRN();
    await page.waitForLoadState('load');
    await expect(certCTRN.workflowTitle).toHaveText('Exam Accommodation Request');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');

    await certCTRN.examAccommUpload.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCTRN.accomUploadMessage).toContainText('successfully uploaded');
    await certCTRN.deleteExamAccom.click();
    await expect(certCTRN.accomNoFile).toContainText(/No file chosen/);
    });
    
certCTRNFixtures('yes exam accomodation, add step to left bar', async ({
    certCTRN,
    page
    }) => {
    await certCTRN.fillOutExamInfo_CTRN();
    await certCTRN.clickYesExamAccom();
    await certCTRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCTRN.examAccommLeftBar).toBeVisible();
    });

certCTRNFixtures('expect next button hidden', async ({
    certCTRN,
    page
    }) => {
        await page.pause();
    await expect(certCTRN.pagination).toContainText('Please complete all required fields');
    await expect(certCTRN.nextButton).toBeHidden();
    await certCTRN.fillOutExamInfo_CTRN();
    await certCTRN.checkBoxesOneByOne();
});

certCTRNFixtures('test assurance error message', async ({
    certCTRN,
    page
    }) => {
    await certCTRN.fillOutExamInfo_CTRN();
    await certCTRN.clickNext();
    await certCTRN.nextButton.click();
    await expect(certCTRN.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
});

certCTRNFixtures('error messages on exam information', async ({
    certCTRN,
    page
    }) => {
        await certCTRN.fillOutExamInfo_CTRN();
        await certCTRN.licenseNumber.fill('');
        await certCTRN.selectState('Select One');
        await certCTRN.expirationDate.fill('');
        await certCTRN.selectMembershipASTNA('Select One');
        await certCTRN.clickNoMilDiscount();
        await expect(certCTRN.rnLicenseError).toBeVisible();
        await expect(certCTRN.rnStateError).toBeVisible();
        await expect(certCTRN.expirationError).toBeVisible();
        await expect(certCTRN.astnaMemberError).toBeVisible();
    });

certCTRNFixtures('toggle membership - memberNumber input opens and closes', async ({
    certCTRN,
    page
    }) => {
        await certCTRN.toggleMembershipASTNA();
        await certCTRN.toggleMembershipASTNA();
});

certCTRNFixtures('side graphic matches header, has orange color', async ({
    certCTRN,
    page
    }) => {
        await page.waitForLoadState('load');
        //exam info
        await certCTRN.checkHeaderMatchesSidebar();
        await certCTRN.fillOutExamInfo_CTRN();
        await certCTRN.clickNext();
        //test assurance
        await certCTRN.goToTestAssurance();
        await certCTRN.checkHeaderMatchesSidebar();
        //credential verification
        await certCTRN.goToCredentialVerification();
        await certCTRN.checkHeaderMatchesSidebar();
        //status
        await certCTRN.goToStatus();
        await certCTRN.checkHeaderMatchesSidebar();
    });

  certCTRNFixtures.describe('no member', () => {
    certCTRNFixtures.beforeEach('no member', async ({
        certCTRN
        }) => {
            await certCTRN.fillOutExamInfo_CTRN();
            await certCTRN.selectMembershipASTNA('No');
    
            await certCTRN.clickNext();
        });

        certCTRNFixtures('not member, yes assurance', async ({
            certCTRN,
            page
            }) => {
                await certCTRN.clickYesTestAssurance();
                await certCTRN.clickNext();
                //move to Credential Verification
                await certCTRN.clickNext();
                //move to Status
                await certCTRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout
                await certCTRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCTRN.checkoutTable).toContainText(certCTRN.priceNoMemYesAssur)
                await expect.soft(certCTRN.checkoutTable).toContainText('includes Test Assurance');
                await certCTRN.clearCheckout();

                await expect(certCTRN.checkoutTable).toBeHidden();
            });
        certCTRNFixtures('not member, no assurance', async ({
            page,
            certCTRN
            }) => {
                await certCTRN.clickNoTestAssurance();
                await certCTRN.clickNext();
                //move to Credential Verification
                await certCTRN.clickNext();
                //move to Status
                await certCTRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout'
                await certCTRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCTRN.checkoutTable).toContainText(certCTRN.priceNoMemNoAssur)
                await certCTRN.clearCheckout();
    
                await expect(certCTRN.checkoutTable).toBeHidden();
            });
  });

  certCTRNFixtures.describe('yes member', () => {
    certCTRNFixtures.beforeEach('yes member', async ({
        certCTRN
        }) => {
            await certCTRN.fillOutExamInfo_CTRN();
            await certCTRN.selectMembershipASTNA('Yes');
            await certCTRN.fillMemberNumberASTNA('1234');
            await certCTRN.clickNoMilDiscount();
    
            await certCTRN.clickNext();
        });

        certCTRNFixtures('yes member, yes assurance', async ({
            page,
            certCTRN
            }) => {
                await certCTRN.clickYesTestAssurance();
                await certCTRN.clickNext();
                //move to Credential Verification
                await certCTRN.clickNext();
                //move to Status
                await certCTRN.clickCheckoutButton();
                //move to checkout
                await page.waitForLoadState('load');
                await certCTRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCTRN.checkoutTable).toContainText(certCTRN.priceYesMemYesAssur);
                await expect.soft(certCTRN.checkoutTable).toContainText('includes Test Assurance');
                await certCTRN.clearCheckout();
    
                await expect(certCTRN.checkoutTable).toBeHidden();
            });
        certCTRNFixtures('yes member, no assurance', async ({
            page,
            certCTRN
            }) => {
                await certCTRN.clickNoTestAssurance();
                await certCTRN.clickNext();
                //move to Credential Verification
                await certCTRN.clickNext();
                //move to Status
                await certCTRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                await certCTRN.checkoutTable.waitFor({ state: 'visible' });
                //move to checkout
                await expect(certCTRN.checkoutTable).toContainText(certCTRN.priceYesMemNoAssur_others);
                await certCTRN.clearCheckout();
    
                await expect(certCTRN.checkoutTable).toBeHidden();
            });
  });


certCTRNFixtures.describe('checkout tests', () => {
    //THIS METHODOLOGY IS TEMPORARY...SAVES A GIVEN CHECKOUT SCREEN'S TO A JSON FILE TO RETURN TO IN OTHER TESTS
certCTRNFixtures('grab checkout url, save to json', async ({
    certCTRN,
    page
    }) => {
        await certCTRN.fillOutExamInfo_CTRN();
        await certCTRN.clickNext();
        await certCTRN.clickNoTestAssurance();
        await certCTRN.clickNext();
        await certCTRN.clickNext();
        await certCTRN.clickCheckoutButton();
        await expect(certCTRN.workflowTitle).toHaveText('Checkout and Make Payment');
        //grab the unique url for this submittal
        const submittalURL = page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cen-url-checkout.json', JSON.stringify(submittalURL));
    });
  certCTRNFixtures('add blank voucher', async ({
    certCTRN,
    page
    }) => {
        const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
        await page.goto(url);
        await certCTRN.clickAddVoucher();
        await expect(certCTRN.voucherErrorPopup).toBeVisible();
        await certCTRN.clickCloseVoucherError();
        await expect(certCTRN.addVoucherButton).toBeVisible();
    });

    certCTRNFixtures('payment type visibility - credit', async ({
        certCTRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCTRN.selectPaymentOption('CREDIT CARD');
            await expect(certCTRN.creditCardOptions).toBeVisible();
            await certCTRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(certCTRN.submitButton).toBeVisible();
        });

    certCTRNFixtures('payment type visibility - echeck/ach', async ({
        certCTRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCTRN.selectPaymentOption('ACHRT');
            await expect(certCTRN.submitButton).toBeVisible();
        });

    certCTRNFixtures('payment type visibility - check', async ({
        certCTRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await page.waitForLoadState('load');
            await certCTRN.paymentOptions.click();
            await certCTRN.selectPaymentOption('PAY_BY_CHECK');
            await certCTRN.paymentOptions.click();
            await expect(certCTRN.submitCheckButton).toBeVisible();
        });
  });
  certCTRNFixtures.describe('payment tests', () => {
    certCTRNFixtures.beforeEach('get to payment', async ({
      certCTRN,
      page
      }) => {
          await certCTRN.fillOutExamInfo_CTRN();
          await certCTRN.clickNext();
          await certCTRN.clickNoTestAssurance();
          await certCTRN.clickNext();
          await page.waitForLoadState('load');
          await certCTRN.clickNext();
          await page.waitForLoadState('load');
          await certCTRN.clickCheckoutButton();
          await page.waitForLoadState('load');
  
          await certCTRN.selectPaymentOption('CREDIT CARD');
          await expect(certCTRN.creditCardOptions).toBeVisible();
          await certCTRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
          await expect(certCTRN.submitButton).toBeVisible();
          await certCTRN.clickSubmitCheckout();
      });
      certCTRNFixtures('submit blank', async ({
          certCTRN,
          page
          }) => {
              await certCTRN.fillNameOnCard('');
              await certCTRN.fillCardNumber('');
              await certCTRN.fillCVV('');
              await certCTRN.selectMonth('Select');
              await certCTRN.selectYear('Select');
              await certCTRN.fillStreetAddress('');
              await certCTRN.fillZipCode('');
              await certCTRN.selectCountry({ value: '' });
              await certCTRN.submitCardDetails();
  
              await expect(certCTRN.nameError).toBeVisible();
              await expect(certCTRN.cardNumError).toBeVisible();
              await expect(certCTRN.cvvError).toBeVisible();
              await expect(certCTRN.monthError).toBeVisible();
              await expect(certCTRN.yearError).toBeVisible();
              await expect(certCTRN.addressError).toBeVisible();
              await expect(certCTRN.zipCodeError).toBeVisible();
              await expect(certCTRN.countryError).toBeVisible();
              await expect(certCTRN.countryError).toBeVisible();
              });
        certCTRNFixtures('cancel, back to checkout', async ({
        certCTRN,
        page
        }) => {
            await certCTRN.cancelButton.click();
            await page.waitForLoadState('networkidle');
            await expect(certCTRN.workflowTitle).toContainText('Checkout and Make Payment');
    });
//DO NOT RUN THIS NEXT TEST UNTIL WE HAVE A WAY TO UNDO THIS PROCESS
    certCTRNFixtures.skip('successful case', async ({
        certCTRN,
        page,
        homePage
        }) => {
            await certCTRN.fillCardNumber('341111597242000');
            await certCTRN.fillCVV('1154');
            await certCTRN.selectMonth('12');
            await certCTRN.selectYear('2025');
            await certCTRN.submitCardDetails();
            await page.waitForLoadState('load');

            await homePage.visit();
            await expect(homePage.buttonCTRN).toContainText(/SCHEDULE\/MANAGE EXAM/i);

    });
  });