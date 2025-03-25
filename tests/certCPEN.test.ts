import { certCPENFixtures, expect } from "../fixtures/certCPEN.fixtures";
import fs from 'fs';
import path from "path";

certCPENFixtures.describe('CPEN Suite', () => {
  certCPENFixtures.beforeEach('Wipe previous submittals and clear checkout', async ({
    homePage
    }) => {
        await certCPENFixtures.step('Check cart for items. If any, clear them.', async () => {
            await homePage.clearCheckoutAtStart();
            await homePage.visit();
          });
        await certCPENFixtures.step('Check for open submittal. If exists, delete it.', async () => {
            await homePage.removeSubmittal('CPEN');
            await homePage.visitCPEN();
        });
    });
certCPENFixtures.describe.only('SSA messages', () => { 
    certCPENFixtures.beforeEach('Start application, fill out exam info', async ({
        cpenExamInfo,
        cpenTestAssurance,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);
           
            await certCPENFixtures.step('Fill out page one, Exam Information', async () => {
                await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
            });
            await certCPENFixtures.step('Click next, move ahead to Test Assurance', async () => {
                await cpenExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cpenTestAssurance.checkWorkflowTitle('Test Assurance');
            });
        });

    certCPENFixtures('Confirm SSA Message of in progress', async ({
        homePage
        }) => { 
        await certCPENFixtures.step('Go to homepage, and check the SSA Message. Should be \'In Progress.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCPEN).toContainText(/In Process/i);
        });
        });

    certCPENFixtures('Continue application and confirm SSA Message of checkout', async ({
        cpenTestAssurance,
        cpenCredVerification,
        cpenStatus,
        cpenCheckout,
        homePage,
        page
        }) => { 
        await certCPENFixtures.step('Click no test assurance, move to Credential Verification page', async () => {
            await cpenTestAssurance.selectTestAssurance(false);
            await cpenTestAssurance.clickNext(page);
        });

        await certCPENFixtures.step('Move to Status page', async () => {
            await cpenCredVerification.clickNext(page);
        });
        await certCPENFixtures.step('Move to Checkout page', async () => {
            await cpenStatus.clickCheckoutButton();
            await page.waitForLoadState('networkidle');
            await cpenCheckout.checkWorkflowTitle('Checkout and Make Payment');
        });
        await certCPENFixtures.step('Go to homepage, and check the SSA Message. Should be \'Checkout.\'', async () => {
            await homePage.visit();
            await expect(homePage.buttonCPEN).toContainText(/Checkout/i);
            });
        });
});


certCPENFixtures.describe('Military documentation review', () => {
    certCPENFixtures.beforeEach('Start application with military discount', async ({
        cpenExamInfo,
        cpenMilitaryDoc,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: true,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
        await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

        await certCPENFixtures.step('Fill out exam information, selecting yes for military discount', async () => {
            await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
            await cpenExamInfo.clickNext(page);
            await page.waitForLoadState('networkidle');
            await cpenMilitaryDoc.checkWorkflowTitle('Upload Military Documentation');
        });
        });
    certCPENFixtures('Begin application and confirm SSA Message of military documentation review', async ({
        cpenExamInfo,
        cpenMilitaryDoc,
        homePage,
        page
        }) => {

        await certCPENFixtures.step('Upload test document for review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cpenMilitaryDoc.uploadMilDoc(filePath);
        });
        await certCPENFixtures.step('Navigate to end of Military Documentation Review flow', async () => {
            await cpenMilitaryDoc.clickNext(page);
            await cpenMilitaryDoc.clickAdvanceToMilitary();
            await cpenMilitaryDoc.checkWorkflowTitle('Military Discount Instructions');
        });
        
        await certCPENFixtures.step('Go to homepage, and check the SSA Message. Should be \'Military Documentation Review.\'', async () => {
        });
            await homePage.visit();
            await expect(homePage.buttonCPEN).toContainText(/Military Documentation Review/i);
        });

    certCPENFixtures('Can remove uploaded files from military docs', async ({
        cpenMilitaryDoc,
        homePage,
        page
        }) => {
        await certCPENFixtures.step('Upload test files to both inputs', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cpenMilitaryDoc.uploadMilDoc(filePath);
            await cpenMilitaryDoc.uploadMilDoc2(filePath);
        });

        await certCPENFixtures.step('Delete both uploaded files and confirm delete', async () => {
            await cpenMilitaryDoc.deleteMilUpload1();
            await cpenMilitaryDoc.deleteMilUpload2();
            await expect(cpenMilitaryDoc.file1NoFile).toContainText(/No file chosen/);
            await expect(cpenMilitaryDoc.file2NoFile).toContainText(/No file chosen/);
        });
        });
});


