import { certCPENFixtures, expect } from "../fixtures/certCPEN.fixtures";
import fs from 'fs';

//if you get errors, search 'ENA'. Might need to change, depending on what membership is relevant

  certCPENFixtures.beforeEach('wipe submittals', async ({
    certCPEN,
    page,
    homePage
    }) => {
    await homePage.visit();
        // Check if "Apply for Certification" text is present
    await homePage.removeSubmittal('CPEN');
    await certCPEN.visitCPEN();
    });

  //structure as an if-then. If the application isn't clean, then run the submittal-remover and then start the process again. Otherwise run the test.
certCPENFixtures('update home page label to in progress', async ({
    certCPEN,
    homePage,
    page
    }) => {
    await certCPEN.fillOutExamInfo_CPEN();
    await certCPEN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCPEN.workflowTitle).toHaveText('Test Assurance');
    await homePage.visit();
    await expect(homePage.buttonCPEN).toContainText(/In Process/i);
    });

certCPENFixtures('update home page label to checkout', async ({
    certCPEN,
    homePage,
    page
    }) => {
    await certCPEN.fillOutExamInfo_CPEN();
    await certCPEN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCPEN.workflowTitle).toHaveText('Test Assurance');
    await certCPEN.clickNoTestAssurance();
    await certCPEN.clickNext();
    await certCPEN.clickNext();
    await certCPEN.clickCheckoutButton();
    //the problem with this next step is a simple timeout issue due to load time.
    await page.waitForLoadState('load');
    await expect(certCPEN.workflowTitle).toHaveText('Checkout and Make Payment');
    //Checkout
    await homePage.visit();
    await expect(homePage.buttonCPEN).toContainText(/Checkout/i);
    });

certCPENFixtures('update home page label to military documentation review', async ({
    certCPEN,
    homePage,
    page
    }) => {
    await certCPEN.fillOutYesMil_CPEN();
    await page.waitForLoadState('load');
    await expect(certCPEN.workflowTitle).toHaveText('Upload Military Documentation');
    await certCPEN.fileInput.setInputFiles(certCPEN.filePath);
    await page.waitForLoadState('load');
    await expect(certCPEN.uploadMessage).toContainText('successfully uploaded');
    await certCPEN.clickNext();
    await page.getByRole('link', { name: 'Advance to Military' }).click();
    await expect(certCPEN.workflowTitle).toHaveText('Military Discount Instructions');
    //Military Documentation Review
    await homePage.visit();
    await expect(homePage.buttonCPEN).toContainText(/Military Documentation Review/i);
    });

certCPENFixtures('can remove uploaded files from military docs', async ({
    certCPEN,
    homePage,
    page
    }) => {
    await certCPEN.fillOutYesMil_CPEN();
    await page.waitForLoadState('load');
    await expect(certCPEN.workflowTitle).toHaveText('Upload Military Documentation');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');
    const fileInput = certCPEN.fileInput;
    await fileInput.setInputFiles(filePath);

    const fileInput2 = certCPEN.fileInput2;
    await fileInput2.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCPEN.uploadMessage).toContainText('successfully uploaded');
    //delete and confirm delete
    await certCPEN.deleteFile1.click();
    await certCPEN.deleteFile2.click();
    await expect(certCPEN.file1NoFile).toContainText(/No file chosen/);
    await expect(certCPEN.file2NoFile).toContainText(/No file chosen/);
    });

certCPENFixtures('can remove uploaded files from exam accommodation', async ({
    certCPEN,
    homePage,
    page
    }) => {
    await certCPEN.fillOutYesAccom_CPEN();
    await page.waitForLoadState('load');
    await expect(certCPEN.workflowTitle).toHaveText('Exam Accommodation Request');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');

    await certCPEN.examAccommUpload.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCPEN.accomUploadMessage).toContainText('successfully uploaded');
    await certCPEN.deleteExamAccom.click();
    await expect(certCPEN.accomNoFile).toContainText(/No file chosen/);
    });
    
certCPENFixtures('yes exam accomodation, add step to left bar', async ({
    certCPEN,
    page
    }) => {
    await certCPEN.fillOutExamInfo_CPEN();
    await certCPEN.clickYesExamAccom();
    await certCPEN.clickNext();
    await page.waitForLoadState('load');
    await expect(certCPEN.examAccommLeftBar).toBeVisible();
    });

certCPENFixtures('expect next button hidden', async ({
    certCPEN,
    page
    }) => {
        await page.pause();
    await expect(certCPEN.pagination).toContainText('Please complete all required fields');
    await expect(certCPEN.nextButton).toBeHidden();
    await certCPEN.fillOutExamInfo_CPEN();
    await certCPEN.checkBoxesOneByOne();
});

