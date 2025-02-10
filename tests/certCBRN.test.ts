import { certCBRNFixtures, expect } from "../fixtures/certCBRN.fixtures";
import fs from 'fs';
import { BackOffice } from "../pages/backOffice.page";

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

  //structure as an if-then. If the application isn't clean, then run the submittal-remover and then start the process again. Otherwise run the test.
certCBRNFixtures('update home page label to in progress', async ({
    certCBRN,
    homePage,
    page
    }) => {
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.clickNext();
    await page.waitForLoadState('networkidle');
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
    await page.waitForLoadState('networkidle');
    await expect(certCBRN.workflowTitle).toHaveText('Test Assurance');
    await certCBRN.clickNoTestAssurance();
    await certCBRN.clickNext();
    await certCBRN.clickNext();
    await certCBRN.clickCheckoutButton();
    //the problem with this next step is a simple timeout issue due to load time.
    await page.waitForLoadState('networkidle');
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

certCBRNFixtures('can remove uploaded files from military docs', async ({
    certCBRN,
    homePage,
    page
    }) => {
    await certCBRN.fillOutYesMil_CBRN();
    await page.waitForLoadState('load');
    await expect(certCBRN.workflowTitle).toHaveText('Upload Military Documentation');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');
    const fileInput = certCBRN.fileInput;
    await fileInput.setInputFiles(filePath);

    const fileInput2 = certCBRN.fileInput2;
    await fileInput2.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCBRN.uploadMessage).toContainText('successfully uploaded');
    //delete and confirm delete
    await certCBRN.deleteFile1.click();
    await certCBRN.deleteFile2.click();
    await expect(certCBRN.file1NoFile).toContainText(/No file chosen/);
    await expect(certCBRN.file2NoFile).toContainText(/No file chosen/);
    });

certCBRNFixtures('can remove uploaded files from exam accommodation', async ({
    certCBRN,
    homePage,
    page
    }) => {
    await certCBRN.fillOutYesAccom_CBRN();
    await page.waitForLoadState('load');
    await expect(certCBRN.workflowTitle).toHaveText('Exam Accommodation Request');
    const path = require('path');
    const filePath = path.resolve(__dirname, '../600.jpg');

    await certCBRN.examAccommUpload.setInputFiles(filePath);
    await page.waitForLoadState('load');
    await expect(certCBRN.accomUploadMessage).toContainText('successfully uploaded');
    await certCBRN.deleteExamAccom.click();
    await expect(certCBRN.accomNoFile).toContainText(/No file chosen/);
    });
    
certCBRNFixtures('yes exam accomodation, add step to left bar', async ({
    certCBRN,
    page
    }) => {
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.clickYesExamAccom();
    await certCBRN.clickNext();
    await page.waitForLoadState('networkidle');

    if (await certCBRN.mobileDropdown.isVisible()) {
        // Mobile View: Check if the dropdown contains "Exam Accommodation"
        const options = await certCBRN.mobileDropdown.locator('option').allTextContents();
        expect(options).toContain('Exam Accommodation Request');
        console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
    } else {
        // Desktop View: Check if the left bar step is visible
        await expect(certCBRN.examAccommLeftBar).toBeVisible();
        console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
    }
});

certCBRNFixtures('expect next button hidden', async ({
    certCBRN,
    page
    }) => {
    await expect(certCBRN.pagination).toContainText('Please complete all required fields');
    await expect(certCBRN.nextButton).toBeHidden();
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.checkBoxesOneByOne();
});

certCBRNFixtures('test assurance error message', async ({
    certCBRN,
    page
    }) => {
    await certCBRN.fillOutExamInfo_CBRN();
    await certCBRN.clickNext();
    await certCBRN.nextButton.click();
    await expect(certCBRN.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
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
        await expect(certCBRN.rnLicenseError).toBeVisible();
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
    certCBRN,
    page
    }) => {
        await page.waitForLoadState('load');
        //exam info
        await certCBRN.checkHeaderMatchesSidebar();
        await certCBRN.fillOutExamInfo_CBRN();
        await certCBRN.clickNext();
        //test assurance
        await certCBRN.checkHeaderMatchesSidebar();
        await certCBRN.clickNoTestAssurance();
        await certCBRN.clickNext();
        //credential verification
        await certCBRN.checkHeaderMatchesSidebar();
        await certCBRN.clickNext();
        //status
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
                await expect(certCBRN.checkoutTable).toContainText(certCBRN.priceNoMemYesAssur)
                await expect.soft(certCBRN.checkoutTable).toContainText('includes Test Assurance');
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
                await expect(certCBRN.checkoutTable).toContainText(certCBRN.priceNoMemNoAssur)
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
                await expect(certCBRN.checkoutTable).toContainText(certCBRN.priceYesMemYesAssur);
                await expect.soft(certCBRN.checkoutTable).toContainText('includes Test Assurance');
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
                await certCBRN.checkoutTable.waitFor({ state: 'visible' });
                //move to checkout
                await expect(certCBRN.checkoutTable).toContainText(certCBRN.priceYesMemNoAssur_others);
                await certCBRN.clearCheckout();
    
                await expect(certCBRN.checkoutTable).toBeHidden();
            });
  });


