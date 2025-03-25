import { certCBRNFixtures, expect } from "../fixtures/certCBRN.fixtures";
import fs from 'fs';
import path from "path";

certCBRNFixtures.describe('CBRN Suite', () => {
  certCBRNFixtures.beforeEach('Wipe previous submittals and clear checkout', async ({
    homePage
    }) => {
        await certCBRNFixtures.step('Check cart for items. If any, clear them.', async () => {
            await homePage.clearCheckoutAtStart();
            await homePage.visit();
          });
        await certCBRNFixtures.step('Check for open submittal. If exists, delete it.', async () => {
            await homePage.removeSubmittal('CBRN');
            await homePage.visitCBRN();
        });
    });
certCBRNFixtures.describe.only('SSA messages', () => { 
    certCBRNFixtures.beforeEach('Start application, fill out exam info', async ({
        cbrnExamInfo,
        cbrnTestAssurance,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);
           
            await certCBRNFixtures.step('Fill out page one, Exam Information', async () => {
                await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
            });
            await certCBRNFixtures.step('Click next, move ahead to Test Assurance', async () => {
                await cbrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cbrnTestAssurance.checkWorkflowTitle('Test Assurance');
            });
        });

    certCBRNFixtures('Confirm SSA Message of in progress', async ({
        homePage
        }) => { 
        await certCBRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'In Progress.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/In Process/i);
        });
        });

    certCBRNFixtures('Continue application and confirm SSA Message of checkout', async ({
        cbrnTestAssurance,
        cbrnCredVerification,
        cbrnStatus,
        cbrnCheckout,
        homePage,
        page
        }) => { 
        await certCBRNFixtures.step('Click no test assurance, move to Credential Verification page', async () => {
            await cbrnTestAssurance.selectTestAssurance(false);
            await cbrnTestAssurance.clickNext(page);
        });

        await certCBRNFixtures.step('Move to Status page', async () => {
            await cbrnCredVerification.clickNext(page);
        });
        await certCBRNFixtures.step('Move to Checkout page', async () => {
            await cbrnStatus.clickCheckoutButton();
            await page.waitForLoadState('networkidle');
            await cbrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
        });
        await certCBRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Checkout.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/Checkout/i);
            });
        });
});


certCBRNFixtures.describe('Military documentation review', () => {
    certCBRNFixtures.beforeEach('Start application with military discount', async ({
        cbrnExamInfo,
        cbrnMilitaryDoc,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: true,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
        await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

        await certCBRNFixtures.step('Fill out exam information, selecting yes for military discount', async () => {
            await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
            await cbrnExamInfo.clickNext(page);
            await page.waitForLoadState('networkidle');
            await cbrnMilitaryDoc.checkWorkflowTitle('Upload Military Documentation');
        });
        });
    certCBRNFixtures('Begin application and confirm SSA Message of military documentation review', async ({
        cbrnExamInfo,
        cbrnMilitaryDoc,
        homePage,
        page
        }) => {

        await certCBRNFixtures.step('Upload test document for review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cbrnMilitaryDoc.uploadMilDoc(filePath);
        });
        await certCBRNFixtures.step('Navigate to end of Military Documentation Review flow', async () => {
            await cbrnMilitaryDoc.clickNext(page);
            await cbrnMilitaryDoc.clickAdvanceToMilitary();
            await cbrnMilitaryDoc.checkWorkflowTitle('Military Discount Instructions');
        });
        
        await certCBRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Military Documentation Review.\'', async () => {
        });
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(/Military Documentation Review/i);
        });

    certCBRNFixtures('Can remove uploaded files from military docs', async ({
        cbrnMilitaryDoc,
        homePage,
        page
        }) => {
        await certCBRNFixtures.step('Upload test files to both inputs', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cbrnMilitaryDoc.uploadMilDoc(filePath);
            await cbrnMilitaryDoc.uploadMilDoc2(filePath);
        });

        await certCBRNFixtures.step('Delete both uploaded files and confirm delete', async () => {
            await cbrnMilitaryDoc.deleteMilUpload1();
            await cbrnMilitaryDoc.deleteMilUpload2();
            await expect(cbrnMilitaryDoc.file1NoFile).toContainText(/No file chosen/);
            await expect(cbrnMilitaryDoc.file2NoFile).toContainText(/No file chosen/);
        });
        });
});


