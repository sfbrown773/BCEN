import { certCENFixtures, expect } from '../fixtures/certCEN.fixtures';
import fs from 'fs';


  certCENFixtures.beforeEach('wipe submittals', async ({
    certCen,
    page,
    homePage
    }) => {
    await homePage.visit();
        // Check if "Apply for Certification" text is present
    await homePage.removeSubmittal('CEN');
    await certCen.visitCEN();
    });

  //structure as an if-then. If the application isn't clean, then run the submittal-remover and then start the process again. Otherwise run the test.
certCENFixtures('update home page label to in progress', async ({
    certCen,
    homePage,
    page
    }) => {
    await certCen.fillOutExamInfo_CEN();
    await certCen.clickNext();
    await page.waitForLoadState('load');
    await expect(certCen.workflowTitle).toHaveText('Test Assurance');
    await homePage.visit();
    await expect(homePage.buttonCEN).toContainText(/In Process/i);
    });

certCENFixtures('update home page label to checkout', async ({
    certCen,
    homePage,
    page
    }) => {
    await certCen.fillOutExamInfo_CEN();
    await certCen.clickNext();
    await page.waitForLoadState('load');
    await expect(certCen.workflowTitle).toHaveText('Test Assurance');
    await certCen.clickNoTestAssurance();
    await certCen.clickNext();
    await certCen.clickNext();
    await certCen.clickCheckoutButton();
    //the problem with this next step is a simple timeout issue due to load time.
    await page.waitForLoadState('load');
    await expect(certCen.workflowTitle).toHaveText('Checkout and Make Payment');
    //Checkout
    await homePage.visit();
    await expect(homePage.buttonCEN).toContainText(/Checkout/i);
    });

    //NO NEED TO PUT IN OTHER TESTS - DELETE CHECKOUT ITEMS WORKS THE SAME REGARDLESS OF CERT FLOWS
certCENFixtures('delete items from checkout', async ({
    certCen,
    homePage,
    page
    }) => {
    await certCen.fillOutExamInfo_CEN();
    await certCen.clickNext();
    await page.waitForLoadState('load');
    await expect(certCen.workflowTitle).toHaveText('Test Assurance');
    await certCen.clickNoTestAssurance();
    await certCen.clickNext();
    await certCen.clickNext();
    await certCen.clickCheckoutButton();
    await page.waitForLoadState('load');
    await page.pause();
    await expect(certCen.checkoutItem).toBeVisible();
    //Checkout
    await certCen.clearCheckout();
    await expect(certCen.checkoutItem).not.toBeVisible();
    });

certCENFixtures('update home page label to military documentation review', async ({
    certCen,
    homePage,
    page
    }) => {
    await certCen.fillOutYesMil_CEN();
    await page.waitForLoadState('load');
    await expect(certCen.workflowTitle).toHaveText('Upload Military Documentation');
    await certCen.fileInput.setInputFiles(certCen.filePath);
    await page.waitForLoadState('load');
    await expect(certCen.uploadMessage).toContainText('successfully uploaded');
    await certCen.clickNext();
    await page.getByRole('link', { name: 'Advance to Military' }).click();
    await expect(certCen.workflowTitle).toHaveText('Military Discount Instructions');
    //Military Documentation Review
    await homePage.visit();
    await expect(homePage.buttonCEN).toContainText(/Military Documentation Review/i);
    });

certCENFixtures('can remove uploaded files from military docs', async ({
    certCen,
    homePage,
    page
    }) => {
    await certCen.fillOutYesMil_CEN();
    await page.waitForLoadState('load');
    await expect(certCen.workflowTitle).toHaveText('Upload Military Documentation');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');
    const fileInput = certCen.fileInput;
    await fileInput.setInputFiles(filePath);

    const fileInput2 = certCen.fileInput2;
    await fileInput2.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCen.uploadMessage).toContainText('successfully uploaded');
    //delete and confirm delete
    await certCen.deleteFile1.click();
    await certCen.deleteFile2.click();
    await expect(certCen.file1NoFile).toContainText(/No file chosen/);
    await expect(certCen.file2NoFile).toContainText(/No file chosen/);
    });

certCENFixtures('can remove uploaded files from exam accommodation', async ({
    certCen,
    homePage,
    page
    }) => {
    await certCen.fillOutYesAccom_CEN();
    await page.waitForLoadState('load');
    await expect(certCen.workflowTitle).toHaveText('Exam Accommodation Request');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');

    await certCen.examAccommUpload.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCen.accomUploadMessage).toContainText('successfully uploaded');
    await certCen.deleteExamAccom.click();
    await expect(certCen.accomNoFile).toContainText(/No file chosen/);
    });
    
certCENFixtures('yes exam accomodation, add step to left bar', async ({
    certCen,
    page
    }) => {
    await certCen.fillOutExamInfo_CEN();
    await certCen.clickYesExamAccom();
    await certCen.clickNext();
    await page.waitForLoadState('load');
    await expect(certCen.examAccommLeftBar).toBeVisible();
    });