certCPENFixtures('test assurance error message', async ({
    certCPEN,
    page
    }) => {
    await certCPEN.fillOutExamInfo_CPEN();
    await certCPEN.clickNext();
    await certCPEN.nextButton.click();
    await expect(certCPEN.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
});

certCPENFixtures('error messages on exam information', async ({
    certCPEN,
    page
    }) => {
        await certCPEN.fillOutExamInfo_CPEN();
        await certCPEN.licenseNumber.fill('');
        await certCPEN.selectState('Select One');
        await certCPEN.expirationDate.fill('');
        await certCPEN.selectMembershipENA('Select One');
        await certCPEN.clickNoMilDiscount();
        await expect(certCPEN.rnLicenseError).toBeVisible();
        await expect(certCPEN.rnStateError).toBeVisible();
        await expect(certCPEN.expirationError).toBeVisible();
        await expect(certCPEN.abaMemberError).toBeVisible();
    });

certCPENFixtures('toggle membership - memberNumber input opens and closes', async ({
    certCPEN,
    page
    }) => {
        await certCPEN.toggleMembershipENA();
        await certCPEN.toggleMembershipENA();
});

certCPENFixtures('side graphic matches header, has orange color', async ({
    certCPEN,
    page
    }) => {
        await page.waitForLoadState('load');
        //exam info
        await certCPEN.checkHeaderMatchesSidebar();
        await certCPEN.fillOutExamInfo_CPEN();
        await certCPEN.clickNext();
        //test assurance
        await certCPEN.goToTestAssurance();
        await certCPEN.checkHeaderMatchesSidebar();
        //credential verification
        await certCPEN.goToCredentialVerification();
        await certCPEN.checkHeaderMatchesSidebar();
        //status
        await certCPEN.goToStatus();
        await certCPEN.checkHeaderMatchesSidebar();
    });

  certCPENFixtures.describe('no member', () => {
    certCPENFixtures.beforeEach('no member', async ({
        certCPEN
        }) => {
            await certCPEN.fillOutExamInfo_CPEN();
            await certCPEN.selectMembershipENA('No');
    
            await certCPEN.clickNext();
        });

        certCPENFixtures('not member, yes assurance', async ({
            certCPEN,
            page
            }) => {
                await certCPEN.clickYesTestAssurance();
                await certCPEN.clickNext();
                //move to Credential Verification
                await certCPEN.clickNext();
                //move to Status
                await certCPEN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout
                await certCPEN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCPEN.checkoutTable).toContainText(certCPEN.priceNoMemYesAssur)
                await expect.soft(certCPEN.checkoutTable).toContainText('includes Test Assurance');
                await certCPEN.clearCheckout();

                await expect(certCPEN.checkoutTable).toBeHidden();
            });
        certCPENFixtures('not member, no assurance', async ({
            page,
            certCPEN
            }) => {
                await certCPEN.clickNoTestAssurance();
                await certCPEN.clickNext();
                //move to Credential Verification
                await certCPEN.clickNext();
                //move to Status
                await certCPEN.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout'
                await certCPEN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCPEN.checkoutTable).toContainText(certCPEN.priceNoMemNoAssur)
                await certCPEN.clearCheckout();
    
                await expect(certCPEN.checkoutTable).toBeHidden();
            });
  });

  certCPENFixtures.describe('yes member', () => {
    certCPENFixtures.beforeEach('yes member', async ({
        certCPEN
        }) => {
            await certCPEN.fillOutExamInfo_CPEN();
            await certCPEN.selectMembershipENA('Yes');
            await certCPEN.fillMemberNumberENA('1234');
            await certCPEN.clickNoMilDiscount();
    
            await certCPEN.clickNext();
        });

        certCPENFixtures('yes member, yes assurance', async ({
            page,
            certCPEN
            }) => {
                await certCPEN.clickYesTestAssurance();
                await certCPEN.clickNext();
                //move to Credential Verification
                await certCPEN.clickNext();
                //move to Status
                await certCPEN.clickCheckoutButton();
                //move to checkout
                await page.waitForLoadState('load');
                await certCPEN.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCPEN.checkoutTable).toContainText(certCPEN.priceYesMemYesAssur);
                await expect.soft(certCPEN.checkoutTable).toContainText('includes Test Assurance');
                await certCPEN.clearCheckout();
    
                await expect(certCPEN.checkoutTable).toBeHidden();
            });
        certCPENFixtures('yes member, no assurance', async ({
            page,
            certCPEN
            }) => {
                await certCPEN.clickNoTestAssurance();
                await certCPEN.clickNext();
                //move to Credential Verification
                await certCPEN.clickNext();
                //move to Status
                await certCPEN.clickCheckoutButton();
                await page.waitForLoadState('load');
                await certCPEN.checkoutTable.waitFor({ state: 'visible' });
                //move to checkout
                await expect(certCPEN.checkoutTable).toContainText(certCPEN.priceYesMemNoAssur_others);
                await certCPEN.clearCheckout();
    
                await expect(certCPEN.checkoutTable).toBeHidden();
            });
  });