certCPENFixtures.describe('Exam accommodation review', () => {
    certCPENFixtures.beforeEach('Start application with exam accommodation', async ({
        cpenExamInfo,
        cpenExamAccommodations,
        page
        }) => {

            const examInfoArgs = {
                accommodationRequest: true,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
         await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

            await certCPENFixtures.step('Fill out exam information, requesting accommodations on the exam', async () => {
                await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
                await cpenExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cpenExamAccommodations.checkWorkflowTitle('Exam Accommodation Request');
            });
        });
    certCPENFixtures('Can remove uploaded files from exam accommodation', async ({
        cpenExamAccommodations,
        homePage,
        page
        }) => {
        await certCPENFixtures.step('Upload test documentation for exam accommodation review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
    
            await cpenExamAccommodations.uploadExamAccomDoc(filePath);
            await page.waitForLoadState('load');
        });
        await certCPENFixtures.step('Delete test document. Confirm deletion', async () => {
            await cpenExamAccommodations.deleteFile1.click();
            await expect(cpenExamAccommodations.errorMessageNoFile).toContainText(/No file chosen/);
        });
        });
        
    certCPENFixtures('Yes exam accomodation, add step to left bar', async ({
        cpenExamAccommodations
        }) => {

        await certCPENFixtures.step('Confirm that \'Exam Accommodation\' is added to flow graphics in both desktop and mobile views', async () => {
            if (await cpenExamAccommodations.mobileDropdown.isVisible()) {
                // Mobile View: Check if the dropdown contains "Exam Accommodation"
                const options = await cpenExamAccommodations.mobileDropdown.locator('option').allTextContents();
                expect(options).toContain('Exam Accommodation Request');
                console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
            } else {
                // Desktop View: Check if the left bar step is visible
                await expect(cpenExamAccommodations.examAccommodationsLeftBar).toBeVisible();
                console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
            }
        });
    });
});

