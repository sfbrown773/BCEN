import { certCFRNFixtures, expect } from "../fixtures/certCFRN.fixtures";
import fs from 'fs';


  certCFRNFixtures.beforeEach('wipe submittals', async ({
    certCFRN,
    page,
    homePage
    }) => {
    await homePage.visit();
        // Check if "Apply for Certification" text is present
    await homePage.removeSubmittal('CFRN');
    await certCFRN.visitCFRN();
    });

  //structure as an if-then. If the application isn't clean, then run the submittal-remover and then start the process again. Otherwise run the test.
certCFRNFixtures('update home page label to in progress', async ({
    certCFRN,
    homePage,
    page
    }) => {
    await certCFRN.fillOutExamInfo_CFRN();
    await certCFRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCFRN.workflowTitle).toHaveText('Test Assurance');
    await homePage.visit();
    await expect(homePage.buttonCFRN).toContainText(/In Process/i);
    });

certCFRNFixtures('update home page label to checkout', async ({
    certCFRN,
    homePage,
    page
    }) => {
    await certCFRN.fillOutExamInfo_CFRN();
    await certCFRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCFRN.workflowTitle).toHaveText('Test Assurance');
    await certCFRN.clickNoTestAssurance();
    await certCFRN.clickNext();
    await certCFRN.clickNext();
    await certCFRN.clickCheckoutButton();
    //the problem with this next step is a simple timeout issue due to load time.
    await page.waitForLoadState('load');
    await expect(certCFRN.workflowTitle).toHaveText('Checkout and Make Payment');
    //Checkout
    await homePage.visit();
    await expect(homePage.buttonCFRN).toContainText(/Checkout/i);
    });

certCFRNFixtures('update home page label to military documentation review', async ({
    certCFRN,
    homePage,
    page
    }) => {
    await certCFRN.fillOutYesMil_CFRN();
    await page.waitForLoadState('load');
    await expect(certCFRN.workflowTitle).toHaveText('Upload Military Documentation');
    await certCFRN.fileInput.setInputFiles(certCFRN.filePath);
    await page.waitForLoadState('load');
    await expect(certCFRN.uploadMessage).toContainText('successfully uploaded');
    await certCFRN.clickNext();
    await page.getByRole('link', { name: 'Advance to Military' }).click();
    await expect(certCFRN.workflowTitle).toHaveText('Military Discount Instructions');
    //Military Documentation Review
    await homePage.visit();
    await expect(homePage.buttonCFRN).toContainText(/Military Documentation Review/i);
    });

certCFRNFixtures('can remove uploaded files from military docs', async ({
    certCFRN,
    homePage,
    page
    }) => {
    await certCFRN.fillOutYesMil_CFRN();
    await page.waitForLoadState('load');
    await expect(certCFRN.workflowTitle).toHaveText('Upload Military Documentation');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');
    const fileInput = certCFRN.fileInput;
    await fileInput.setInputFiles(filePath);

    const fileInput2 = certCFRN.fileInput2;
    await fileInput2.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCFRN.uploadMessage).toContainText('successfully uploaded');
    //delete and confirm delete
    await certCFRN.deleteFile1.click();
    await certCFRN.deleteFile2.click();
    await expect(certCFRN.file1NoFile).toContainText(/No file chosen/);
    await expect(certCFRN.file2NoFile).toContainText(/No file chosen/);
    });

certCFRNFixtures('can remove uploaded files from exam accommodation', async ({
    certCFRN,
    homePage,
    page
    }) => {
    await certCFRN.fillOutYesAccom_CFRN();
    await page.waitForLoadState('load');
    await expect(certCFRN.workflowTitle).toHaveText('Exam Accommodation Request');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');

    await certCFRN.examAccommUpload.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCFRN.accomUploadMessage).toContainText('successfully uploaded');
    await certCFRN.deleteExamAccom.click();
    await expect(certCFRN.accomNoFile).toContainText(/No file chosen/);
    });
    
certCFRNFixtures('yes exam accomodation, add step to left bar', async ({
    certCFRN,
    page
    }) => {
    await certCFRN.fillOutExamInfo_CFRN();
    await certCFRN.clickYesExamAccom();
    await certCFRN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCFRN.examAccommLeftBar).toBeVisible();
    });

certCFRNFixtures('expect next button hidden', async ({
    certCFRN,
    page
    }) => {
        await page.pause();
    await expect(certCFRN.pagination).toContainText('Please complete all required fields');
    await expect(certCFRN.nextButton).toBeHidden();
    await certCFRN.fillOutExamInfo_CFRN();
    await certCFRN.checkBoxesOneByOne();
});