certCENFixtures('expect next button hidden', async ({
    certCen,
    page
    }) => {
        await page.pause();
    await expect(certCen.pagination).toContainText('Please complete all required fields');
    await expect(certCen.nextButton).toBeHidden();
    await certCen.fillOutExamInfo_CEN();
    await certCen.checkBoxesOneByOne();
});

certCENFixtures('test assurance error message', async ({
    certCen,
    page
    }) => {
    await certCen.fillOutExamInfo_CEN();
    await certCen.clickNext();
    await certCen.nextButton.click();
    await expect(certCen.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
});

certCENFixtures('error messages on exam information', async ({
    certCen,
    page
    }) => {
        await certCen.fillOutExamInfo_CEN();
        await certCen.licenseNumber.fill('');
        await certCen.selectState('Select One');
        await certCen.expirationDate.fill('');
        await certCen.selectMembershipENA('Select One');
        await certCen.clickNoMilDiscount();
        await expect(certCen.rnLicenseError).toBeVisible();
        await expect(certCen.rnStateError).toBeVisible();
        await expect(certCen.expirationError).toBeVisible();
        await expect(certCen.enaMemberError).toBeVisible();
    });

certCENFixtures('toggle membership - memberNumber input opens and closes', async ({
    certCen,
    page
    }) => {
        await certCen.toggleMembershipENA();
        await certCen.toggleMembershipENA();
});

certCENFixtures('side graphic matches header, has orange color', async ({
    certCen,
    page
    }) => {
        await page.waitForLoadState('load');
        //exam info
        await certCen.checkHeaderMatchesSidebar();
        await certCen.fillOutExamInfo_CEN();
        await certCen.clickNext();
        //test assurance
        await certCen.goToTestAssurance();
        await certCen.checkHeaderMatchesSidebar();
        //credential verification
        await certCen.goToCredentialVerification();
        await certCen.checkHeaderMatchesSidebar();
        //status
        await certCen.goToStatus();
        await certCen.checkHeaderMatchesSidebar();
    });

  certCENFixtures.describe('no member', () => {
    certCENFixtures.beforeEach('no member', async ({
        certCen
        }) => {
            await certCen.fillOutExamInfo_CEN();
            await certCen.selectMembershipENA('No');
    
            await certCen.clickNext();
        });

        certCENFixtures('not member, yes assurance', async ({
            certCen,
            page
            }) => {
                await certCen.clickYesTestAssurance();
                await certCen.clickNext();
                //move to Credential Verification
                await certCen.clickNext();
                //move to Status
                await certCen.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout
                await certCen.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCen.checkoutTable).toContainText(certCen.priceNoMemYesAssur)
                await expect.soft(certCen.checkoutTable).toContainText('includes Test Assurance');
                await certCen.clearCheckout();

                await expect(certCen.checkoutTable).toBeHidden();
            });
        certCENFixtures('not member, no assurance', async ({
            page,
            certCen
            }) => {
                await certCen.clickNoTestAssurance();
                await certCen.clickNext();
                //move to Credential Verification
                await certCen.clickNext();
                //move to Status
                await certCen.clickCheckoutButton();
                await page.waitForLoadState('load');
                //move to checkout'
                await certCen.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCen.checkoutTable).toContainText(certCen.priceNoMemNoAssur)
                await certCen.clearCheckout();
    
                await expect(certCen.checkoutTable).toBeHidden();
            });
  });

  certCENFixtures.describe('yes member', () => {
    certCENFixtures.beforeEach('yes member', async ({
        certCen
        }) => {
            await certCen.fillOutExamInfo_CEN();
            await certCen.selectMembershipENA('Yes');
            await certCen.fillMemberNumberENA('1234');
            await certCen.clickNoMilDiscount();
    
            await certCen.clickNext();
        });

        certCENFixtures('yes member, yes assurance', async ({
            page,
            certCen
            }) => {
                await certCen.clickYesTestAssurance();
                await certCen.clickNext();
                //move to Credential Verification
                await certCen.clickNext();
                //move to Status
                await certCen.clickCheckoutButton();
                //move to checkout
                await page.waitForLoadState('load');
                await certCen.checkoutTable.waitFor({ state: 'visible' });
                await expect(certCen.checkoutTable).toContainText(certCen.priceYesMemYesAssur);
                await expect.soft(certCen.checkoutTable).toContainText('includes Test Assurance');
                await certCen.clearCheckout();
    
                await expect(certCen.checkoutTable).toBeHidden();
            });
        certCENFixtures('yes member, no assurance', async ({
            page,
            certCen
            }) => {
                await certCen.clickNoTestAssurance();
                await certCen.clickNext();
                //move to Credential Verification
                await certCen.clickNext();
                //move to Status
                await certCen.clickCheckoutButton();
                await page.waitForLoadState('load');
                await certCen.checkoutTable.waitFor({ state: 'visible' });
                //move to checkout
                await expect(certCen.checkoutTable).toContainText(certCen.priceYesMemNoAssur_CEN);
                await certCen.clearCheckout();
    
                await expect(certCen.checkoutTable).toBeHidden();
            });
  });


