import { certTCRNFixtures, expect } from "../fixtures/certTCRN.fixtures";
import fs from 'fs';
import path from "path";

certTCRNFixtures.describe('TCRN Suite', () => {
  certTCRNFixtures.beforeEach('Wipe previous submittals and clear checkout', async ({
    homePage
    }) => {
        await certTCRNFixtures.step('Check cart for items. If any, clear them.', async () => {
            await homePage.clearCheckoutAtStart();
            await homePage.visit();
          });
        await certTCRNFixtures.step('Check for open submittal. If exists, delete it.', async () => {
            await homePage.removeSubmittal('TCRN');
            await homePage.visitTCRN();
        });
    });
certTCRNFixtures.describe.only('SSA messages', () => { 
    certTCRNFixtures.beforeEach('Start application, fill out exam info', async ({
        tcrnExamInfo,
        tcrnTestAssurance,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);
           
            await certTCRNFixtures.step('Fill out page one, Exam Information', async () => {
                await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
            });
            await certTCRNFixtures.step('Click next, move ahead to Test Assurance', async () => {
                await tcrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await tcrnTestAssurance.checkWorkflowTitle('Test Assurance');
            });
        });

    certTCRNFixtures('Confirm SSA Message of in progress', async ({
        homePage
        }) => { 
        await certTCRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'In Progress.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonTCRN).toContainText(/In Process/i);
        });
        });

    certTCRNFixtures('Continue application and confirm SSA Message of checkout', async ({
        tcrnTestAssurance,
        tcrnCredVerification,
        tcrnStatus,
        tcrnCheckout,
        homePage,
        page
        }) => { 
        await certTCRNFixtures.step('Click no test assurance, move to Credential Verification page', async () => {
            await tcrnTestAssurance.selectTestAssurance(false);
            await tcrnTestAssurance.clickNext(page);
        });

        await certTCRNFixtures.step('Move to Status page', async () => {
            await tcrnCredVerification.clickNext(page);
        });
        await certTCRNFixtures.step('Move to Checkout page', async () => {
            await tcrnStatus.clickCheckoutButton();
            await page.waitForLoadState('networkidle');
            await tcrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
        });
        await certTCRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Checkout.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonTCRN).toContainText(/Checkout/i);
            });
        });
});


certTCRNFixtures.describe('Military documentation review', () => {
    certTCRNFixtures.beforeEach('Start application with military discount', async ({
        tcrnExamInfo,
        tcrnMilitaryDoc,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: true,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
        await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

        await certTCRNFixtures.step('Fill out exam information, selecting yes for military discount', async () => {
            await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
            await tcrnExamInfo.clickNext(page);
            await page.waitForLoadState('networkidle');
            await tcrnMilitaryDoc.checkWorkflowTitle('Upload Military Documentation');
        });
        });
    certTCRNFixtures('Begin application and confirm SSA Message of military documentation review', async ({
        tcrnExamInfo,
        tcrnMilitaryDoc,
        homePage,
        page
        }) => {

        await certTCRNFixtures.step('Upload test document for review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await tcrnMilitaryDoc.uploadMilDoc(filePath);
        });
        await certTCRNFixtures.step('Navigate to end of Military Documentation Review flow', async () => {
            await tcrnMilitaryDoc.clickNext(page);
            await tcrnMilitaryDoc.clickAdvanceToMilitary();
            await tcrnMilitaryDoc.checkWorkflowTitle('Military Discount Instructions');
        });
        
        await certTCRNFixtures.step('Go to homepage, and check the SSA Message. Should be \'Military Documentation Review.\'', async () => {
        });
            await homePage.visit();
            await expect(homePage.buttonTCRN).toContainText(/Military Documentation Review/i);
        });

    certTCRNFixtures('Can remove uploaded files from military docs', async ({
        tcrnMilitaryDoc,
        homePage,
        page
        }) => {
        await certTCRNFixtures.step('Upload test files to both inputs', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await tcrnMilitaryDoc.uploadMilDoc(filePath);
            await tcrnMilitaryDoc.uploadMilDoc2(filePath);
        });

        await certTCRNFixtures.step('Delete both uploaded files and confirm delete', async () => {
            await tcrnMilitaryDoc.deleteMilUpload1();
            await tcrnMilitaryDoc.deleteMilUpload2();
            await expect(tcrnMilitaryDoc.file1NoFile).toContainText(/No file chosen/);
            await expect(tcrnMilitaryDoc.file2NoFile).toContainText(/No file chosen/);
        });
        });
});