certCPENFixtures('Expect next button hidden', async ({
    cpenExamInfo,
    page
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: false,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

    await certCPENFixtures.step('When form is not filled, check that bottom text says \'Please complete all required fields,\' and that Next button is hidden.', async () => {
        await expect(cpenExamInfo.pagination).toContainText('Please complete all required fields');
        await expect(cpenExamInfo.nextButton).toBeHidden();
    });
    await certCPENFixtures.step('Check that next button appears and disappears when form elements are checked and unchecked', async () => {
        await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
        await cpenExamInfo.checkBoxesOneByOne();
    });
});

certCPENFixtures('Test assurance error message', async ({
    cpenExamInfo,
    cpenTestAssurance
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: true,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

    await certCPENFixtures.step('Navigate to Test Assurance step', async () => {
        await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
        await cpenExamInfo.clickNext(page);
    });
    await certCPENFixtures.step('Attempt to click next, successfully triggering error message', async () => {
        await cpenTestAssurance.clickNext(page);
        await expect(cpenTestAssurance.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
    });
});

certCPENFixtures('Error messages on exam information', async ({
    cpenExamInfo,
    page
    }) => {

        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: '',
            state: 'Select One',
            membership: 'Select One'
        }
        await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

        await certCPENFixtures.step('Check that all error messages are triggered on Exam Information page', async () => {
            //Must interact with Exam Info elements before errors show. Thus, fillOutExamInfo as shown, and then delete those values in checkErrorMessages
            await cpenExamInfo.fillOutExamInfo_CPEN({
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            });
            await cpenExamInfo.checkErrorMessages();
        });
    });

certCPENFixtures('Toggle membership - memberNumber input opens and closes', async ({
    cpenExamInfo
    }) => {
        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: null,
            state: null,
            membership: 'Toggle between membership statuses'
        }
        await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

        await certCPENFixtures.step('Select not a member, expect member number input to be hidden. Select member, expect member number input to be visible', async () => {
            await cpenExamInfo.toggleMembership();
            await cpenExamInfo.toggleMembership();
        });
});

certCPENFixtures('Side graphic matches header, has orange color', async ({
    cpenExamInfo,
    cpenTestAssurance,
    cpenCredVerification,
    cpenStatus,
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
        await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs, testAssuranceArgs);

        await certCPENFixtures.step('Check graphic on Exam Information page', async () => {
            await cpenExamInfo.checkHeaderMatchesSidebar();
            await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
            await cpenExamInfo.clickNext(page);
        });
        await certCPENFixtures.step('Check graphic on Test Assurance page', async () => {
            await cpenTestAssurance.checkHeaderMatchesSidebar();
            await cpenTestAssurance.selectTestAssurance(testAssuranceArgs);
            await cpenTestAssurance.clickNext(page);
        });
        await certCPENFixtures.step('Check graphic on Credential Verification page', async () => {
            await cpenCredVerification.checkHeaderMatchesSidebar();
            await cpenCredVerification.clickNext(page);
        });
        await certCPENFixtures.step('Check graphic on Status page', async () => {
            await cpenStatus.checkHeaderMatchesSidebar();
        });
    });

  certCPENFixtures.describe('Price checks for non-members of other societies', () => {
    certCPENFixtures.beforeEach('Fill out exam info for non-member', async ({
        cpenExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

        await certCPENFixtures.step('Fill out Exam Information.', async () => {
            await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
            await cpenExamInfo.clickNext(page);
        });
        });

        certCPENFixtures('Not member, yes assurance', async ({
            cpenTestAssurance,
            cpenCredVerification,
            cpenStatus,
            cpenCheckout,
            page
            }) => {
                //THERE SHOULD BE A WAY TO SET THE TEST ASSURANCE ARG HERE, BUT KEEP THE EXAM INFO ARGS IN PLACE IN THE ANNOTATIONS
            await certCPENFixtures.step('Select Yes for Test Assurance', async () => {
                await cpenTestAssurance.selectTestAssurance(true);
                await cpenTestAssurance.clickNext(page);
            });
            await certCPENFixtures.step('Move through Credential Verification', async () => {
                await cpenCredVerification.clickNext(page);
            });
            await certCPENFixtures.step('Move through Status page', async () => {
                await cpenStatus.clickCheckoutButton();
                await page.waitForLoadState('load');
                await cpenCheckout.checkWorkflowTitle('Checkout and Make Payment');
            });
            await certCPENFixtures.step('Check displayed price', async () => {
                await expect(cpenCheckout.checkoutTable).toContainText(cpenCheckout.prices.priceYesMembershipYesTestAssurance)
                await expect.soft(cpenCheckout.checkoutTable).toContainText('includes Test Assurance');
            });
            await certCPENFixtures.step('Clear checkout', async () => {
                await cpenCheckout.clearCheckout();
                await expect(cpenCheckout.checkoutTable).toBeHidden();
            });
            });
        certCPENFixtures('Not member, no assurance', async ({
            cpenTestAssurance,
            cpenCredVerification,
            cpenStatus,
            cpenCheckout,
            page
            }) => {
                //SAME THING HERE AS WITH PREVIOUS TEST - ADD testAssuranceArgs to annotations here.
                await certCPENFixtures.step('Select No for Test Assurance', async () => {
                    await cpenTestAssurance.selectTestAssurance(false);
                    await cpenTestAssurance.clickNext(page);
                });
                await certCPENFixtures.step('Move through Credential Verification', async () => {
                    await cpenCredVerification.clickNext(page);
                });
                await certCPENFixtures.step('Move through Status page', async () => {
                    await cpenStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cpenCheckout.checkWorkflowTitle('Checkout and Make Payment');
                });
                await certCPENFixtures.step('Check displayed price', async () => {
                    await expect(cpenCheckout.checkoutTable).toContainText(cpenCheckout.prices.priceNoMembershipNoTestAssurance);
                    await expect.soft(cpenCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCPENFixtures.step('Clear checkout', async () => {
                    await cpenCheckout.clearCheckout();
                    await expect(cpenCheckout.checkoutTable).toBeHidden();
                });
            });
  });

  certCPENFixtures.describe('Price checks for members of other societies', () => {
    certCPENFixtures.beforeEach('Fill out exam info for other society member', async ({
        cpenExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'Yes',
                memberNumber: '1234'
            }
            await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs);

            await certCPENFixtures.step('Fill in exam info', async () => {
                await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
        
                await cpenExamInfo.clickNext(page);
            });
        });

        certCPENFixtures('Yes member, yes assurance', async ({
            cpenTestAssurance,
            cpenCredVerification,
            cpenStatus,
            cpenCheckout,
            page
            }) => {
                //SAME THING HERE AS PREVIOUS TWO
                await certCPENFixtures.step('Select Yes for Test Assurance', async () => {
                    await cpenTestAssurance.selectTestAssurance(true);
                    await cpenTestAssurance.clickNext(page);
                });
                await certCPENFixtures.step('Move through Credential Verification', async () => {
                    await cpenCredVerification.clickNext(page);
                });
                await certCPENFixtures.step('Move through Status page', async () => {
                    await cpenStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cpenCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCPENFixtures.step('Check displayed price', async () => {
                    await expect(cpenCheckout.checkoutTable).toContainText(cpenCheckout.prices.priceYesMembershipYesTestAssurance)
                    await expect.soft(cpenCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCPENFixtures.step('Clear checkout', async () => {
                    await cpenCheckout.clearCheckout();
                    await expect(cpenCheckout.checkoutTable).toBeHidden();
                });
            });
        certCPENFixtures('Yes member, no assurance', async ({
            cpenTestAssurance,
            cpenCredVerification,
            cpenStatus,
            cpenCheckout,
            page
            }) => {
                //AND HERE
                await certCPENFixtures.step('Select No for Test Assurance', async () => {
                    await cpenTestAssurance.selectTestAssurance(false);
                    await cpenTestAssurance.clickNext(page);
                });
                await certCPENFixtures.step('Move through Credential Verification', async () => {
                    await cpenCredVerification.clickNext(page);
                });
                await certCPENFixtures.step('Move through Status page', async () => {
                    await cpenStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cpenCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCPENFixtures.step('Check displayed price', async () => {
                    await expect(cpenCheckout.checkoutTable).toContainText(cpenCheckout.prices.priceYesMembershipNoTestAssurance_others);
                });
                await certCPENFixtures.step('Clear checkout', async () => {
                    await cpenCheckout.clearCheckout();
                    await expect(cpenCheckout.checkoutTable).toBeHidden();
                });
            });
  });


certCPENFixtures.describe('Checkout tests', () => {
    //On this group, the annotations are set on every test due to the absence of a beforeEach hook.
    certCPENFixtures('SETUP TEST: grab checkout url, save to json', async ({
    cpenExamInfo,
    cpenTestAssurance,
    cpenCredVerification,
    cpenStatus,
    cpenCheckout,
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
        await cpenExamInfo.setTestAnnotations(certCPENFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCPENFixtures.step('Fill out Exam Information', async () => {
            await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
            await cpenExamInfo.clickNext(page);
        });
        await certCPENFixtures.step('Continue past Test Assurance', async () => {
            await cpenTestAssurance.selectTestAssurance(testAssuranceArg);
            await cpenTestAssurance.clickNext(page);
        });
        await certCPENFixtures.step('Continue past Credential Verification', async () => {
            await cpenCredVerification.clickNext(page);
        });
        await certCPENFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cpenStatus.clickCheckoutButton();
            await expect(cpenCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
            //grab the unique url for this submittal
            const submittalURL = page.url();
            //pass this url to a json file so it can be used for different tests
            fs.writeFileSync('cpen-url-checkout.json', JSON.stringify(submittalURL));
        });
        });
    certCPENFixtures('Add blank voucher', async ({
    cpenCheckout,
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
    await cpenCheckout.setTestAnnotations(certCPENFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCPENFixtures.step('Navigate to saved Checkout URL', async () => {
            const url = JSON.parse(fs.readFileSync('cpen-url-checkout.json', 'utf-8'));
            await page.goto(url);
        });
        await certCPENFixtures.step('Click button to submit blank voucher, expect error', async () => {
            await cpenCheckout.clickAddVoucher();
            await expect(cpenCheckout.voucherErrorPopup).toBeVisible();
        });
        await certCPENFixtures.step('Close voucher error', async () => {
            await cpenCheckout.clickCloseVoucherError();
            await expect(cpenCheckout.addVoucherButton).toBeVisible();
        });
        });

    certCPENFixtures('Payment type visibility - credit', async ({
        cpenCheckout,
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
            await cpenCheckout.setTestAnnotations(certCPENFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCPENFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cpen-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCPENFixtures.step('Select Credit Card under Payment Options', async () => {
                await cpenCheckout.selectPaymentOption('CREDIT CARD');
                await expect(cpenCheckout.creditCardOptions).toBeVisible();
            });
            await certCPENFixtures.step('Select Credit Card type, expect Submit button to be visible', async () => {
                await cpenCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
                await expect(cpenCheckout.submitButton).toBeVisible();
            });
        });

    certCPENFixtures('Payment type visibility - echeck/ach', async ({
        cpenCheckout,
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
            await cpenCheckout.setTestAnnotations(certCPENFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCPENFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cpen-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCPENFixtures.step('Select echeck, expect Submit button to be visible', async () => {
                await cpenCheckout.selectPaymentOption('ACHRT');
                await expect(cpenCheckout.submitButton).toBeVisible();
            });
        });

    certCPENFixtures('Payment type visibility - check', async ({
        cpenCheckout,
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
            await cpenCheckout.setTestAnnotations(certCPENFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCPENFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cpen-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCPENFixtures.step('Select Check, expect separate Submit Check button to be visible', async () => {
                await cpenCheckout.selectPaymentOption('PAY_BY_CHECK');
                await cpenCheckout.paymentOptions.click();
                await expect(cpenCheckout.submitCheckButton).toBeVisible();
            });
        });
  });
  certCPENFixtures.describe('Payment tests', () => {
    certCPENFixtures.beforeEach('Get to payment', async ({
        cpenExamInfo,
        cpenTestAssurance,
        cpenCredVerification,
        cpenStatus,
        cpenCheckout,
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
        await cpenCheckout.setTestAnnotations(certCPENFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCPENFixtures.step('Fill out Exam Information', async () => {
            await cpenExamInfo.fillOutExamInfo_CPEN(examInfoArgs);
            await cpenExamInfo.clickNext(page);
        });
        await certCPENFixtures.step('Continue past Test Assurance', async () => {
            await cpenTestAssurance.selectTestAssurance(testAssuranceArg);
            await cpenTestAssurance.clickNext(page);
        });
        await certCPENFixtures.step('Continue past Credential Verification', async () => {
            await cpenCredVerification.clickNext(page);
        });
        await certCPENFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cpenStatus.clickCheckoutButton();
            await expect(cpenCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
        });
        await certCPENFixtures.step('Choose payment type, credit card type', async () => {
            await cpenCheckout.selectPaymentOption('CREDIT CARD');
            await expect(cpenCheckout.creditCardOptions).toBeVisible();
            await cpenCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(cpenCheckout.submitButton).toBeVisible();
            await cpenCheckout.clickSubmitCheckout();
        });
    });
      certCPENFixtures('Submit blank payment details', async ({
          cpenPayment
          }) => {
        await certCPENFixtures.step('Set all values to blank', async () => {
            await cpenPayment.fillOutAndSubmitPayment({
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

        await certCPENFixtures.step('Expect error messages to be visible', async () => {
            await expect(cpenPayment.nameError).toBeVisible();
            await expect(cpenPayment.cardNumError).toBeVisible();
            await expect(cpenPayment.cvvError).toBeVisible();
            await expect(cpenPayment.monthError).toBeVisible();
            await expect(cpenPayment.yearError).toBeVisible();
            await expect(cpenPayment.addressError).toBeVisible();
            await expect(cpenPayment.zipCodeError).toBeVisible();
            await expect(cpenPayment.countryError).toBeVisible();
            await expect(cpenPayment.countryError).toBeVisible();
            });
        });
  
        certCPENFixtures('Click cancel on payment screen, expect to return to checkout', async ({
        cpenPayment,
        page
        }) => {
            await certCPENFixtures.step('Click cancel button, expect to go back to checkout', async () => {
                await cpenPayment.cancelButton.click();
                await page.waitForLoadState('networkidle');
                await expect(cpenPayment.workflowTitle).toContainText('Checkout and Make Payment');
            });
    });
    certCPENFixtures('Successful case', async ({
        cpenPayment,
        page,
        homePage,
        backOffice
        }) => {
            await certCPENFixtures.step('Submit details', async () => {

                await cpenPayment.fillOutAndSubmitPayment({
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
            await certCPENFixtures.step('Go to homepage, check SSA Message reads \'SCHEDULE\/MANAGE EXAM\'', async () => {
                await homePage.visit();
                await expect(homePage.buttonCPEN).toContainText(/SCHEuuDULE\/MANAGE EXAM/i);
            });
        });
  });
});