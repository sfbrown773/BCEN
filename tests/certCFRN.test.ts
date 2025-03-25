import { certCFRNFixtures, expect } from "../fixtures/certCFRN.fixtures";
import fs from 'fs';
import path from "path";

certCFRNFixtures.describe('CFRN Suite', () => {
  certCFRNFixtures.beforeEach('Wipe previous submittals and clear checkout', async ({
    homePage
    }) => {
        await certCFRNFixtures.step('Check cart for items. If any, clear them.', async () => {
            await homePage.clearCheckoutAtStart();
            await homePage.visit();
          });
        await certCFRNFixtures.step('Check for open submittal. If exists, delete it.', async () => {
            await homePage.removeSubmittal('CFRN');
            await homePage.visitCFRN();
        });
    });
certCFRNFixtures.describe.only('SSA messages', () => { 
    certCFRNFixtures.beforeEach('Start application, fill out exam info', async ({
        cfrnExamInfo,
        cfrnTestAssurance,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);
           
            await certCFRNFixtures.step('Fill out page one, Exam Information', async () => {
                await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
            });
            await certCFRNFixtures.step('Click next, move ahead to Test Assurance', async () => {
                await cfrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cfrnTestAssurance.checkWorkflowTitle('Test Assurance');
            });
        });

    certCFRNFixtures('Confirm SSA Message of in progress', async ({
        homePage
        }) => { 
        await certCFRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'In Progress.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCFRN).toContainText(/In Process/i);
        });
        });

    certCFRNFixtures('Continue application and confirm SSA Message of checkout', async ({
        cfrnTestAssurance,
        cfrnCredVerification,
        cfrnStatus,
        cfrnCheckout,
        homePage,
        page
        }) => { 
        await certCFRNFixtures.step('Click no test assurance, move to Credential Verification page', async () => {
            await cfrnTestAssurance.selectTestAssurance(false);
            await cfrnTestAssurance.clickNext(page);
        });

        await certCFRNFixtures.step('Move to Status page', async () => {
            await cfrnCredVerification.clickNext(page);
        });
        await certCFRNFixtures.step('Move to Checkout page', async () => {
            await cfrnStatus.clickCheckoutButton();
            await page.waitForLoadState('networkidle');
            await cfrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
        });
        await certCFRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Checkout.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCFRN).toContainText(/Checkout/i);
            });
        });
});


certCFRNFixtures.describe('Military documentation review', () => {
    certCFRNFixtures.beforeEach('Start application with military discount', async ({
        cfrnExamInfo,
        cfrnMilitaryDoc,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: true,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
        await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

        await certCFRNFixtures.step('Fill out exam information, selecting yes for military discount', async () => {
            await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
            await cfrnExamInfo.clickNext(page);
            await page.waitForLoadState('networkidle');
            await cfrnMilitaryDoc.checkWorkflowTitle('Upload Military Documentation');
        });
        });
    certCFRNFixtures('Begin application and confirm SSA Message of military documentation review', async ({
        cfrnExamInfo,
        cfrnMilitaryDoc,
        homePage,
        page
        }) => {

        await certCFRNFixtures.step('Upload test document for review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cfrnMilitaryDoc.uploadMilDoc(filePath);
        });
        await certCFRNFixtures.step('Navigate to end of Military Documentation Review flow', async () => {
            await cfrnMilitaryDoc.clickNext(page);
            await cfrnMilitaryDoc.clickAdvanceToMilitary();
            await cfrnMilitaryDoc.checkWorkflowTitle('Military Discount Instructions');
        });
        
        await certCFRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Military Documentation Review.\'', async () => {
        });
            await homePage.visit();
            await expect(homePage.buttonCFRN).toContainText(/Military Documentation Review/i);
        });

    certCFRNFixtures('Can remove uploaded files from military docs', async ({
        cfrnMilitaryDoc,
        homePage,
        page
        }) => {
        await certCFRNFixtures.step('Upload test files to both inputs', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cfrnMilitaryDoc.uploadMilDoc(filePath);
            await cfrnMilitaryDoc.uploadMilDoc2(filePath);
        });

        await certCFRNFixtures.step('Delete both uploaded files and confirm delete', async () => {
            await cfrnMilitaryDoc.deleteMilUpload1();
            await cfrnMilitaryDoc.deleteMilUpload2();
            await expect(cfrnMilitaryDoc.file1NoFile).toContainText(/No file chosen/);
            await expect(cfrnMilitaryDoc.file2NoFile).toContainText(/No file chosen/);
        });
        });
});


