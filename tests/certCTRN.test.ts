import { certCTRNFixtures, expect } from "../fixtures/certCTRN.fixtures";
import fs from 'fs';
import path from "path";

certCTRNFixtures.describe('CTRN Suite', () => {
  certCTRNFixtures.beforeEach('Wipe previous submittals and clear checkout', async ({
    homePage
    }) => {
        await certCTRNFixtures.step('Check cart for items. If any, clear them.', async () => {
            await homePage.clearCheckoutAtStart();
            await homePage.visit();
          });
        await certCTRNFixtures.step('Check for open submittal. If exists, delete it.', async () => {
            await homePage.removeSubmittal('CTRN');
            await homePage.visitCTRN();
        });
    });
certCTRNFixtures.describe.only('SSA messages', () => { 
    certCTRNFixtures.beforeEach('Start application, fill out exam info', async ({
        ctrnExamInfo,
        ctrnTestAssurance,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);
           
            await certCTRNFixtures.step('Fill out page one, Exam Information', async () => {
                await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
            });
            await certCTRNFixtures.step('Click next, move ahead to Test Assurance', async () => {
                await ctrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await ctrnTestAssurance.checkWorkflowTitle('Test Assurance');
            });
        });

    certCTRNFixtures('Confirm SSA Message of in progress', async ({
        homePage
        }) => { 
        await certCTRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'In Progress.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCTRN).toContainText(/In Process/i);
        });
        });

    certCTRNFixtures('Continue application and confirm SSA Message of checkout', async ({
        ctrnTestAssurance,
        ctrnCredVerification,
        ctrnStatus,
        ctrnCheckout,
        homePage,
        page
        }) => { 
        await certCTRNFixtures.step('Click no test assurance, move to Credential Verification page', async () => {
            await ctrnTestAssurance.selectTestAssurance(false);
            await ctrnTestAssurance.clickNext(page);
        });

        await certCTRNFixtures.step('Move to Status page', async () => {
            await ctrnCredVerification.clickNext(page);
        });
        await certCTRNFixtures.step('Move to Checkout page', async () => {
            await ctrnStatus.clickCheckoutButton();
            await page.waitForLoadState('networkidle');
            await ctrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
        });
        await certCTRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Checkout.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCTRN).toContainText(/Checkout/i);
            });
        });
});


certCTRNFixtures.describe('Military documentation review', () => {
    certCTRNFixtures.beforeEach('Start application with military discount', async ({
        ctrnExamInfo,
        ctrnMilitaryDoc,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: true,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
        await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

        await certCTRNFixtures.step('Fill out exam information, selecting yes for military discount', async () => {
            await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
            await ctrnExamInfo.clickNext(page);
            await page.waitForLoadState('networkidle');
            await ctrnMilitaryDoc.checkWorkflowTitle('Upload Military Documentation');
        });
        });
    certCTRNFixtures('Begin application and confirm SSA Message of military documentation review', async ({
        ctrnExamInfo,
        ctrnMilitaryDoc,
        homePage,
        page
        }) => {

        await certCTRNFixtures.step('Upload test document for review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await ctrnMilitaryDoc.uploadMilDoc(filePath);
        });
        await certCTRNFixtures.step('Navigate to end of Military Documentation Review flow', async () => {
            await ctrnMilitaryDoc.clickNext(page);
            await ctrnMilitaryDoc.clickAdvanceToMilitary();
            await ctrnMilitaryDoc.checkWorkflowTitle('Military Discount Instructions');
        });
        
        await certCTRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Military Documentation Review.\'', async () => {
        });
            await homePage.visit();
            await expect(homePage.buttonCTRN).toContainText(/Military Documentation Review/i);
        });

    certCTRNFixtures('Can remove uploaded files from military docs', async ({
        ctrnMilitaryDoc,
        homePage,
        page
        }) => {
        await certCTRNFixtures.step('Upload test files to both inputs', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await ctrnMilitaryDoc.uploadMilDoc(filePath);
            await ctrnMilitaryDoc.uploadMilDoc2(filePath);
        });

        await certCTRNFixtures.step('Delete both uploaded files and confirm delete', async () => {
            await ctrnMilitaryDoc.deleteMilUpload1();
            await ctrnMilitaryDoc.deleteMilUpload2();
            await expect(ctrnMilitaryDoc.file1NoFile).toContainText(/No file chosen/);
            await expect(ctrnMilitaryDoc.file2NoFile).toContainText(/No file chosen/);
        });
        });
});