certTCRNFixtures.describe('Exam accommodation review', () => {
    certTCRNFixtures.beforeEach('Start application with exam accommodation', async ({
        tcrnExamInfo,
        tcrnExamAccommodations,
        page
        }) => {

            const examInfoArgs = {
                accommodationRequest: true,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
         await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

            await certTCRNFixtures.step('Fill out exam information, requesting accommodations on the exam', async () => {
                await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
                await tcrnExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await tcrnExamAccommodations.checkWorkflowTitle('Exam Accommodation Request');
            });
        });
    certTCRNFixtures('Can remove uploaded files from exam accommodation', async ({
        tcrnExamAccommodations,
        homePage,
        page
        }) => {
        await certTCRNFixtures.step('Upload test documentation for exam accommodation review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
    
            await tcrnExamAccommodations.uploadExamAccomDoc(filePath);
            await page.waitForLoadState('load');
        });
        await certTCRNFixtures.step('Delete test document. Confirm deletion', async () => {
            await tcrnExamAccommodations.deleteFile1.click();
            await expect(tcrnExamAccommodations.errorMessageNoFile).toContainText(/No file chosen/);
        });
        });
        
    certTCRNFixtures('Yes exam accomodation, add step to left bar', async ({
        tcrnExamAccommodations
        }) => {

        await certTCRNFixtures.step('Confirm that \'Exam Accommodation\' is added to flow graphics in both desktop and mobile views', async () => {
            if (await tcrnExamAccommodations.mobileDropdown.isVisible()) {
                // Mobile View: Check if the dropdown contains "Exam Accommodation"
                const options = await tcrnExamAccommodations.mobileDropdown.locator('option').allTextContents();
                expect(options).toContain('Exam Accommodation Request');
                console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
            } else {
                // Desktop View: Check if the left bar step is visible
                await expect(tcrnExamAccommodations.examAccommodationsLeftBar).toBeVisible();
                console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
            }
        });
    });
});