certCFRNFixtures.describe('Exam accommodation review', () => {
    certCFRNFixtures.beforeEach('Start application with exam accommodation', async ({
        cfrnExamInfo,
        cfrnExamAccommodations,
        page
        }) => {

            const examInfoArgs = {
                accommodationRequest: true,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
         await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

            await certCFRNFixtures.step('Fill out exam information, requesting accommodations on the exam', async () => {
                await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
                await cfrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cfrnExamAccommodations.checkWorkflowTitle('Exam Accommodation Request');
            });
        });
    certCFRNFixtures('Can remove uploaded files from exam accommodation', async ({
        cfrnExamAccommodations,
        homePage,
        page
        }) => {
        await certCFRNFixtures.step('Upload test documentation for exam accommodation review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
    
            await cfrnExamAccommodations.uploadExamAccomDoc(filePath);
            await page.waitForLoadState('load');
        });
        await certCFRNFixtures.step('Delete test document. Confirm deletion', async () => {
            await cfrnExamAccommodations.deleteFile1.click();
            await expect(cfrnExamAccommodations.errorMessageNoFile).toContainText(/No file chosen/);
        });
        });
        
    certCFRNFixtures('Yes exam accomodation, add step to left bar', async ({
        cfrnExamAccommodations
        }) => {

        await certCFRNFixtures.step('Confirm that \'Exam Accommodation\' is added to flow graphics in both desktop and mobile views', async () => {
            if (await cfrnExamAccommodations.mobileDropdown.isVisible()) {
                // Mobile View: Check if the dropdown contains "Exam Accommodation"
                const options = await cfrnExamAccommodations.mobileDropdown.locator('option').allTextContents();
                expect(options).toContain('Exam Accommodation Request');
                console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
            } else {
                // Desktop View: Check if the left bar step is visible
                await expect(cfrnExamAccommodations.examAccommodationsLeftBar).toBeVisible();
                console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
            }
        });
    });
});