certCTRNFixtures.describe('Exam accommodation review', () => {
    certCTRNFixtures.beforeEach('Start application with exam accommodation', async ({
        ctrnExamInfo,
        ctrnExamAccommodations,
        page
        }) => {

            const examInfoArgs = {
                accommodationRequest: true,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
         await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

            await certCTRNFixtures.step('Fill out exam information, requesting accommodations on the exam', async () => {
                await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
                await ctrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await ctrnExamAccommodations.checkWorkflowTitle('Exam Accommodation Request');
            });
        });
    certCTRNFixtures('Can remove uploaded files from exam accommodation', async ({
        ctrnExamAccommodations,
        homePage,
        page
        }) => {
        await certCTRNFixtures.step('Upload test documentation for exam accommodation review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
    
            await ctrnExamAccommodations.uploadExamAccomDoc(filePath);
            await page.waitForLoadState('load');
        });
        await certCTRNFixtures.step('Delete test document. Confirm deletion', async () => {
            await ctrnExamAccommodations.deleteFile1.click();
            await expect(ctrnExamAccommodations.errorMessageNoFile).toContainText(/No file chosen/);
        });
        });
        
    certCTRNFixtures('Yes exam accomodation, add step to left bar', async ({
        ctrnExamAccommodations
        }) => {

        await certCTRNFixtures.step('Confirm that \'Exam Accommodation\' is added to flow graphics in both desktop and mobile views', async () => {
            if (await ctrnExamAccommodations.mobileDropdown.isVisible()) {
                // Mobile View: Check if the dropdown contains "Exam Accommodation"
                const options = await ctrnExamAccommodations.mobileDropdown.locator('option').allTextContents();
                expect(options).toContain('Exam Accommodation Request');
                console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
            } else {
                // Desktop View: Check if the left bar step is visible
                await expect(ctrnExamAccommodations.examAccommodationsLeftBar).toBeVisible();
                console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
            }
        });
    });
});