certCFRNFixtures('test assurance error message', async ({
    certCFRN,
    page
    }) => {
    await certCFRN.fillOutExamInfo_CFRN();
    await certCFRN.clickNext();
    await certCFRN.nextButton.click();
    await expect(certCFRN.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
});

certCFRNFixtures('error messages on exam information', async ({
    certCFRN,
    page
    }) => {
        await certCFRN.fillOutExamInfo_CFRN();
        await certCFRN.licenseNumber.fill('');
        await certCFRN.selectState('Select One');
        await certCFRN.expirationDate.fill('');
        await certCFRN.selectMembershipASTNA('Select One');
        await certCFRN.clickNoMilDiscount();
        await expect(certCFRN.rnLicenseError).toBeVisible();
        await expect(certCFRN.rnStateError).toBeVisible();
        await expect(certCFRN.expirationError).toBeVisible();
        await expect(certCFRN.astnaMemberError).toBeVisible();
    });

certCFRNFixtures('toggle membership - memberNumber input opens and closes', async ({
    certCFRN,
    page
    }) => {
        await certCFRN.toggleMembershipASTNA();
        await certCFRN.toggleMembershipASTNA();
});

certCFRNFixtures('side graphic matches header, has orange color', async ({
    certCFRN,
    page
    }) => {
        await page.waitForLoadState('load');
        //exam info
        await certCFRN.checkHeaderMatchesSidebar();
        await certCFRN.fillOutExamInfo_CFRN();
        await certCFRN.clickNext();
        //test assurance
        await certCFRN.goToTestAssurance();
        await certCFRN.checkHeaderMatchesSidebar();
        //credential verification
        await certCFRN.goToCredentialVerification();
        await certCFRN.checkHeaderMatchesSidebar();
        //status
        await certCFRN.goToStatus();
        await certCFRN.checkHeaderMatchesSidebar();
    });

  certCFRNFixtures.describe('no member', () => {
    certCFRNFixtures.beforeEach('no member', async ({
        certCFRN
        }) => {
            await certCFRN.fillOutExamInfo_CFRN();
            await certCFRN.selectMembershipASTNA('No');
    
            await certCFRN.clickNext();
        });

        certCFRNFixtures('not member, yes assurance', async ({
            certCFRN,
            page
            }) => {
                await certCFRN.clickYesTestAssurance();
                await certCFRN.clickNext();
                //move to Credential Verification
                await certCFRN.clickNext();
                //move to Status
                await certCFRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout
                await certCFRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCFRN.checkoutTable).toContainText(certCFRN.priceNoMemYesAssur)
                await expect.soft(certCFRN.checkoutTable).toContainText('includes Test Assurance');
                await certCFRN.clearCheckout();

                await expect(certCFRN.checkoutTable).toBeHidden();
            });
        certCFRNFixtures('not member, no assurance', async ({
            page,
            certCFRN
            }) => {
                await certCFRN.clickNoTestAssurance();
                await certCFRN.clickNext();
                //move to Credential Verification
                await certCFRN.clickNext();
                //move to Status
                await certCFRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout'
                await certCFRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCFRN.checkoutTable).toContainText(certCFRN.priceNoMemNoAssur)
                await certCFRN.clearCheckout();
    
                await expect(certCFRN.checkoutTable).toBeHidden();
            });
  });

  certCFRNFixtures.describe('yes member', () => {
    certCFRNFixtures.beforeEach('yes member', async ({
        certCFRN
        }) => {
            await certCFRN.fillOutExamInfo_CFRN();
            await certCFRN.selectMembershipASTNA('Yes');
            await certCFRN.fillMemberNumberASTNA('1234');
            await certCFRN.clickNoMilDiscount();
    
            await certCFRN.clickNext();
        });

        certCFRNFixtures('yes member, yes assurance', async ({
            page,
            certCFRN
            }) => {
                await certCFRN.clickYesTestAssurance();
                await certCFRN.clickNext();
                //move to Credential Verification
                await certCFRN.clickNext();
                //move to Status
                await certCFRN.clickCheckoutButton();
                //move to checkout
                await page.waitForLoadState('load');
                await certCFRN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCFRN.checkoutTable).toContainText(certCFRN.priceYesMemYesAssur);
                await expect.soft(certCFRN.checkoutTable).toContainText('includes Test Assurance');
                await certCFRN.clearCheckout();
    
                await expect(certCFRN.checkoutTable).toBeHidden();
            });
        certCFRNFixtures('yes member, no assurance', async ({
            page,
            certCFRN
            }) => {
                await certCFRN.clickNoTestAssurance();
                await certCFRN.clickNext();
                //move to Credential Verification
                await certCFRN.clickNext();
                //move to Status
                await certCFRN.clickCheckoutButton();
                await page.waitForLoadState('load');
                await certCFRN.checkoutTable.waitFor({ state: 'visible' });
                //move to checkout
                await expect(certCFRN.checkoutTable).toContainText(certCFRN.priceYesMemNoAssur_others);
                await certCFRN.clearCheckout();
    
                await expect(certCFRN.checkoutTable).toBeHidden();
            });
  });