certTCRNFixtures('Expect next button hidden', async ({
    tcrnExamInfo,
    page
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: false,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

    await certTCRNFixtures.step('When form is not filled, check that bottom text says \'Please complete all required fields,\' and that Next button is hidden.', async () => {
        await expect(tcrnExamInfo.pagination).toContainText('Please complete all required fields');
        await expect(tcrnExamInfo.nextButton).toBeHidden();
    });
    await certTCRNFixtures.step('Check that next button appears and disappears when form elements are checked and unchecked', async () => {
        await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
        await tcrnExamInfo.checkBoxesOneByOne();
    });
});

certTCRNFixtures('Test assurance error message', async ({
    tcrnExamInfo,
    tcrnTestAssurance
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: true,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

    await certTCRNFixtures.step('Navigate to Test Assurance step', async () => {
        await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
        await tcrnExamInfo.clickNext(page);
    });
    await certTCRNFixtures.step('Attempt to click next, successfully triggering error message', async () => {
        await tcrnTestAssurance.clickNext(page);
        await expect(tcrnTestAssurance.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
    });
});

certTCRNFixtures('Error messages on exam information', async ({
    tcrnExamInfo,
    page
    }) => {

        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: '',
            state: 'Select One',
            membership: 'Select One'
        }
        await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

        await certTCRNFixtures.step('Check that all error messages are triggered on Exam Information page', async () => {
            //Must interact with Exam Info elements before errors show. Thus, fillOutExamInfo as shown, and then delete those values in checkErrorMessages
            await tcrnExamInfo.fillOutExamInfo_TCRN({
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            });
            await tcrnExamInfo.checkErrorMessages();
        });
    });

certTCRNFixtures('Toggle membership - memberNumber input opens and closes', async ({
    tcrnExamInfo
    }) => {
        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: null,
            state: null,
            membership: 'Toggle between membership statuses'
        }
        await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

        await certTCRNFixtures.step('Select not a member, expect member number input to be hidden. Select member, expect member number input to be visible', async () => {
            await tcrnExamInfo.toggleMembership();
            await tcrnExamInfo.toggleMembership();
        });
});

certTCRNFixtures('Side graphic matches header, has orange color', async ({
    tcrnExamInfo,
    tcrnTestAssurance,
    tcrnCredVerification,
    tcrnStatus,
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
        await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs, testAssuranceArgs);

        await certTCRNFixtures.step('Check graphic on Exam Information page', async () => {
            await tcrnExamInfo.checkHeaderMatchesSidebar();
            await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
            await tcrnExamInfo.clickNext(page);
        });
        await certTCRNFixtures.step('Check graphic on Test Assurance page', async () => {
            await tcrnTestAssurance.checkHeaderMatchesSidebar();
            await tcrnTestAssurance.selectTestAssurance(testAssuranceArgs);
            await tcrnTestAssurance.clickNext(page);
        });
        await certTCRNFixtures.step('Check graphic on Credential Verification page', async () => {
            await tcrnCredVerification.checkHeaderMatchesSidebar();
            await tcrnCredVerification.clickNext(page);
        });
        await certTCRNFixtures.step('Check graphic on Status page', async () => {
            await tcrnStatus.checkHeaderMatchesSidebar();
        });
    });

  certTCRNFixtures.describe('Price checks for non-members of other societies', () => {
    certTCRNFixtures.beforeEach('Fill out exam info for non-member', async ({
        tcrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

        await certTCRNFixtures.step('Fill out Exam Information.', async () => {
            await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
            await tcrnExamInfo.clickNext(page);
        });
        });

        certTCRNFixtures('Not member, yes assurance', async ({
            tcrnTestAssurance,
            tcrnCredVerification,
            tcrnStatus,
            tcrnCheckout,
            page
            }) => {
                //THERE SHOULD BE A WAY TO SET THE TEST ASSURANCE ARG HERE, BUT KEEP THE EXAM INFO ARGS IN PLACE IN THE ANNOTATIONS
            await certTCRNFixtures.step('Select Yes for Test Assurance', async () => {
                await tcrnTestAssurance.selectTestAssurance(true);
                await tcrnTestAssurance.clickNext(page);
            });
            await certTCRNFixtures.step('Move through Credential Verification', async () => {
                await tcrnCredVerification.clickNext(page);
            });
            await certTCRNFixtures.step('Move through Status page', async () => {
                await tcrnStatus.clickCheckoutButton();
                await page.waitForLoadState('load');
                await tcrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
            });
            await certTCRNFixtures.step('Check displayed price', async () => {
                await expect(tcrnCheckout.checkoutTable).toContainText(tcrnCheckout.prices.priceYesMembershipYesTestAssurance)
                await expect.soft(tcrnCheckout.checkoutTable).toContainText('includes Test Assurance');
            });
            await certTCRNFixtures.step('Clear checkout', async () => {
                await tcrnCheckout.clearCheckout();
                await expect(tcrnCheckout.checkoutTable).toBeHidden();
            });
            });
        certTCRNFixtures('Not member, no assurance', async ({
            tcrnTestAssurance,
            tcrnCredVerification,
            tcrnStatus,
            tcrnCheckout,
            page
            }) => {
                //SAME THING HERE AS WITH PREVIOUS TEST - ADD testAssuranceArgs to annotations here.
                await certTCRNFixtures.step('Select No for Test Assurance', async () => {
                    await tcrnTestAssurance.selectTestAssurance(false);
                    await tcrnTestAssurance.clickNext(page);
                });
                await certTCRNFixtures.step('Move through Credential Verification', async () => {
                    await tcrnCredVerification.clickNext(page);
                });
                await certTCRNFixtures.step('Move through Status page', async () => {
                    await tcrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await tcrnCheckout.checkWorkflowTitle('Checkout and Make Payment');
                });
                await certTCRNFixtures.step('Check displayed price', async () => {
                    await expect(tcrnCheckout.checkoutTable).toContainText(tcrnCheckout.prices.priceNoMembershipNoTestAssurance);
                    await expect.soft(tcrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certTCRNFixtures.step('Clear checkout', async () => {
                    await tcrnCheckout.clearCheckout();
                    await expect(tcrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });

  certTCRNFixtures.describe('Price checks for members of other societies', () => {
    certTCRNFixtures.beforeEach('Fill out exam info for other society member', async ({
        tcrnExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'Yes',
                memberNumber: '1234'
            }
            await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs);

            await certTCRNFixtures.step('Fill in exam info', async () => {
                await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
        
                await tcrnExamInfo.clickNext(page);
            });
        });

        certTCRNFixtures('Yes member, yes assurance', async ({
            tcrnTestAssurance,
            tcrnCredVerification,
            tcrnStatus,
            tcrnCheckout,
            page
            }) => {
                //SAME THING HERE AS PREVIOUS TWO
                await certTCRNFixtures.step('Select Yes for Test Assurance', async () => {
                    await tcrnTestAssurance.selectTestAssurance(true);
                    await tcrnTestAssurance.clickNext(page);
                });
                await certTCRNFixtures.step('Move through Credential Verification', async () => {
                    await tcrnCredVerification.clickNext(page);
                });
                await certTCRNFixtures.step('Move through Status page', async () => {
                    await tcrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await tcrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certTCRNFixtures.step('Check displayed price', async () => {
                    await expect(tcrnCheckout.checkoutTable).toContainText(tcrnCheckout.prices.priceYesMembershipYesTestAssurance)
                    await expect.soft(tcrnCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certTCRNFixtures.step('Clear checkout', async () => {
                    await tcrnCheckout.clearCheckout();
                    await expect(tcrnCheckout.checkoutTable).toBeHidden();
                });
            });
        certTCRNFixtures('Yes member, no assurance', async ({
            tcrnTestAssurance,
            tcrnCredVerification,
            tcrnStatus,
            tcrnCheckout,
            page
            }) => {
                //AND HERE
                await certTCRNFixtures.step('Select No for Test Assurance', async () => {
                    await tcrnTestAssurance.selectTestAssurance(false);
                    await tcrnTestAssurance.clickNext(page);
                });
                await certTCRNFixtures.step('Move through Credential Verification', async () => {
                    await tcrnCredVerification.clickNext(page);
                });
                await certTCRNFixtures.step('Move through Status page', async () => {
                    await tcrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await tcrnCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certTCRNFixtures.step('Check displayed price', async () => {
                    await expect(tcrnCheckout.checkoutTable).toContainText(tcrnCheckout.prices.priceYesMembershipNoTestAssurance_others);
                });
                await certTCRNFixtures.step('Clear checkout', async () => {
                    await tcrnCheckout.clearCheckout();
                    await expect(tcrnCheckout.checkoutTable).toBeHidden();
                });
            });
  });


certTCRNFixtures.describe('Checkout tests', () => {
    //On this group, the annotations are set on every test due to the absence of a beforeEach hook.
    certTCRNFixtures('SETUP TEST: grab checkout url, save to json', async ({
    tcrnExamInfo,
    tcrnTestAssurance,
    tcrnCredVerification,
    tcrnStatus,
    tcrnCheckout,
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
        await tcrnExamInfo.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certTCRNFixtures.step('Fill out Exam Information', async () => {
            await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
            await tcrnExamInfo.clickNext(page);
        });
        await certTCRNFixtures.step('Continue past Test Assurance', async () => {
            await tcrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await tcrnTestAssurance.clickNext(page);
        });
        await certTCRNFixtures.step('Continue past Credential Verification', async () => {
            await tcrnCredVerification.clickNext(page);
        });
        await certTCRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await tcrnStatus.clickCheckoutButton();
            await expect(tcrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
            //grab the unique url for this submittal
            const submittalURL = page.url();
            //pass this url to a json file so it can be used for different tests
            fs.writeFileSync('tcrn-url-checkout.json', JSON.stringify(submittalURL));
        });
        });
    certTCRNFixtures('Add blank voucher', async ({
    tcrnCheckout,
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
    await tcrnCheckout.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certTCRNFixtures.step('Navigate to saved Checkout URL', async () => {
            const url = JSON.parse(fs.readFileSync('tcrn-url-checkout.json', 'utf-8'));
            await page.goto(url);
        });
        await certTCRNFixtures.step('Click button to submit blank voucher, expect error', async () => {
            await tcrnCheckout.clickAddVoucher();
            await expect(tcrnCheckout.voucherErrorPopup).toBeVisible();
        });
        await certTCRNFixtures.step('Close voucher error', async () => {
            await tcrnCheckout.clickCloseVoucherError();
            await expect(tcrnCheckout.addVoucherButton).toBeVisible();
        });
        });

    certTCRNFixtures('Payment type visibility - credit', async ({
        tcrnCheckout,
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
            await tcrnCheckout.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certTCRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('tcrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certTCRNFixtures.step('Select Credit Card under Payment Options', async () => {
                await tcrnCheckout.selectPaymentOption('CREDIT CARD');
                await expect(tcrnCheckout.creditCardOptions).toBeVisible();
            });
            await certTCRNFixtures.step('Select Credit Card type, expect Submit button to be visible', async () => {
                await tcrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
                await expect(tcrnCheckout.submitButton).toBeVisible();
            });
        });

    certTCRNFixtures('Payment type visibility - echeck/ach', async ({
        tcrnCheckout,
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
            await tcrnCheckout.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certTCRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('tcrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certTCRNFixtures.step('Select echeck, expect Submit button to be visible', async () => {
                await tcrnCheckout.selectPaymentOption('ACHRT');
                await expect(tcrnCheckout.submitButton).toBeVisible();
            });
        });

    certTCRNFixtures('Payment type visibility - check', async ({
        tcrnCheckout,
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
            await tcrnCheckout.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certTCRNFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('tcrn-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certTCRNFixtures.step('Select Check, expect separate Submit Check button to be visible', async () => {
                await tcrnCheckout.selectPaymentOption('PAY_BY_CHECK');
                await tcrnCheckout.paymentOptions.click();
                await expect(tcrnCheckout.submitCheckButton).toBeVisible();
            });
        });
  });
  certTCRNFixtures.describe('Payment tests', () => {
    certTCRNFixtures.beforeEach('Get to payment', async ({
        tcrnExamInfo,
        tcrnTestAssurance,
        tcrnCredVerification,
        tcrnStatus,
        tcrnCheckout,
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
        await tcrnCheckout.setTestAnnotations(certTCRNFixtures.info(), examInfoArgs, testAssuranceArg);

        await certTCRNFixtures.step('Fill out Exam Information', async () => {
            await tcrnExamInfo.fillOutExamInfo_TCRN(examInfoArgs);
            await tcrnExamInfo.clickNext(page);
        });
        await certTCRNFixtures.step('Continue past Test Assurance', async () => {
            await tcrnTestAssurance.selectTestAssurance(testAssuranceArg);
            await tcrnTestAssurance.clickNext(page);
        });
        await certTCRNFixtures.step('Continue past Credential Verification', async () => {
            await tcrnCredVerification.clickNext(page);
        });
        await certTCRNFixtures.step('Continue past Status and save Checkout URL', async () => {
            await tcrnStatus.clickCheckoutButton();
            await expect(tcrnCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
        });
        await certTCRNFixtures.step('Choose payment type, credit card type', async () => {
            await tcrnCheckout.selectPaymentOption('CREDIT CARD');
            await expect(tcrnCheckout.creditCardOptions).toBeVisible();
            await tcrnCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(tcrnCheckout.submitButton).toBeVisible();
            await tcrnCheckout.clickSubmitCheckout();
        });
    });
      certTCRNFixtures('Submit blank payment details', async ({
          tcrnPayment
          }) => {
        await certTCRNFixtures.step('Set all values to blank', async () => {
            await tcrnPayment.fillOutAndSubmitPayment({
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

        await certTCRNFixtures.step('Expect error messages to be visible', async () => {
            await expect(tcrnPayment.nameError).toBeVisible();
            await expect(tcrnPayment.cardNumError).toBeVisible();
            await expect(tcrnPayment.cvvError).toBeVisible();
            await expect(tcrnPayment.monthError).toBeVisible();
            await expect(tcrnPayment.yearError).toBeVisible();
            await expect(tcrnPayment.addressError).toBeVisible();
            await expect(tcrnPayment.zipCodeError).toBeVisible();
            await expect(tcrnPayment.countryError).toBeVisible();
            await expect(tcrnPayment.countryError).toBeVisible();
            });
        });
  
        certTCRNFixtures('Click cancel on payment screen, expect to return to checkout', async ({
        tcrnPayment,
        page
        }) => {
            await certTCRNFixtures.step('Click cancel button, expect to go back to checkout', async () => {
                await tcrnPayment.cancelButton.click();
                await page.waitForLoadState('networkidle');
                await expect(tcrnPayment.workflowTitle).toContainText('Checkout and Make Payment');
            });
    });
    certTCRNFixtures('Successful case', async ({
        tcrnPayment,
        page,
        homePage,
        backOffice
        }) => {
            await certTCRNFixtures.step('Submit details', async () => {

                await tcrnPayment.fillOutAndSubmitPayment({
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
            await certTCRNFixtures.step('Go to homepage, check SSA Message reads \'SCHEDULE\/MANAGE EXAM\'', async () => {
                await homePage.visit();
                await expect(homePage.buttonTCRN).toContainText(/SCHEuuDULE\/MANAGE EXAM/i);
            });
        });
  });
});