certCTRNFixtures('Expect next button hidden', async ({
    ctrnExamInfo,
    page
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: false,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

    await certCTRNFixtures.step('When form is not filled, check that bottom text says \'Please complete all required fields,\' and that Next button is hidden.', async () => {
        await expect(ctrnExamInfo.pagination).toContainText('Please complete all required fields');
        await expect(ctrnExamInfo.nextButton).toBeHidden();
    });
    await certCTRNFixtures.step('Check that next button appears and disappears when form elements are checked and unchecked', async () => {
        await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
        await ctrnExamInfo.checkBoxesOneByOne();
    });
});

certCTRNFixtures('Test assurance error message', async ({
    ctrnExamInfo,
    ctrnTestAssurance
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: true,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

    await certCTRNFixtures.step('Navigate to Test Assurance step', async () => {
        await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
        await ctrnExamInfo.clickNext(page);
    });
    await certCTRNFixtures.step('Attempt to click next, successfully triggering error message', async () => {
        await ctrnTestAssurance.clickNext(page);
        await expect(ctrnTestAssurance.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
    });
});

certCTRNFixtures('Error messages on exam information', async ({
    ctrnExamInfo,
    page
    }) => {

        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: '',
            state: 'Select One',
            membership: 'Select One'
        }
        await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

        await certCTRNFixtures.step('Check that all error messages are triggered on Exam Information page', async () => {
            //Must interact with Exam Info elements before errors show. Thus, fillOutExamInfo as shown, and then delete those values in checkErrorMessages
            await ctrnExamInfo.fillOutExamInfo_CTRN({
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            });
            await ctrnExamInfo.checkErrorMessages();
        });
    });

certCTRNFixtures('Toggle membership - memberNumber input opens and closes', async ({
    ctrnExamInfo
    }) => {
        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: null,
            state: null,
            membership: 'Toggle between membership statuses'
        }
        await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

        await certCTRNFixtures.step('Select not a member, expect member number input to be hidden. Select member, expect member number input to be visible', async () => {
            await ctrnExamInfo.toggleMembership();
            await ctrnExamInfo.toggleMembership();
        });
});

certCTRNFixtures('Side graphic matches header, has orange color', async ({
    ctrnExamInfo,
    ctrnTestAssurance,
    ctrnCredVerification,
    ctrnStatus,
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
        await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs, testAssuranceArgs);

        await certCTRNFixtures.step('Check graphic on Exam Information page', async () => {
            await ctrnExamInfo.checkHeaderMatchesSidebar();
            await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
            await ctrnExamInfo.clickNext(page);
        });
        await certCTRNFixtures.step('Check graphic on Test Assurance page', async () => {
            await ctrnTestAssurance.checkHeaderMatchesSidebar();
            await ctrnTestAssurance.selectTestAssurance(testAssuranceArgs);
            await ctrnTestAssurance.clickNext(page);
        });
        await certCTRNFixtures.step('Check graphic on Credential Verification page', async () => {
            await ctrnCredVerification.checkHeaderMatchesSidebar();
            await ctrnCredVerification.clickNext(page);
        });
        await certCTRNFixtures.step('Check graphic on Status page', async () => {
            await ctrnStatus.checkHeaderMatchesSidebar();
        });
    });

  certCTRNFixtures.describe('Price checks for non-members of other societies', () => {
    certCTRNFixtures.beforeEach('Fill out exam info for non-member', async ({
        ctrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

        await certCTRNFixtures.step('Fill out Exam Information.', async () => {
            await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
            await ctrnExamInfo.clickNext(page);
        });
        });

        certCTRNFixtures('Not member, yes assurance', async ({
            ctrnTestAssurance,
            ctrnCredVerification,
            ctrnStatus,
            ctrnCheckout,
            page
            }) => {
                //THERE SHOULD BE A WAY TO SET THE TEST ASSURANCE ARG HERE, BUT KEEP THE EXAM INFO ARGS IN PLACE IN THE ANNOTATIONS
            await certCTRNFixtures.step('Select Yes for Test Assurance', async () => {
                await ctrnTestAssurance.selectTestAssurance(true);
                await ctrnTestAssurance.clickNext(page);
            });
            await certCTRNFixtures.step('Move through Credential Verification', async () => {
                await ctrnCredVerification.clickNext(page);
            });
            await certCTRNFixtures.step('Move through Status page', async () => {
                await ctrnStatus.clickCheckoutButton();
                await page.waitForLoadState('load');
                await ctrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
            });
            await certCTRNFixtures.step('Check displayed price', async () => {
                await expect(ctrnCheckout.checkoutTable).toContainText(ctrnCheckout.prices.priceYesMembershipYesTestAssurance)
                await expect.soft(ctrnCheckout.checkoutTable).toContainText('includes Test Assurance');
            });
            await certCTRNFixtures.step('Clear checkout', async () => {
                await ctrnCheckout.clearCheckout();
                await expect(ctrnCheckout.checkoutTable).toBeHidden();
            });
            });
        certCTRNFixtures('Not member, no assurance', async ({
            ctrnTestAssurance,
            ctrnCredVerification,
            ctrnStatus,
            ctrnCheckout,
            page
            }) => {
                //SAME THING HERE AS WITH PREVIOUS TEST - ADD testAssuranceArgs to annotations here.
                await certCTRNFixtures.step('Select No for Test Assurance', async () => {
                    await ctrnTestAssurance.selectTestAssurance(false);
                    await ctrnTestAssurance.clickNext(page);
                });
                await certCTRNFixtures.step('Move through Credential Verification', async () => {
                    await ctrnCredVerification.clickNext(page);
                });
                await certCTRNFixtures.step('Move through Status page', async () => {
                    await ctrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await ctrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
                });
                await certCTRNFixtures.step('Check displayed price', async () => {
                    await expect(ctrnCheckout.checkoutTable).toContainText(ctrnCheckout.prices.priceNoMembershipNoTestAssurance);
                    await expect.soft(ctrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCTRNFixtures.step('Clear checkout', async () => {
                    await ctrnCheckout.clearCheckout();
                    await expect(ctrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });

  certCTRNFixtures.describe('Price checks for members of other societies', () => {
    certCTRNFixtures.beforeEach('Fill out exam info for other society member', async ({
        ctrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'Yes',
                memberNumber: '1234'
            }
            await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs);

            await certCTRNFixtures.step('Fill in exam info', async () => {
                await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
        
                await ctrnExamInfo.clickNext(page);
            });
        });

        certCTRNFixtures('Yes member, yes assurance', async ({
            ctrnTestAssurance,
            ctrnCredVerification,
            ctrnStatus,
            ctrnCheckout,
            page
            }) => {
                //SAME THING HERE AS PREVIOUS TWO
                await certCTRNFixtures.step('Select Yes for Test Assurance', async () => {
                    await ctrnTestAssurance.selectTestAssurance(true);
                    await ctrnTestAssurance.clickNext(page);
                });
                await certCTRNFixtures.step('Move through Credential Verification', async () => {
                    await ctrnCredVerification.clickNext(page);
                });
                await certCTRNFixtures.step('Move through Status page', async () => {
                    await ctrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await ctrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCTRNFixtures.step('Check displayed price', async () => {
                    await expect(ctrnCheckout.checkoutTable).toContainText(ctrnCheckout.prices.priceYesMembershipYesTestAssurance)
                    await expect.soft(ctrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCTRNFixtures.step('Clear checkout', async () => {
                    await ctrnCheckout.clearCheckout();
                    await expect(ctrnCheckout.checkoutTable).toBeHidden();
                });
            });
        certCTRNFixtures('Yes member, no assurance', async ({
            ctrnTestAssurance,
            ctrnCredVerification,
            ctrnStatus,
            ctrnCheckout,
            page
            }) => {
                //AND HERE
                await certCTRNFixtures.step('Select No for Test Assurance', async () => {
                    await ctrnTestAssurance.selectTestAssurance(false);
                    await ctrnTestAssurance.clickNext(page);
                });
                await certCTRNFixtures.step('Move through Credential Verification', async () => {
                    await ctrnCredVerification.clickNext(page);
                });
                await certCTRNFixtures.step('Move through Status page', async () => {
                    await ctrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await ctrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCTRNFixtures.step('Check displayed price', async () => {
                    await expect(ctrnCheckout.checkoutTable).toContainText(ctrnCheckout.prices.priceYesMembershipNoTestAssurance_others);
                });
                await certCTRNFixtures.step('Clear checkout', async () => {
                    await ctrnCheckout.clearCheckout();
                    await expect(ctrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });


certCTRNFixtures.describe('Checkout tests', () => {
    //On this group, the annotations are set on every test due to the absence of a beforeEach hook.
    certCTRNFixtures('SETUP TEST: grab checkout url, save to json', async ({
    ctrnExamInfo,
    ctrnTestAssurance,
    ctrnCredVerification,
    ctrnStatus,
    ctrnCheckout,
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
        await ctrnExamInfo.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCTRNFixtures.step('Fill out Exam Information', async () => {
            await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
            await ctrnExamInfo.clickNext(page);
        });
        await certCTRNFixtures.step('Continue past Test Assurance', async () => {
            await ctrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await ctrnTestAssurance.clickNext(page);
        });
        await certCTRNFixtures.step('Continue past Credential Verification', async () => {
            await ctrnCredVerification.clickNext(page);
        });
        await certCTRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await ctrnStatus.clickCheckoutButton();
            await expect(ctrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
            //grab the unique url for this submittal
            const submittalURL = page.url();
            //pass this url to a json file so it can be used for different tests
            fs.writeFileSync('ctrn-url-checkout.json', JSON.stringify(submittalURL));
        });
        });
    certCTRNFixtures('Add blank voucher', async ({
    ctrnCheckout,
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
    await ctrnCheckout.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCTRNFixtures.step('Navigate to saved Checkout URL', async () => {
            const url = JSON.parse(fs.readFileSync('ctrn-url-checkout.json', 'utf-8'));
            await page.goto(url);
        });
        await certCTRNFixtures.step('Click button to submit blank voucher, expect error', async () => {
            await ctrnCheckout.clickAddVoucher();
            await expect(ctrnCheckout.voucherErrorPopup).toBeVisible();
        });
        await certCTRNFixtures.step('Close voucher error', async () => {
            await ctrnCheckout.clickCloseVoucherError();
            await expect(ctrnCheckout.addVoucherButton).toBeVisible();
        });
        });

    certCTRNFixtures('Payment type visibility - credit', async ({
        ctrnCheckout,
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
            await ctrnCheckout.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCTRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('ctrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCTRNFixtures.step('Select Credit Card under Payment Options', async () => {
                await ctrnCheckout.selectPaymentOption('CREDIT CARD');
                await expect(ctrnCheckout.creditCardOptions).toBeVisible();
            });
            await certCTRNFixtures.step('Select Credit Card type, expect Submit button to be visible', async () => {
                await ctrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
                await expect(ctrnCheckout.submitButton).toBeVisible();
            });
        });

    certCTRNFixtures('Payment type visibility - echeck/ach', async ({
        ctrnCheckout,
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
            await ctrnCheckout.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCTRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('ctrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCTRNFixtures.step('Select echeck, expect Submit button to be visible', async () => {
                await ctrnCheckout.selectPaymentOption('ACHRT');
                await expect(ctrnCheckout.submitButton).toBeVisible();
            });
        });

    certCTRNFixtures('Payment type visibility - check', async ({
        ctrnCheckout,
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
            await ctrnCheckout.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCTRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('ctrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCTRNFixtures.step('Select Check, expect separate Submit Check button to be visible', async () => {
                await ctrnCheckout.selectPaymentOption('PAY_BY_CHECK');
                await ctrnCheckout.paymentOptions.click();
                await expect(ctrnCheckout.submitCheckButton).toBeVisible();
            });
        });
  });
  certCTRNFixtures.describe('Payment tests', () => {
    certCTRNFixtures.beforeEach('Get to payment', async ({
        ctrnExamInfo,
        ctrnTestAssurance,
        ctrnCredVerification,
        ctrnStatus,
        ctrnCheckout,
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
        await ctrnCheckout.setTestAnnotations(certCTRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCTRNFixtures.step('Fill out Exam Information', async () => {
            await ctrnExamInfo.fillOutExamInfo_CTRN(examInfoArgs);
            await ctrnExamInfo.clickNext(page);
        });
        await certCTRNFixtures.step('Continue past Test Assurance', async () => {
            await ctrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await ctrnTestAssurance.clickNext(page);
        });
        await certCTRNFixtures.step('Continue past Credential Verification', async () => {
            await ctrnCredVerification.clickNext(page);
        });
        await certCTRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await ctrnStatus.clickCheckoutButton();
            await expect(ctrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
        });
        await certCTRNFixtures.step('Choose payment type, credit card type', async () => {
            await ctrnCheckout.selectPaymentOption('CREDIT CARD');
            await expect(ctrnCheckout.creditCardOptions).toBeVisible();
            await ctrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(ctrnCheckout.submitButton).toBeVisible();
            await ctrnCheckout.clickSubmitCheckout();
        });
    });
      certCTRNFixtures('Submit blank payment details', async ({
          ctrnPayment
          }) => {
        await certCTRNFixtures.step('Set all values to blank', async () => {
            await ctrnPayment.fillOutAndSubmitPayment({
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

        await certCTRNFixtures.step('Expect error messages to be visible', async () => {
            await expect(ctrnPayment.nameError).toBeVisible();
            await expect(ctrnPayment.cardNumError).toBeVisible();
            await expect(ctrnPayment.cvvError).toBeVisible();
            await expect(ctrnPayment.monthError).toBeVisible();
            await expect(ctrnPayment.yearError).toBeVisible();
            await expect(ctrnPayment.addressError).toBeVisible();
            await expect(ctrnPayment.zipCodeError).toBeVisible();
            await expect(ctrnPayment.countryError).toBeVisible();
            await expect(ctrnPayment.countryError).toBeVisible();
            });
        });
  
        certCTRNFixtures('Click cancel on payment screen, expect to return to checkout', async ({
        ctrnPayment,
        page
        }) => {
            await certCTRNFixtures.step('Click cancel button, expect to go back to checkout', async () => {
                await ctrnPayment.cancelButton.click();
                await page.waitForLoadState('networkidle');
                await expect(ctrnPayment.workflowTitle).toContainText('Checkout and Make Payment');
            });
    });
    certCTRNFixtures('Successful case', async ({
        ctrnPayment,
        page,
        homePage,
        backOffice
        }) => {
            await certCTRNFixtures.step('Submit details', async () => {

                await ctrnPayment.fillOutAndSubmitPayment({
                    cardNum: '341111597242000',
                    cardName: 'Test Tester',
                    cvv: '',
                    month: 'Select',
                    year: 'Select',
                    address: '1234qwre',
                    country: 'United States',
                    zip: '60625'
                });
            });
            await certCTRNFixtures.step('Go to homepage, check SSA Message reads \'SCHEDULE\/MANAGE EXAM\'', async () => {
                await homePage.visit();
                await expect(homePage.buttonCTRN).toContainText(/SCHEuuDULE\/MANAGE EXAM/i);
            });
        });
  });
});