certCFRNFixtures('Expect next button hidden', async ({
    cfrnExamInfo,
    page
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: false,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

    await certCFRNFixtures.step('When form is not filled, check that bottom text says \'Please complete all required fields,\' and that Next button is hidden.', async () => {
        await expect(cfrnExamInfo.pagination).toContainText('Please complete all required fields');
        await expect(cfrnExamInfo.nextButton).toBeHidden();
    });
    await certCFRNFixtures.step('Check that next button appears and disappears when form elements are checked and unchecked', async () => {
        await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
        await cfrnExamInfo.checkBoxesOneByOne();
    });
});

certCFRNFixtures('Test assurance error message', async ({
    cfrnExamInfo,
    cfrnTestAssurance
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: true,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

    await certCFRNFixtures.step('Navigate to Test Assurance step', async () => {
        await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
        await cfrnExamInfo.clickNext(page);
    });
    await certCFRNFixtures.step('Attempt to click next, successfully triggering error message', async () => {
        await cfrnTestAssurance.clickNext(page);
        await expect(cfrnTestAssurance.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
    });
});

certCFRNFixtures('Error messages on exam information', async ({
    cfrnExamInfo,
    page
    }) => {

        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: '',
            state: 'Select One',
            membership: 'Select One'
        }
        await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

        await certCFRNFixtures.step('Check that all error messages are triggered on Exam Information page', async () => {
            //Must interact with Exam Info elements before errors show. Thus, fillOutExamInfo as shown, and then delete those values in checkErrorMessages
            await cfrnExamInfo.fillOutExamInfo_CFRN({
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            });
            await cfrnExamInfo.checkErrorMessages();
        });
    });

certCFRNFixtures('Toggle membership - memberNumber input opens and closes', async ({
    cfrnExamInfo
    }) => {
        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: null,
            state: null,
            membership: 'Toggle between membership statuses'
        }
        await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

        await certCFRNFixtures.step('Select not a member, expect member number input to be hidden. Select member, expect member number input to be visible', async () => {
            await cfrnExamInfo.toggleMembership();
            await cfrnExamInfo.toggleMembership();
        });
});

certCFRNFixtures('Side graphic matches header, has orange color', async ({
    cfrnExamInfo,
    cfrnTestAssurance,
    cfrnCredVerification,
    cfrnStatus,
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
        await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs, testAssuranceArgs);

        await certCFRNFixtures.step('Check graphic on Exam Information page', async () => {
            await cfrnExamInfo.checkHeaderMatchesSidebar();
            await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
            await cfrnExamInfo.clickNext(page);
        });
        await certCFRNFixtures.step('Check graphic on Test Assurance page', async () => {
            await cfrnTestAssurance.checkHeaderMatchesSidebar();
            await cfrnTestAssurance.selectTestAssurance(testAssuranceArgs);
            await cfrnTestAssurance.clickNext(page);
        });
        await certCFRNFixtures.step('Check graphic on Credential Verification page', async () => {
            await cfrnCredVerification.checkHeaderMatchesSidebar();
            await cfrnCredVerification.clickNext(page);
        });
        await certCFRNFixtures.step('Check graphic on Status page', async () => {
            await cfrnStatus.checkHeaderMatchesSidebar();
        });
    });

  certCFRNFixtures.describe('Price checks for non-members of other societies', () => {
    certCFRNFixtures.beforeEach('Fill out exam info for non-member', async ({
        cfrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

        await certCFRNFixtures.step('Fill out Exam Information.', async () => {
            await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
            await cfrnExamInfo.clickNext(page);
        });
        });

        certCFRNFixtures('Not member, yes assurance', async ({
            cfrnTestAssurance,
            cfrnCredVerification,
            cfrnStatus,
            cfrnCheckout,
            page
            }) => {
                //THERE SHOULD BE A WAY TO SET THE TEST ASSURANCE ARG HERE, BUT KEEP THE EXAM INFO ARGS IN PLACE IN THE ANNOTATIONS
            await certCFRNFixtures.step('Select Yes for Test Assurance', async () => {
                await cfrnTestAssurance.selectTestAssurance(true);
                await cfrnTestAssurance.clickNext(page);
            });
            await certCFRNFixtures.step('Move through Credential Verification', async () => {
                await cfrnCredVerification.clickNext(page);
            });
            await certCFRNFixtures.step('Move through Status page', async () => {
                await cfrnStatus.clickCheckoutButton();
                await page.waitForLoadState('load');
                await cfrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
            });
            await certCFRNFixtures.step('Check displayed price', async () => {
                await expect(cfrnCheckout.checkoutTable).toContainText(cfrnCheckout.prices.priceYesMembershipYesTestAssurance)
                await expect.soft(cfrnCheckout.checkoutTable).toContainText('includes Test Assurance');
            });
            await certCFRNFixtures.step('Clear checkout', async () => {
                await cfrnCheckout.clearCheckout();
                await expect(cfrnCheckout.checkoutTable).toBeHidden();
            });
            });
        certCFRNFixtures('Not member, no assurance', async ({
            cfrnTestAssurance,
            cfrnCredVerification,
            cfrnStatus,
            cfrnCheckout,
            page
            }) => {
                //SAME THING HERE AS WITH PREVIOUS TEST - ADD testAssuranceArgs to annotations here.
                await certCFRNFixtures.step('Select No for Test Assurance', async () => {
                    await cfrnTestAssurance.selectTestAssurance(false);
                    await cfrnTestAssurance.clickNext(page);
                });
                await certCFRNFixtures.step('Move through Credential Verification', async () => {
                    await cfrnCredVerification.clickNext(page);
                });
                await certCFRNFixtures.step('Move through Status page', async () => {
                    await cfrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cfrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
                });
                await certCFRNFixtures.step('Check displayed price', async () => {
                    await expect(cfrnCheckout.checkoutTable).toContainText(cfrnCheckout.prices.priceNoMembershipNoTestAssurance);
                    await expect.soft(cfrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCFRNFixtures.step('Clear checkout', async () => {
                    await cfrnCheckout.clearCheckout();
                    await expect(cfrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });

  certCFRNFixtures.describe('Price checks for members of other societies', () => {
    certCFRNFixtures.beforeEach('Fill out exam info for other society member', async ({
        cfrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'Yes',
                memberNumber: '1234'
            }
            await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs);

            await certCFRNFixtures.step('Fill in exam info', async () => {
                await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
        
                await cfrnExamInfo.clickNext(page);
            });
        });

        certCFRNFixtures('Yes member, yes assurance', async ({
            cfrnTestAssurance,
            cfrnCredVerification,
            cfrnStatus,
            cfrnCheckout,
            page
            }) => {
                //SAME THING HERE AS PREVIOUS TWO
                await certCFRNFixtures.step('Select Yes for Test Assurance', async () => {
                    await cfrnTestAssurance.selectTestAssurance(true);
                    await cfrnTestAssurance.clickNext(page);
                });
                await certCFRNFixtures.step('Move through Credential Verification', async () => {
                    await cfrnCredVerification.clickNext(page);
                });
                await certCFRNFixtures.step('Move through Status page', async () => {
                    await cfrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cfrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCFRNFixtures.step('Check displayed price', async () => {
                    await expect(cfrnCheckout.checkoutTable).toContainText(cfrnCheckout.prices.priceYesMembershipYesTestAssurance)
                    await expect.soft(cfrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCFRNFixtures.step('Clear checkout', async () => {
                    await cfrnCheckout.clearCheckout();
                    await expect(cfrnCheckout.checkoutTable).toBeHidden();
                });
            });
        certCFRNFixtures('Yes member, no assurance', async ({
            cfrnTestAssurance,
            cfrnCredVerification,
            cfrnStatus,
            cfrnCheckout,
            page
            }) => {
                //AND HERE
                await certCFRNFixtures.step('Select No for Test Assurance', async () => {
                    await cfrnTestAssurance.selectTestAssurance(false);
                    await cfrnTestAssurance.clickNext(page);
                });
                await certCFRNFixtures.step('Move through Credential Verification', async () => {
                    await cfrnCredVerification.clickNext(page);
                });
                await certCFRNFixtures.step('Move through Status page', async () => {
                    await cfrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cfrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCFRNFixtures.step('Check displayed price', async () => {
                    await expect(cfrnCheckout.checkoutTable).toContainText(cfrnCheckout.prices.priceYesMembershipNoTestAssurance_others);
                });
                await certCFRNFixtures.step('Clear checkout', async () => {
                    await cfrnCheckout.clearCheckout();
                    await expect(cfrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });


certCFRNFixtures.describe('Checkout tests', () => {
    //On this group, the annotations are set on every test due to the absence of a beforeEach hook.
    certCFRNFixtures('SETUP TEST: grab checkout url, save to json', async ({
    cfrnExamInfo,
    cfrnTestAssurance,
    cfrnCredVerification,
    cfrnStatus,
    cfrnCheckout,
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
        await cfrnExamInfo.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCFRNFixtures.step('Fill out Exam Information', async () => {
            await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
            await cfrnExamInfo.clickNext(page);
        });
        await certCFRNFixtures.step('Continue past Test Assurance', async () => {
            await cfrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await cfrnTestAssurance.clickNext(page);
        });
        await certCFRNFixtures.step('Continue past Credential Verification', async () => {
            await cfrnCredVerification.clickNext(page);
        });
        await certCFRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cfrnStatus.clickCheckoutButton();
            await expect(cfrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
            //grab the unique url for this submittal
            const submittalURL = page.url();
            //pass this url to a json file so it can be used for different tests
            fs.writeFileSync('cfrn-url-checkout.json', JSON.stringify(submittalURL));
        });
        });
    certCFRNFixtures('Add blank voucher', async ({
    cfrnCheckout,
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
    await cfrnCheckout.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCFRNFixtures.step('Navigate to saved Checkout URL', async () => {
            const url = JSON.parse(fs.readFileSync('cfrn-url-checkout.json', 'utf-8'));
            await page.goto(url);
        });
        await certCFRNFixtures.step('Click button to submit blank voucher, expect error', async () => {
            await cfrnCheckout.clickAddVoucher();
            await expect(cfrnCheckout.voucherErrorPopup).toBeVisible();
        });
        await certCFRNFixtures.step('Close voucher error', async () => {
            await cfrnCheckout.clickCloseVoucherError();
            await expect(cfrnCheckout.addVoucherButton).toBeVisible();
        });
        });

    certCFRNFixtures('Payment type visibility - credit', async ({
        cfrnCheckout,
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
            await cfrnCheckout.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCFRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cfrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCFRNFixtures.step('Select Credit Card under Payment Options', async () => {
                await cfrnCheckout.selectPaymentOption('CREDIT CARD');
                await expect(cfrnCheckout.creditCardOptions).toBeVisible();
            });
            await certCFRNFixtures.step('Select Credit Card type, expect Submit button to be visible', async () => {
                await cfrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
                await expect(cfrnCheckout.submitButton).toBeVisible();
            });
        });

    certCFRNFixtures('Payment type visibility - echeck/ach', async ({
        cfrnCheckout,
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
            await cfrnCheckout.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCFRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cfrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCFRNFixtures.step('Select echeck, expect Submit button to be visible', async () => {
                await cfrnCheckout.selectPaymentOption('ACHRT');
                await expect(cfrnCheckout.submitButton).toBeVisible();
            });
        });

    certCFRNFixtures('Payment type visibility - check', async ({
        cfrnCheckout,
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
            await cfrnCheckout.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCFRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cfrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCFRNFixtures.step('Select Check, expect separate Submit Check button to be visible', async () => {
                await cfrnCheckout.selectPaymentOption('PAY_BY_CHECK');
                await cfrnCheckout.paymentOptions.click();
                await expect(cfrnCheckout.submitCheckButton).toBeVisible();
            });
        });
  });
  certCFRNFixtures.describe('Payment tests', () => {
    certCFRNFixtures.beforeEach('Get to payment', async ({
        cfrnExamInfo,
        cfrnTestAssurance,
        cfrnCredVerification,
        cfrnStatus,
        cfrnCheckout,
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
        await cfrnCheckout.setTestAnnotations(certCFRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCFRNFixtures.step('Fill out Exam Information', async () => {
            await cfrnExamInfo.fillOutExamInfo_CFRN(examInfoArgs);
            await cfrnExamInfo.clickNext(page);
        });
        await certCFRNFixtures.step('Continue past Test Assurance', async () => {
            await cfrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await cfrnTestAssurance.clickNext(page);
        });
        await certCFRNFixtures.step('Continue past Credential Verification', async () => {
            await cfrnCredVerification.clickNext(page);
        });
        await certCFRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cfrnStatus.clickCheckoutButton();
            await expect(cfrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
        });
        await certCFRNFixtures.step('Choose payment type, credit card type', async () => {
            await cfrnCheckout.selectPaymentOption('CREDIT CARD');
            await expect(cfrnCheckout.creditCardOptions).toBeVisible();
            await cfrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(cfrnCheckout.submitButton).toBeVisible();
            await cfrnCheckout.clickSubmitCheckout();
        });
    });
      certCFRNFixtures('Submit blank payment details', async ({
          cfrnPayment
          }) => {
        await certCFRNFixtures.step('Set all values to blank', async () => {
            await cfrnPayment.fillOutAndSubmitPayment({
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

        await certCFRNFixtures.step('Expect error messages to be visible', async () => {
            await expect(cfrnPayment.nameError).toBeVisible();
            await expect(cfrnPayment.cardNumError).toBeVisible();
            await expect(cfrnPayment.cvvError).toBeVisible();
            await expect(cfrnPayment.monthError).toBeVisible();
            await expect(cfrnPayment.yearError).toBeVisible();
            await expect(cfrnPayment.addressError).toBeVisible();
            await expect(cfrnPayment.zipCodeError).toBeVisible();
            await expect(cfrnPayment.countryError).toBeVisible();
            await expect(cfrnPayment.countryError).toBeVisible();
            });
        });
  
        certCFRNFixtures('Click cancel on payment screen, expect to return to checkout', async ({
        cfrnPayment,
        page
        }) => {
            await certCFRNFixtures.step('Click cancel button, expect to go back to checkout', async () => {
                await cfrnPayment.cancelButton.click();
                await page.waitForLoadState('networkidle');
                await expect(cfrnPayment.workflowTitle).toContainText('Checkout and Make Payment');
            });
    });
    certCFRNFixtures('Successful case', async ({
        cfrnPayment,
        page,
        homePage,
        backOffice
        }) => {
            await certCFRNFixtures.step('Submit details', async () => {

                await cfrnPayment.fillOutAndSubmitPayment({
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
            await certCFRNFixtures.step('Go to homepage, check SSA Message reads \'SCHEDULE\/MANAGE EXAM\'', async () => {
                await homePage.visit();
                await expect(homePage.buttonCFRN).toContainText(/SCHEuuDULE\/MANAGE EXAM/i);
            });
        });
  });
});