certCBRNFixtures.describe('Exam accommodation review', () => {
    certCBRNFixtures.beforeEach('Start application with exam accommodation', async ({
        cbrnExamInfo,
        cbrnExamAccommodations,
        page
        }) => {

            const examInfoArgs = {
                accommodationRequest: true,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
         await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

            await certCBRNFixtures.step('Fill out exam information, requesting accommodations on the exam', async () => {
                await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
                await cbrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cbrnExamAccommodations.checkWorkflowTitle('Exam Accommodation Request');
            });
        });
    certCBRNFixtures('Can remove uploaded files from exam accommodation', async ({
        cbrnExamAccommodations,
        homePage,
        page
        }) => {
        await certCBRNFixtures.step('Upload test documentation for exam accommodation review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
    
            await cbrnExamAccommodations.uploadExamAccomDoc(filePath);
            await page.waitForLoadState('load');
        });
        await certCBRNFixtures.step('Delete test document. Confirm deletion', async () => {
            await cbrnExamAccommodations.deleteFile1.click();
            await expect(cbrnExamAccommodations.errorMessageNoFile).toContainText(/No file chosen/);
        });
        });
        
    certCBRNFixtures('Yes exam accomodation, add step to left bar', async ({
        cbrnExamAccommodations
        }) => {

        await certCBRNFixtures.step('Confirm that \'Exam Accommodation\' is added to flow graphics in both desktop and mobile views', async () => {
            if (await cbrnExamAccommodations.mobileDropdown.isVisible()) {
                // Mobile View: Check if the dropdown contains "Exam Accommodation"
                const options = await cbrnExamAccommodations.mobileDropdown.locator('option').allTextContents();
                expect(options).toContain('Exam Accommodation Request');
                console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
            } else {
                // Desktop View: Check if the left bar step is visible
                await expect(cbrnExamAccommodations.examAccommodationsLeftBar).toBeVisible();
                console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
            }
        });
    });
});