certCBRNFixtures.describe('checkout tests', () => {
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
        fs.writeFileSync('cen-url-checkout.json', JSON.stringify(submittalURL));
    });
  certCBRNFixtures('add blank voucher', async ({
    certCBRN,
    page
    }) => {
        const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
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
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
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
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await certCBRN.selectPaymentOption('ACHRT');
            await expect(certCBRN.submitButton).toBeVisible();
        });

    certCBRNFixtures('payment type visibility - check', async ({
        certCBRN,
        page
        }) => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
            await page.waitForLoadState('load');
            await certCBRN.paymentOptions.click();
            await certCBRN.selectPaymentOption('PAY_BY_CHECK');
            await certCBRN.paymentOptions.click();
            await expect(certCBRN.submitCheckButton).toBeVisible();
        });
  });
  certCBRNFixtures.describe('payment tests', () => {
    certCBRNFixtures.beforeEach('get to payment', async ({
      certCBRN,
      page
      }) => {
          await certCBRN.fillOutExamInfo_CBRN();
          await certCBRN.clickNext();
          await certCBRN.clickNoTestAssurance();
          await certCBRN.clickNext();
          await page.waitForLoadState('load');
          await certCBRN.clickNext();
          await page.waitForLoadState('load');
          await certCBRN.clickCheckoutButton();
          await page.waitForLoadState('load');
  
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
              await certCBRN.selectMonth('Select');
              await certCBRN.selectYear('Select');
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
        certCBRNFixtures('cancel, back to checkout', async ({
        certCBRN,
        page
        }) => {
            await certCBRN.cancelButton.click();
            await page.waitForLoadState('networkidle');
            await expect(certCBRN.workflowTitle).toContainText('Checkout and Make Payment');
    });
//DO NOT RUN THIS NEXT TEST UNTIL WE HAVE A WAY TO UNDO THIS PROCESS
    certCBRNFixtures.skip('successful case, email message', async ({
        certCBRN,
        page,
        homePage,
        backOffice
        }) => {
            const currentDate = new Date();

            // Format the date and time as "MM/DD/YYYY HH:mm:ss"
            const formattedDateTime = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/` +  // Get month (1-12), pad with zero
                                        `${currentDate.getDate().toString().padStart(2, '0')}/` +        // Get day (1-31), pad with zero
                                        `${currentDate.getFullYear()} ` +                                 // Get full year (e.g., 2025)
                                        `${currentDate.getHours().toString().padStart(2, '0')}:` +       // Get hours (00-23), pad with zero
                                        `${currentDate.getMinutes().toString().padStart(2, '0')}:` +     // Get minutes (00-59), pad with zero
                                        `${currentDate.getSeconds().toString().padStart(2, '0')}`;       // Get seconds (00-59), pad with zero
            await certCBRN.fillCardNumber('341111597242000');
            await certCBRN.fillCVV('1154');
            await certCBRN.selectMonth('12');
            await certCBRN.selectYear('2025');
            await certCBRN.submitCardDetails();
            await page.waitForLoadState('networkidle');

            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/SCHEDULE\/MANAGE EXAM/i);
            await backOffice.visitJohnetteAccount();
            await backOffice.clickMessageSummaryTab();

            //check status

            await backOffice.checkEmailsVariable(formattedDateTime, 'BCEN Exam Eligibility Notification', 'Consolidated Receipt');
    });
  });