certCFRNFixtures.describe('checkout tests', () => {
    //THIS METHODOLOGY IS TEMPORARY...SAVES A GIVEN CHECKOUT SCREEN'S TO A JSON FILE TO RETURN TO IN OTHER TESTS
certCFRNFixtures('grab checkout url, save to json', async ({
    certCFRN,
    page
    }) => {
        await certCFRN.fillOutExamInfo_CFRN();
        await certCFRN.clickNext();
        await certCFRN.clickNoTestAssurance();
        await certCFRN.clickNext();
        await certCFRN.clickNext();
        await certCFRN.clickCheckoutButton();
        await expect(certCFRN.workflowTitle).toHaveText('Checkout and Make Payment');
        //grab the unique url for this submittal
        const submittalURL = page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cen-url-checkout.json', JSON.stringify(submittalURL));
    });
  certCFRNFixtures('add blank voucher', async ({
    certCFRN,
    page
    }) => {
        const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
        await page.goto(url);
        await certCFRN.clickAddVoucher();
        await expect(certCFRN.voucherErrorPopup).toBeVisible();
        await certCFRN.clickCloseVoucherError();
        await expect(certCFRN.addVoucherButton).toBeVisible();
    });

    certCFRNFixtures('payment type visibility - credit', async ({
        certCFRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCFRN.selectPaymentOption('CREDIT CARD');
            await expect(certCFRN.creditCardOptions).toBeVisible();
            await certCFRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(certCFRN.submitButton).toBeVisible();
        });

    certCFRNFixtures('payment type visibility - echeck/ach', async ({
        certCFRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCFRN.selectPaymentOption('ACHRT');
            await expect(certCFRN.submitButton).toBeVisible();
        });

    certCFRNFixtures('payment type visibility - check', async ({
        certCFRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await page.waitForLoadState('load');
            await certCFRN.paymentOptions.click();
            await certCFRN.selectPaymentOption('PAY_BY_CHECK');
            await certCFRN.paymentOptions.click();
            await expect(certCFRN.submitCheckButton).toBeVisible();
        });
  });
  certCFRNFixtures.describe('payment tests', () => {
    certCFRNFixtures.beforeEach('get to payment', async ({
      certCFRN,
      page
      }) => {
          await certCFRN.fillOutExamInfo_CFRN();
          await certCFRN.clickNext();
          await certCFRN.clickNoTestAssurance();
          await certCFRN.clickNext();
          await page.waitForLoadState('load');
          await certCFRN.clickNext();
          await page.waitForLoadState('load');
          await certCFRN.clickCheckoutButton();
          await page.waitForLoadState('load');
  
          await certCFRN.selectPaymentOption('CREDIT CARD');
          await expect(certCFRN.creditCardOptions).toBeVisible();
          await certCFRN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
          await expect(certCFRN.submitButton).toBeVisible();
          await certCFRN.clickSubmitCheckout();
      });
      certCFRNFixtures('submit blank', async ({
          certCFRN,
          page
          }) => {
              await certCFRN.fillNameOnCard('');
              await certCFRN.fillCardNumber('');
              await certCFRN.fillCVV('');
              await certCFRN.selectMonth('Select');
              await certCFRN.selectYear('Select');
              await certCFRN.fillStreetAddress('');
              await certCFRN.fillZipCode('');
              await certCFRN.selectCountry({ value: '' });
              await certCFRN.submitCardDetails();
  
              await expect(certCFRN.nameError).toBeVisible();
              await expect(certCFRN.cardNumError).toBeVisible();
              await expect(certCFRN.cvvError).toBeVisible();
              await expect(certCFRN.monthError).toBeVisible();
              await expect(certCFRN.yearError).toBeVisible();
              await expect(certCFRN.addressError).toBeVisible();
              await expect(certCFRN.zipCodeError).toBeVisible();
              await expect(certCFRN.countryError).toBeVisible();
              await expect(certCFRN.countryError).toBeVisible();
              });
        certCFRNFixtures('cancel, back to checkout', async ({
        certCFRN,
        page
        }) => {
            await certCFRN.cancelButton.click();
            await page.waitForLoadState('networkidle');
            await expect(certCFRN.workflowTitle).toContainText('Checkout and Make Payment');
    });
//DO NOT RUN THIS NEXT TEST UNTIL WE HAVE A WAY TO UNDO THIS PROCESS
    certCFRNFixtures.skip('successful case', async ({
        certCFRN,
        page,
        homePage
        }) => {
            await certCFRN.fillCardNumber('341111597242000');
            await certCFRN.fillCVV('1154');
            await certCFRN.selectMonth('12');
            await certCFRN.selectYear('2025');
            await certCFRN.submitCardDetails();
            await page.waitForLoadState('load');

            await homePage.visit();
            await expect(homePage.buttonCFRN).toContainText(/SCHEDULE\/MANAGE EXAM/i);

    });
  });