certCBRNFixtures('Expect next button hidden', async ({
    cbrnExamInfo,
    page
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: false,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

    await certCBRNFixtures.step('When form is not filled, check that bottom text says \'Please complete all required fields,\' and that Next button is hidden.', async () => {
        await expect(cbrnExamInfo.pagination).toContainText('Please complete all required fields');
        await expect(cbrnExamInfo.nextButton).toBeHidden();
    });
    await certCBRNFixtures.step('Check that next button appears and disappears when form elements are checked and unchecked', async () => {
        await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
        await cbrnExamInfo.checkBoxesOneByOne();
    });
});

certCBRNFixtures('Test assurance error message', async ({
    cbrnExamInfo,
    cbrnTestAssurance
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: true,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

    await certCBRNFixtures.step('Navigate to Test Assurance step', async () => {
        await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
        await cbrnExamInfo.clickNext(page);
    });
    await certCBRNFixtures.step('Attempt to click next, successfully triggering error message', async () => {
        await cbrnTestAssurance.clickNext(page);
        await expect(cbrnTestAssurance.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
    });
});

certCBRNFixtures('Error messages on exam information', async ({
    cbrnExamInfo,
    page
    }) => {

        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: '',
            state: 'Select One',
            membership: 'Select One'
        }
        await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

        await certCBRNFixtures.step('Check that all error messages are triggered on Exam Information page', async () => {
            //Must interact with Exam Info elements before errors show. Thus, fillOutExamInfo as shown, and then delete those values in checkErrorMessages
            await cbrnExamInfo.fillOutExamInfo_CBRN({
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            });
            await cbrnExamInfo.checkErrorMessages();
        });
    });

certCBRNFixtures('Toggle membership - memberNumber input opens and closes', async ({
    cbrnExamInfo
    }) => {
        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: null,
            state: null,
            membership: 'Toggle between membership statuses'
        }
        await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

        await certCBRNFixtures.step('Select not a member, expect member number input to be hidden. Select member, expect member number input to be visible', async () => {
            await cbrnExamInfo.toggleMembership();
            await cbrnExamInfo.toggleMembership();
        });
});

certCBRNFixtures('Side graphic matches header, has orange color', async ({
    cbrnExamInfo,
    cbrnTestAssurance,
    cbrnCredVerification,
    cbrnStatus,
    page
    }) => {
        const examInfoArgs = {
            accommodationRequest: false,
            militaryStatusRequest: false,
            licenseNumber: '1234',
            state: 'IL',
            membership: 'No'
        }
        const testAssuranceArgs = false
        await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArgs);

        await certCBRNFixtures.step('Check graphic on Exam Information page', async () => {
            await cbrnExamInfo.checkHeaderMatchesSidebar();
            await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
            await cbrnExamInfo.clickNext(page);
        });
        await certCBRNFixtures.step('Check graphic on Test Assurance page', async () => {
            await cbrnTestAssurance.checkHeaderMatchesSidebar();
            await cbrnTestAssurance.selectTestAssurance(testAssuranceArgs);
            await cbrnTestAssurance.clickNext(page);
        });
        await certCBRNFixtures.step('Check graphic on Credential Verification page', async () => {
            await cbrnCredVerification.checkHeaderMatchesSidebar();
            await cbrnCredVerification.clickNext(page);
        });
        await certCBRNFixtures.step('Check graphic on Status page', async () => {
            await cbrnStatus.checkHeaderMatchesSidebar();
        });
    });

  certCBRNFixtures.describe('Price checks for non-members of other societies', () => {
    certCBRNFixtures.beforeEach('Fill out exam info for non-member', async ({
        cbrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

        await certCBRNFixtures.step('Fill out Exam Information.', async () => {
            await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
            await cbrnExamInfo.clickNext(page);
        });
        });

        certCBRNFixtures('Not member, yes assurance', async ({
            cbrnTestAssurance,
            cbrnCredVerification,
            cbrnStatus,
            cbrnCheckout,
            page
            }) => {
                //THERE SHOULD BE A WAY TO SET THE TEST ASSURANCE ARG HERE, BUT KEEP THE EXAM INFO ARGS IN PLACE IN THE ANNOTATIONS
            await certCBRNFixtures.step('Select Yes for Test Assurance', async () => {
                await cbrnTestAssurance.selectTestAssurance(true);
                await cbrnTestAssurance.clickNext(page);
            });
            await certCBRNFixtures.step('Move through Credential Verification', async () => {
                await cbrnCredVerification.clickNext(page);
            });
            await certCBRNFixtures.step('Move through Status page', async () => {
                await cbrnStatus.clickCheckoutButton();
                await page.waitForLoadState('load');
                await cbrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
            });
            await certCBRNFixtures.step('Check displayed price', async () => {
                await expect(cbrnCheckout.checkoutTable).toContainText(cbrnCheckout.prices.priceYesMembershipYesTestAssurance)
                await expect.soft(cbrnCheckout.checkoutTable).toContainText('includes Test Assurance');
            });
            await certCBRNFixtures.step('Clear checkout', async () => {
                await cbrnCheckout.clearCheckout();
                await expect(cbrnCheckout.checkoutTable).toBeHidden();
            });
            });
        certCBRNFixtures('Not member, no assurance', async ({
            cbrnTestAssurance,
            cbrnCredVerification,
            cbrnStatus,
            cbrnCheckout,
            page
            }) => {
                //SAME THING HERE AS WITH PREVIOUS TEST - ADD testAssuranceArgs to annotations here.
                await certCBRNFixtures.step('Select No for Test Assurance', async () => {
                    await cbrnTestAssurance.selectTestAssurance(false);
                    await cbrnTestAssurance.clickNext(page);
                });
                await certCBRNFixtures.step('Move through Credential Verification', async () => {
                    await cbrnCredVerification.clickNext(page);
                });
                await certCBRNFixtures.step('Move through Status page', async () => {
                    await cbrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cbrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
                });
                await certCBRNFixtures.step('Check displayed price', async () => {
                    await expect(cbrnCheckout.checkoutTable).toContainText(cbrnCheckout.prices.priceNoMembershipNoTestAssurance);
                    await expect.soft(cbrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCBRNFixtures.step('Clear checkout', async () => {
                    await cbrnCheckout.clearCheckout();
                    await expect(cbrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });

  certCBRNFixtures.describe('Price checks for members of other societies', () => {
    certCBRNFixtures.beforeEach('Fill out exam info for other society member', async ({
        cbrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'Yes',
                memberNumber: '1234'
            }
            await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

            await certCBRNFixtures.step('Fill in exam info', async () => {
                await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
        
                await cbrnExamInfo.clickNext(page);
            });
        });

        certCBRNFixtures('Yes member, yes assurance', async ({
            cbrnTestAssurance,
            cbrnCredVerification,
            cbrnStatus,
            cbrnCheckout,
            page
            }) => {
                //SAME THING HERE AS PREVIOUS TWO
                await certCBRNFixtures.step('Select Yes for Test Assurance', async () => {
                    await cbrnTestAssurance.selectTestAssurance(true);
                    await cbrnTestAssurance.clickNext(page);
                });
                await certCBRNFixtures.step('Move through Credential Verification', async () => {
                    await cbrnCredVerification.clickNext(page);
                });
                await certCBRNFixtures.step('Move through Status page', async () => {
                    await cbrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cbrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCBRNFixtures.step('Check displayed price', async () => {
                    await expect(cbrnCheckout.checkoutTable).toContainText(cbrnCheckout.prices.priceYesMembershipYesTestAssurance)
                    await expect.soft(cbrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCBRNFixtures.step('Clear checkout', async () => {
                    await cbrnCheckout.clearCheckout();
                    await expect(cbrnCheckout.checkoutTable).toBeHidden();
                });
            });
        certCBRNFixtures('Yes member, no assurance', async ({
            cbrnTestAssurance,
            cbrnCredVerification,
            cbrnStatus,
            cbrnCheckout,
            page
            }) => {
                //AND HERE
                await certCBRNFixtures.step('Select No for Test Assurance', async () => {
                    await cbrnTestAssurance.selectTestAssurance(false);
                    await cbrnTestAssurance.clickNext(page);
                });
                await certCBRNFixtures.step('Move through Credential Verification', async () => {
                    await cbrnCredVerification.clickNext(page);
                });
                await certCBRNFixtures.step('Move through Status page', async () => {
                    await cbrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cbrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCBRNFixtures.step('Check displayed price', async () => {
                    await expect(cbrnCheckout.checkoutTable).toContainText(cbrnCheckout.prices.priceYesMembershipNoTestAssurance_others);
                });
                await certCBRNFixtures.step('Clear checkout', async () => {
                    await cbrnCheckout.clearCheckout();
                    await expect(cbrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });


certCBRNFixtures.describe('Checkout tests', () => {
    //On this group, the annotations are set on every test due to the absence of a beforeEach hook.
    certCBRNFixtures('SETUP TEST: grab checkout url, save to json', async ({
    cbrnExamInfo,
    cbrnTestAssurance,
    cbrnCredVerification,
    cbrnStatus,
    cbrnCheckout,
    page
    }) => {
        const examInfoArgs = {
            accommodationRequest: false,
            militaryStatusRequest: false,
            licenseNumber: '1234',
            state: 'IL',
            membership: 'No'
        }
        const testAssuranceArg = false
        await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCBRNFixtures.step('Fill out Exam Information', async () => {
            await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
            await cbrnExamInfo.clickNext(page);
        });
        await certCBRNFixtures.step('Continue past Test Assurance', async () => {
            await cbrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await cbrnTestAssurance.clickNext(page);
        });
        await certCBRNFixtures.step('Continue past Credential Verification', async () => {
            await cbrnCredVerification.clickNext(page);
        });
        await certCBRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cbrnStatus.clickCheckoutButton();
            await expect(cbrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
            //grab the unique url for this submittal
            const submittalURL = page.url();
            //pass this url to a json file so it can be used for different tests
            fs.writeFileSync('cbrn-url-checkout.json', JSON.stringify(submittalURL));
        });
        });
    certCBRNFixtures('Add blank voucher', async ({
    cbrnCheckout,
    page
    }) => {      

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: false,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    const testAssuranceArg = false
    await cbrnCheckout.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCBRNFixtures.step('Navigate to saved Checkout URL', async () => {
            const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
            await page.goto(url);
        });
        await certCBRNFixtures.step('Click button to submit blank voucher, expect error', async () => {
            await cbrnCheckout.clickAddVoucher();
            await expect(cbrnCheckout.voucherErrorPopup).toBeVisible();
        });
        await certCBRNFixtures.step('Close voucher error', async () => {
            await cbrnCheckout.clickCloseVoucherError();
            await expect(cbrnCheckout.addVoucherButton).toBeVisible();
        });
        });

    certCBRNFixtures('Payment type visibility - credit', async ({
        cbrnCheckout,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            const testAssuranceArg = false
            await cbrnCheckout.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCBRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCBRNFixtures.step('Select Credit Card under Payment Options', async () => {
                await cbrnCheckout.selectPaymentOption('CREDIT CARD');
                await expect(cbrnCheckout.creditCardOptions).toBeVisible();
            });
            await certCBRNFixtures.step('Select Credit Card type, expect Submit button to be visible', async () => {
                await cbrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
                await expect(cbrnCheckout.submitButton).toBeVisible();
            });
        });

    certCBRNFixtures('Payment type visibility - echeck/ach', async ({
        cbrnCheckout,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            const testAssuranceArg = false
            await cbrnCheckout.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCBRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCBRNFixtures.step('Select echeck, expect Submit button to be visible', async () => {
                await cbrnCheckout.selectPaymentOption('ACHRT');
                await expect(cbrnCheckout.submitButton).toBeVisible();
            });
        });

    certCBRNFixtures('Payment type visibility - check', async ({
        cbrnCheckout,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            const testAssuranceArg = false
            await cbrnCheckout.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCBRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cbrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCBRNFixtures.step('Select Check, expect separate Submit Check button to be visible', async () => {
                await cbrnCheckout.selectPaymentOption('PAY_BY_CHECK');
                await cbrnCheckout.paymentOptions.click();
                await expect(cbrnCheckout.submitCheckButton).toBeVisible();
            });
        });
  });
  certCBRNFixtures.describe('Payment tests', () => {
    certCBRNFixtures.beforeEach('Get to payment', async ({
        cbrnExamInfo,
        cbrnTestAssurance,
        cbrnCredVerification,
        cbrnStatus,
        cbrnCheckout,
        page
      }) => {
        const examInfoArgs = {
            accommodationRequest: false,
            militaryStatusRequest: false,
            licenseNumber: '1234',
            state: 'IL',
            membership: 'No'
        }
        const testAssuranceArg = false
        await cbrnCheckout.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCBRNFixtures.step('Fill out Exam Information', async () => {
            await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
            await cbrnExamInfo.clickNext(page);
        });
        await certCBRNFixtures.step('Continue past Test Assurance', async () => {
            await cbrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await cbrnTestAssurance.clickNext(page);
        });
        await certCBRNFixtures.step('Continue past Credential Verification', async () => {
            await cbrnCredVerification.clickNext(page);
        });
        await certCBRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cbrnStatus.clickCheckoutButton();
            await expect(cbrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
        });
        await certCBRNFixtures.step('Choose payment type, credit card type', async () => {
            await cbrnCheckout.selectPaymentOption('CREDIT CARD');
            await expect(cbrnCheckout.creditCardOptions).toBeVisible();
            await cbrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(cbrnCheckout.submitButton).toBeVisible();
            await cbrnCheckout.clickSubmitCheckout();
        });
    });
      certCBRNFixtures('Submit blank payment details', async ({
          cbrnPayment
          }) => {
        await certCBRNFixtures.step('Set all values to blank', async () => {
            await cbrnPayment.fillOutAndSubmitPayment({
                cardNum: '',
                cardName: '',
                country: '',//if there is a problem, might be because it wants something like { value: '' }
                zip: '',
                address: '',
                cvv: '',
                month: 'Select',
                year: 'Select'
            });
        });

        await certCBRNFixtures.step('Expect error messages to be visible', async () => {
            await expect(cbrnPayment.nameError).toBeVisible();
            await expect(cbrnPayment.cardNumError).toBeVisible();
            await expect(cbrnPayment.cvvError).toBeVisible();
            await expect(cbrnPayment.monthError).toBeVisible();
            await expect(cbrnPayment.yearError).toBeVisible();
            await expect(cbrnPayment.addressError).toBeVisible();
            await expect(cbrnPayment.zipCodeError).toBeVisible();
            await expect(cbrnPayment.countryError).toBeVisible();
            await expect(cbrnPayment.countryError).toBeVisible();
            });
        });
  
        certCBRNFixtures('Click cancel on payment screen, expect to return to checkout', async ({
        cbrnPayment,
        page
        }) => {
            await certCBRNFixtures.step('Click cancel button, expect to go back to checkout', async () => {
                await cbrnPayment.cancelButton.click();
                await page.waitForLoadState('networkidle');
                await expect(cbrnPayment.workflowTitle).toContainText('Checkout and Make Payment');
            });
    });
    certCBRNFixtures('Successful case', async ({
        cbrnPayment,
        page,
        homePage,
        backOffice
        }) => {
            await certCBRNFixtures.step('Submit details', async () => {

                await cbrnPayment.fillOutAndSubmitPayment({
                    cardNum: '341111597242000',
                    cardName: 'Test Tester',
                    cvv: '1154',
                    month: 'Select',
                    year: 'Select',
                    address: '1234qwre',
                    country: 'United States',
                    zip: '60625'
                });
            });
            await certCBRNFixtures.step('Go to homepage, check SSA Message reads \'SCHEDULE\/MANAGE EXAM\'', async () => {
                await homePage.visit();
                await expect(homePage.buttonCBRN).toContainText(/SCHEuuDULE\/MANAGE EXAM/i);
            });
        });
  });
});