certCPENFixtures.describe('checkout tests', () => {
    //THIS METHODOLOGY IS TEMPORARY...SAVES A GIVEN CHECKOUT SCREEN'S TO A JSON FILE TO RETURN TO IN OTHER TESTS
certCPENFixtures('grab checkout url, save to json', async ({
    certCPEN,
    page
    }) => {
        await certCPEN.fillOutExamInfo_CPEN();
        await certCPEN.clickNext();
        await certCPEN.clickNoTestAssurance();
        await certCPEN.clickNext();
        await certCPEN.clickNext();
        await certCPEN.clickCheckoutButton();
        await expect(certCPEN.workflowTitle).toHaveText('Checkout and Make Payment');
        //grab the unique url for this submittal
        const submittalURL = page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cen-url-checkout.json', JSON.stringify(submittalURL));
    });
  certCPENFixtures('add blank voucher', async ({
    certCPEN,
    page
    }) => {
        const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
        await page.goto(url);
        await certCPEN.clickAddVoucher();
        await expect(certCPEN.voucherErrorPopup).toBeVisible();
        await certCPEN.clickCloseVoucherError();
        await expect(certCPEN.addVoucherButton).toBeVisible();
    });

    certCPENFixtures('payment type visibility - credit', async ({
        certCPEN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCPEN.selectPaymentOption('CREDIT CARD');
            await expect(certCPEN.creditCardOptions).toBeVisible();
            await certCPEN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(certCPEN.submitButton).toBeVisible();
        });

    certCPENFixtures('payment type visibility - echeck/ach', async ({
        certCPEN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCPEN.selectPaymentOption('ACHRT');
            await expect(certCPEN.submitButton).toBeVisible();
        });

    certCPENFixtures('payment type visibility - check', async ({
        certCPEN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await page.waitForLoadState('load');
            await certCPEN.paymentOptions.click();
            await certCPEN.selectPaymentOption('PAY_BY_CHECK');
            await certCPEN.paymentOptions.click();
            await expect(certCPEN.submitCheckButton).toBeVisible();
        });
  });
  certCPENFixtures.describe('payment tests', () => {
    certCPENFixtures.beforeEach('get to payment', async ({
      certCPEN,
      page
      }) => {
          await certCPEN.fillOutExamInfo_CPEN();
          await certCPEN.clickNext();
          await certCPEN.clickNoTestAssurance();
          await certCPEN.clickNext();
          await page.waitForLoadState('load');
          await certCPEN.clickNext();
          await page.waitForLoadState('load');
          await certCPEN.clickCheckoutButton();
          await page.waitForLoadState('load');
  
          await certCPEN.selectPaymentOption('CREDIT CARD');
          await expect(certCPEN.creditCardOptions).toBeVisible();
          await certCPEN.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
          await expect(certCPEN.submitButton).toBeVisible();
          await certCPEN.clickSubmitCheckout();
      });
      certCPENFixtures('submit blank', async ({
          certCPEN,
          page
          }) => {
              await certCPEN.fillNameOnCard('');
              await certCPEN.fillCardNumber('');
              await certCPEN.fillCVV('');
              await certCPEN.selectMonth('Select');
              await certCPEN.selectYear('Select');
              await certCPEN.fillStreetAddress('');
              await certCPEN.fillZipCode('');
              await certCPEN.selectCountry({ value: '' });
              await certCPEN.submitCardDetails();
  
              await expect(certCPEN.nameError).toBeVisible();
              await expect(certCPEN.cardNumError).toBeVisible();
              await expect(certCPEN.cvvError).toBeVisible();
              await expect(certCPEN.monthError).toBeVisible();
              await expect(certCPEN.yearError).toBeVisible();
              await expect(certCPEN.addressError).toBeVisible();
              await expect(certCPEN.zipCodeError).toBeVisible();
              await expect(certCPEN.countryError).toBeVisible();
              await expect(certCPEN.countryError).toBeVisible();
              });
        certCPENFixtures('cancel, back to checkout', async ({
        certCPEN,
        page
        }) => {
            await certCPEN.cancelButton.click();
            await page.waitForLoadState('networkidle');
            await expect(certCPEN.workflowTitle).toContainText('Checkout and Make Payment');
    });
//DO NOT RUN THIS NEXT TEST UNTIL WE HAVE A WAY TO UNDO THIS PROCESS
    certCPENFixtures.skip('successful case', async ({
        certCPEN,
        page,
        homePage
        }) => {
            await certCPEN.fillCardNumber('341111597242000');
            await certCPEN.fillCVV('1154');
            await certCPEN.selectMonth('12');
            await certCPEN.selectYear('2025');
            await certCPEN.submitCardDetails();
            await page.waitForLoadState('load');

            await homePage.visit();
            await expect(homePage.buttonCPEN).toContainText(/SCHEDULE\/MANAGE EXAM/i);

    });
  });