certCENFixtures.describe('checkout tests', () => {
    //THIS METHODOLOGY IS TEMPORARY...SAVES A GIVEN CHECKOUT SCREEN'S TO A JSON FILE TO RETURN TO IN OTHER TESTS
certCENFixtures('grab checkout url, save to json', async ({
    certCen,
    page
    }) => {
        await certCen.fillOutExamInfo_CEN();
        await certCen.clickNext();
        await certCen.clickNoTestAssurance();
        await certCen.clickNext();
        await certCen.clickNext();
        await certCen.clickCheckoutButton();
        await expect(certCen.workflowTitle).toHaveText('Checkout and Make Payment');
        //grab the unique url for this submittal
        const submittalURL = page.url();
        //pass this url to a json file so it can be used for different tests
        fs.writeFileSync('cen-url-checkout.json', JSON.stringify(submittalURL));
    });
  certCENFixtures('add blank voucher', async ({
    certCen,
    page
    }) => {
        const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
        await page.goto(url);
        await certCen.clickAddVoucher();
        await expect(certCen.voucherErrorPopup).toBeVisible();
        await certCen.clickCloseVoucherError();
        await expect(certCen.addVoucherButton).toBeVisible();
    });

    certCENFixtures('payment type visibility - credit', async ({
        certCen,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCen.selectPaymentOption('CREDIT CARD');
            await expect(certCen.creditCardOptions).toBeVisible();
            await certCen.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(certCen.submitButton).toBeVisible();
        });

    certCENFixtures('payment type visibility - echeck/ach', async ({
        certCen,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCen.selectPaymentOption('ACHRT');
            await expect(certCen.submitButton).toBeVisible();
        });

    certCENFixtures('payment type visibility - check', async ({
        certCen,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await page.waitForLoadState('load');
            await certCen.paymentOptions.click();
            await certCen.selectPaymentOption('PAY_BY_CHECK');
            await certCen.paymentOptions.click();
            await expect(certCen.submitCheckButton).toBeVisible();
        });
  });
  certCENFixtures.describe('payment tests', () => {
    certCENFixtures.beforeEach('get to payment', async ({
      certCen,
      page
      }) => {
          await certCen.fillOutExamInfo_CEN();
          await certCen.clickNext();
          await certCen.clickNoTestAssurance();
          await certCen.clickNext();
          await page.waitForLoadState('load');
          await certCen.clickNext();
          await page.waitForLoadState('load');
          await certCen.clickCheckoutButton();
          await page.waitForLoadState('load');
  
          await certCen.selectPaymentOption('CREDIT CARD');
          await expect(certCen.creditCardOptions).toBeVisible();
          await certCen.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
          await expect(certCen.submitButton).toBeVisible();
          await certCen.clickSubmitCheckout();
      });
      certCENFixtures('submit blank', async ({
          certCen,
          page
          }) => {
              await certCen.fillNameOnCard('');
              await certCen.fillCardNumber('');
              await certCen.fillCVV('');
              await certCen.selectMonth('Select');
              await certCen.selectYear('Select');
              await certCen.fillStreetAddress('');
              await certCen.fillZipCode('');
              await certCen.selectCountry({ value: '' });
              await certCen.submitCardDetails();
  
              await expect(certCen.nameError).toBeVisible();
              await expect(certCen.cardNumError).toBeVisible();
              await expect(certCen.cvvError).toBeVisible();
              await expect(certCen.monthError).toBeVisible();
              await expect(certCen.yearError).toBeVisible();
              await expect(certCen.addressError).toBeVisible();
              await expect(certCen.zipCodeError).toBeVisible();
              await expect(certCen.countryError).toBeVisible();
              await expect(certCen.countryError).toBeVisible();
              });
        certCENFixtures('cancel, back to checkout', async ({
        certCen,
        page
        }) => {
            await certCen.cancelButton.click();
            await page.waitForLoadState('networkidle');
            await expect(certCen.workflowTitle).toContainText('Checkout and Make Payment');
    });
//DO NOT RUN THIS NEXT TEST UNTIL WE HAVE A WAY TO UNDO THIS PROCESS
    certCENFixtures.skip('successful case', async ({
        certCen,
        page,
        homePage
        }) => {
            await certCen.fillCardNumber('341111597242000');
            await certCen.fillCVV('1154');
            await certCen.selectMonth('12');
            await certCen.selectYear('2025');
            await certCen.submitCardDetails();
            await page.waitForLoadState('load');

            await homePage.visit();
            await expect(homePage.buttonCEN).toContainText(/SCHEDULE\/MANAGE EXAM/i);

    });
  });