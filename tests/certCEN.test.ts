import { certCENFixtures, expect } from "../fixtures/certCEN.fixtures";
import fs from 'fs';
import path from "path";
import {TestAnnotations} from '../annotations';

let lastStepTitle = '';

certCENFixtures.describe('CEN Suite', () => {
  certCENFixtures.beforeEach('Wipe previous submittals and clear checkout', async ({
    homePage
    }) => {
        await certCENFixtures.step('Check cart for items. If any, clear them.', async () => {
            await homePage.clearCheckoutAtStart();
            await homePage.visit();
          });
        await certCENFixtures.step('Check for open submittal. If exists, delete it.', async () => {
            await homePage.removeSubmittal('CEN');
            await homePage.visitCEN();
        });
    });
certCENFixtures.describe('SSA messages', () => { 
    certCENFixtures.beforeEach('Start application, fill out exam info', async ({
        cenExamInfo,
        cenTestAssurance,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);
           
            await certCENFixtures.step('Fill out page one, Exam Information', async () => {
                await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
            });
            await certCENFixtures.step('Click next, move ahead to Test Assurance', async () => {
                await cenExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cenTestAssurance.checkWorkflowTitle('Test Assurance');
            });
        });

    certCENFixtures.only('Confirm SSA Message of in progress', async ({
        homePage
        }) => { 
        await certCENFixtures.step('Go to homepage, and check the SSA Message. Should be \'In Progress.\'', async () => {
            lastStepTitle = 'Go to homepage, and check the SSA Message. Should be \'In Progress.\'';
            await homePage.visit();
            await expect(homePage.buttonCEN).toContainText(/In Process/i);
        });
        });

    certCENFixtures('Continue application and confirm SSA Message of checkout', async ({
        cenTestAssurance,
        cenCredVerification,
        cenStatus,
        cenCheckout,
        homePage,
        page
        }) => {
            console.log(lastStepTitle); 
        await certCENFixtures.step('Click no test assurance, move to Credential Verification page', async () => {
            await cenTestAssurance.selectTestAssurance(false);
            await cenTestAssurance.clickNext(page);
        });

        await certCENFixtures.step('Move to Status page', async () => {
            await cenCredVerification.clickNext(page);
        });
        await certCENFixtures.step('Move to Checkout page', async () => {
            await cenStatus.clickCheckoutButton();
            await page.waitForLoadState('networkidle');
            await cenCheckout.checkWorkflowTitle('Checkout and Make Payment');
        });
        await certCENFixtures.step('Go to homepage, and check the SSA Message. Should be \'Checkout.\'', async () => {
            lastStepTitle = 'Go to homepage, and check the SSA Message. Should be \'Checkout.\'';
            await homePage.visit();
            await expect(homePage.buttonCEN).toContainText(/Checkout/i);
            });
        });
});


certCENFixtures.describe('Military documentation review', () => {
    certCENFixtures.beforeEach('Start application with military discount', async ({
        cenExamInfo,
        cenMilitaryDoc,
        page
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: true,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
        await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

        await certCENFixtures.step('Fill out exam information, selecting yes for military discount', async () => {
            await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
            await cenExamInfo.clickNext(page);
            await page.waitForLoadState('networkidle');
            await cenMilitaryDoc.checkWorkflowTitle('Upload Military Documentation');
        });
        });
    certCENFixtures('Begin application and confirm SSA Message of military documentation review', async ({
        cenExamInfo,
        cenMilitaryDoc,
        homePage,
        page
        }) => {

        await certCENFixtures.step('Upload test document for review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cenMilitaryDoc.uploadMilDoc(filePath);
        });
        await certCENFixtures.step('Navigate to end of Military Documentation Review flow', async () => {
            await cenMilitaryDoc.clickNext(page);
            await cenMilitaryDoc.clickAdvanceToMilitary();
            await cenMilitaryDoc.checkWorkflowTitle('Military Discount Instructions');
        });
        
        await certCENFixtures.step('Go to homepage, and check the SSA Message. Should be \'Military Documentation Review.\'', async () => {
        });
            await homePage.visit();
            await expect(homePage.buttonCEN).toContainText(/Military Documentation Review/i);
        });

    certCENFixtures('Can remove uploaded files from military docs', async ({
        cenMilitaryDoc,
        homePage,
        page
        }) => {
        await certCENFixtures.step('Upload test files to both inputs', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
            await cenMilitaryDoc.uploadMilDoc(filePath);
            await cenMilitaryDoc.uploadMilDoc2(filePath);
        });

        await certCENFixtures.step('Delete both uploaded files and confirm delete', async () => {
            await cenMilitaryDoc.deleteMilUpload1();
            await cenMilitaryDoc.deleteMilUpload2();
            await expect(cenMilitaryDoc.file1NoFile).toContainText(/No file chosen/);
            await expect(cenMilitaryDoc.file2NoFile).toContainText(/No file chosen/);
        });
        });
});


certCENFixtures.describe('Exam accommodationmodation review', () => {
    certCENFixtures.beforeEach('Start application with exam accommodationmodation', async ({
        cenExamInfo,
        cenExamAccommodations,
        page
        }) => {

            const examInfoArgs = {
                accommodationRequest: true,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
         await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

            await certCENFixtures.step('Fill out exam information, requesting accommodationmodations on the exam', async () => {
                await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
                await cenExamInfo.clickNext(page);
                await page.waitForLoadState('networkidle');
                await cenExamAccommodations.checkWorkflowTitle('Exam Accommodation Request');
            });
        });
    certCENFixtures('Can remove uploaded files from exam accommodationmodation', async ({
        cenExamAccommodations,
        homePage,
        page
        }) => {
        await certCENFixtures.step('Upload test documentation for exam accommodationmodation review', async () => {
            const path = require('path');
            const filePath = path.resolve(__dirname, '../600.jpg');
    
            await cenExamAccommodations.uploadExamAccomDoc(filePath);
            await page.waitForLoadState('load');
        });
        await certCENFixtures.step('Delete test document. Confirm deletion', async () => {
            await cenExamAccommodations.deleteFile1.click();
            await expect(cenExamAccommodations.errorMessageNoFile).toContainText(/No file chosen/);
        });
        });
        
    certCENFixtures('Yes exam accommodationodation, add step to left bar', async ({
        cenExamAccommodations
        }) => {

        await certCENFixtures.step('Confirm that \'Exam Accommodation\' is added to flow graphics in both desktop and mobile views', async () => {
            if (await cenExamAccommodations.mobileDropdown.isVisible()) {
                // Mobile View: Check if the dropdown contains "Exam Accommodation"
                const options = await cenExamAccommodations.mobileDropdown.locator('option').allTextContents();
                expect(options).toContain('Exam Accommodation Request');
                console.log("Mobile view: Verified 'Exam Accommodation' exists in dropdown.");
            } else {
                // Desktop View: Check if the left bar step is visible
                await expect(cenExamAccommodations.examAccommodationsLeftBar).toBeVisible();
                console.log("Desktop view: Verified 'Exam Accommodation' is in left bar.");
            }
        });
    });
});

certCENFixtures('Expect next button hidden', async ({
    cenExamInfo,
    page
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: false,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

    await certCENFixtures.step('When form is not filled, check that bottom text says \'Please complete all required fields,\' and that Next button is hidden.', async () => {
        await expect(cenExamInfo.pagination).toContainText('Please complete all required fields');
        await expect(cenExamInfo.nextButton).toBeHidden();
    });
    await certCENFixtures.step('Check that next button appears and disappears when form elements are checked and unchecked', async () => {
        await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
        await cenExamInfo.checkBoxesOneByOne();
    });
});

certCENFixtures('Test assurance error message', async ({
    cenExamInfo,
    cenTestAssurance
    }) => {

    const examInfoArgs = {
        accommodationRequest: false,
        militaryStatusRequest: true,
        licenseNumber: '1234',
        state: 'IL',
        membership: 'No'
    }
    await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

    await certCENFixtures.step('Navigate to Test Assurance step', async () => {
        await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
        await cenExamInfo.clickNext(page);
    });
    await certCENFixtures.step('Attempt to click next, successfully triggering error message', async () => {
        await cenTestAssurance.clickNext(page);
        await expect(cenTestAssurance.assuranceError).toHaveText('"Would you like to purchase test assurance?" is required.');
    });
});

certCENFixtures('Error messages on exam information', async ({
    cenExamInfo,
    page
    }) => {

        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: '',
            state: 'Select One',
            membership: 'Select One'
        }
        await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

        await certCENFixtures.step('Check that all error messages are triggered on Exam Information page', async () => {
            //Must interact with Exam Info elements before errors show. Thus, fillOutExamInfo as shown, and then delete those values in checkErrorMessages
            await cenExamInfo.fillOutExamInfo_CEN({
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            });
            await cenExamInfo.checkErrorMessages();
        });
    });

certCENFixtures('Toggle membership - memberNumber input opens and closes', async ({
    cenExamInfo
    }) => {
        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: null,
            state: null,
            membership: 'Toggle between membership statuses'
        }
        await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

        await certCENFixtures.step('Select not a member, expect member number input to be hidden. Select member, expect member number input to be visible', async () => {
            await cenExamInfo.toggleMembership();
            await cenExamInfo.toggleMembership();
        });
});

certCENFixtures('Side graphic matches header, has orange color', async ({
    cenExamInfo,
    cenTestAssurance,
    cenCredVerification,
    cenStatus,
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
        await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs, testAssuranceArgs);

        await certCENFixtures.step('Check graphic on Exam Information page', async () => {
            await cenExamInfo.checkHeaderMatchesSidebar();
            await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
            await cenExamInfo.clickNext(page);
        });
        await certCENFixtures.step('Check graphic on Test Assurance page', async () => {
            await cenTestAssurance.checkHeaderMatchesSidebar();
            await cenTestAssurance.selectTestAssurance(testAssuranceArgs);
            await cenTestAssurance.clickNext(page);
        });
        await certCENFixtures.step('Check graphic on Credential Verification page', async () => {
            await cenCredVerification.checkHeaderMatchesSidebar();
            await cenCredVerification.clickNext(page);
        });
        await certCENFixtures.step('Check graphic on Status page', async () => {
            await cenStatus.checkHeaderMatchesSidebar();
        });
    });

  certCENFixtures.describe('Price checks for non-members of other societies', () => {
    certCENFixtures.beforeEach('Fill out exam info for non-member', async ({
        cenExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

        await certCENFixtures.step('Fill out Exam Information.', async () => {
            await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
            await cenExamInfo.clickNext(page);
        });
        });

        certCENFixtures('Not member, yes assurance', async ({
            cenTestAssurance,
            cenCredVerification,
            cenStatus,
            cenCheckout,
            page
            }) => {
                //THERE SHOULD BE A WAY TO SET THE TEST ASSURANCE ARG HERE, BUT KEEP THE EXAM INFO ARGS IN PLACE IN THE ANNOTATIONS
            await certCENFixtures.step('Select Yes for Test Assurance', async () => {
                await cenTestAssurance.selectTestAssurance(true);
                await cenTestAssurance.clickNext(page);
            });
            await certCENFixtures.step('Move through Credential Verification', async () => {
                await cenCredVerification.clickNext(page);
            });
            await certCENFixtures.step('Move through Status page', async () => {
                await cenStatus.clickCheckoutButton();
                await page.waitForLoadState('load');
                await cenCheckout.checkWorkflowTitle('Checkout and Make Payment');
            });
            await certCENFixtures.step('Check displayed price', async () => {
                await expect(cenCheckout.checkoutTable).toContainText(cenCheckout.prices.priceYesMembershipYesTestAssurance)
                await expect.soft(cenCheckout.checkoutTable).toContainText('includes Test Assurance');
            });
        });
        certCENFixtures('Not member, no assurance', async ({
            cenTestAssurance,
            cenCredVerification,
            cenStatus,
            cenCheckout,
            page
            }) => {
                //SAME THING HERE AS WITH PREVIOUS TEST - ADD testAssuranceArgs to annotations here.
                await certCENFixtures.step('Select No for Test Assurance', async () => {
                    await cenTestAssurance.selectTestAssurance(false);
                    await cenTestAssurance.clickNext(page);
                });
                await certCENFixtures.step('Move through Credential Verification', async () => {
                    await cenCredVerification.clickNext(page);
                });
                await certCENFixtures.step('Move through Status page', async () => {
                    await cenStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cenCheckout.checkWorkflowTitle('Checkout and Make Payment');
                });
                await certCENFixtures.step('Check displayed price', async () => {
                    await expect(cenCheckout.checkoutTable).toContainText(cenCheckout.prices.priceNoMembershipNoTestAssurance);
                    await expect.soft(cenCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
            });
        certCENFixtures.afterEach('Clear checkout', async ({
            cenCheckout,
            }) => {
            await certCENFixtures.step('Clear checkout', async () => {
                await cenCheckout.clearCheckout();
                await expect(cenCheckout.checkoutTable).toBeHidden();
            });
        });
  });

  certCENFixtures.describe('Price checks for members of other societies', () => {
    certCENFixtures.beforeEach('Fill out exam info for other society member', async ({
        cenExamInfo
        }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'Yes',
                memberNumber: '1234'
            }
            await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs);

            await certCENFixtures.step('Fill in exam info', async () => {
                await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
        
                await cenExamInfo.clickNext(page);
            });
        });

        certCENFixtures('Yes member, yes assurance', async ({
            cenTestAssurance,
            cenCredVerification,
            cenStatus,
            cenCheckout,
            page
            }) => {
                //SAME THING HERE AS PREVIOUS TWO
                await certCENFixtures.step('Select Yes for Test Assurance', async () => {
                    await cenTestAssurance.selectTestAssurance(true);
                    await cenTestAssurance.clickNext(page);
                });
                await certCENFixtures.step('Move through Credential Verification', async () => {
                    await cenCredVerification.clickNext(page);
                });
                await certCENFixtures.step('Move through Status page', async () => {
                    await cenStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cenCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCENFixtures.step('Check displayed price', async () => {
                    await expect(cenCheckout.checkoutTable).toContainText(cenCheckout.prices.priceYesMembershipYesTestAssurance)
                    await expect.soft(cenCheckout.checkoutTable).toContainText('includes Test Assurance');
                });
                await certCENFixtures.step('Clear checkout', async () => {
                    await cenCheckout.clearCheckout();
                    await expect(cenCheckout.checkoutTable).toBeHidden();
                });
            });
        certCENFixtures('Yes member, no assurance', async ({
            cenTestAssurance,
            cenCredVerification,
            cenStatus,
            cenCheckout,
            page
            }) => {
                //AND HERE
                await certCENFixtures.step('Select No for Test Assurance', async () => {
                    await cenTestAssurance.selectTestAssurance(false);
                    await cenTestAssurance.clickNext(page);
                });
                await certCENFixtures.step('Move through Credential Verification', async () => {
                    await cenCredVerification.clickNext(page);
                });
                await certCENFixtures.step('Move through Status page', async () => {
                    await cenStatus.clickCheckoutButton();
                    await page.waitForLoadState('load');
                    await cenCheckout.checkoutTable.waitFor({ state: 'visible' });
                });
                await certCENFixtures.step('Check displayed price', async () => {
                    await expect(cenCheckout.checkoutTable).toContainText(cenCheckout.prices.priceYesMembershipNoTestAssurance_CEN);
                });
                await certCENFixtures.step('Clear checkout', async () => {
                    await cenCheckout.clearCheckout();
                    await expect(cenCheckout.checkoutTable).toBeHidden();
                });
            });
  });


certCENFixtures.describe('Checkout tests', () => {
    //On this group, the annotations are set on every test due to the absence of a beforeEach hook.
    certCENFixtures('SETUP TEST: grab checkout url, save to json', async ({
    cenExamInfo,
    cenTestAssurance,
    cenCredVerification,
    cenStatus,
    cenCheckout,
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
        await cenExamInfo.setTestAnnotations(certCENFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCENFixtures.step('Fill out Exam Information', async () => {
            await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
            await cenExamInfo.clickNext(page);
        });
        await certCENFixtures.step('Continue past Test Assurance', async () => {
            await cenTestAssurance.selectTestAssurance(testAssuranceArg);
            await cenTestAssurance.clickNext(page);
        });
        await certCENFixtures.step('Continue past Credential Verification', async () => {
            await cenCredVerification.clickNext(page);
        });
        await certCENFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cenStatus.clickCheckoutButton();
            await expect(cenCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
            //grab the unique url for this submittal
            const submittalURL = page.url();
            //pass this url to a json file so it can be used for different tests
            fs.writeFileSync('cen-url-checkout.json', JSON.stringify(submittalURL));
        });
        });
    certCENFixtures('Add blank voucher', async ({
    cenCheckout,
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
    await cenCheckout.setTestAnnotations(certCENFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCENFixtures.step('Navigate to saved Checkout URL', async () => {
            const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
            await page.goto(url);
        });
        await certCENFixtures.step('Click button to submit blank voucher, expect error', async () => {
            await cenCheckout.clickAddVoucher();
            await expect(cenCheckout.voucherErrorPopup).toBeVisible();
        });
        await certCENFixtures.step('Close voucher error', async () => {
            await cenCheckout.clickCloseVoucherError();
            await expect(cenCheckout.addVoucherButton).toBeVisible();
        });
        });

    certCENFixtures('Payment type visibility - credit', async ({
        cenCheckout,
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
            await cenCheckout.setTestAnnotations(certCENFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCENFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCENFixtures.step('Select Credit Card under Payment Options', async () => {
                await cenCheckout.selectPaymentOption('CREDIT CARD');
                await expect(cenCheckout.creditCardOptions).toBeVisible();
            });
            await certCENFixtures.step('Select Credit Card type, expect Submit button to be visible', async () => {
                await cenCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
                await expect(cenCheckout.submitButton).toBeVisible();
            });
        });

    certCENFixtures('Payment type visibility - echeck/ach', async ({
        cenCheckout,
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
            await cenCheckout.setTestAnnotations(certCENFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCENFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCENFixtures.step('Select echeck, expect Submit button to be visible', async () => {
                await cenCheckout.selectPaymentOption('ACHRT');
                await expect(cenCheckout.submitButton).toBeVisible();
            });
        });

    certCENFixtures('Payment type visibility - check', async ({
        cenCheckout,
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
            await cenCheckout.setTestAnnotations(certCENFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCENFixtures.step('Navigate to saved Checkout URL', async () => {
                const url = JSON.parse(fs.readFileSync('cen-url-checkout.json', 'utf-8'));
                await page.goto(url);
            });
            await certCENFixtures.step('Select Check, expect separate Submit Check button to be visible', async () => {
                await cenCheckout.selectPaymentOption('PAY_BY_CHECK');
                await cenCheckout.paymentOptions.click();
                await expect(cenCheckout.submitCheckButton).toBeVisible();
            });
        });
  });
  certCENFixtures.describe('Payment tests', () => {
    certCENFixtures.beforeEach('Get to payment', async ({
        cenExamInfo,
        cenTestAssurance,
        cenCredVerification,
        cenStatus,
        cenCheckout,
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
        await cenCheckout.setTestAnnotations(certCENFixtures.info(), examInfoArgs, testAssuranceArg);

        await certCENFixtures.step('Fill out Exam Information', async () => {
            await cenExamInfo.fillOutExamInfo_CEN(examInfoArgs);
            await cenExamInfo.clickNext(page);
        });
        await certCENFixtures.step('Continue past Test Assurance', async () => {
            await cenTestAssurance.selectTestAssurance(testAssuranceArg);
            await cenTestAssurance.clickNext(page);
        });
        await certCENFixtures.step('Continue past Credential Verification', async () => {
            await cenCredVerification.clickNext(page);
        });
        await certCENFixtures.step('Continue past Status and save Checkout URL', async () => {
            await cenStatus.clickCheckoutButton();
            await expect(cenCheckout.workflowTitle).toHaveText('Checkout and Make Payment');
        });
        await certCENFixtures.step('Choose payment type, credit card type', async () => {
            await cenCheckout.selectPaymentOption('CREDIT CARD');
            await expect(cenCheckout.creditCardOptions).toBeVisible();
            await cenCheckout.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
            await expect(cenCheckout.submitButton).toBeVisible();
            await cenCheckout.clickSubmitCheckout();
        });
    });
      certCENFixtures('Submit blank payment details', async ({
          cenPayment
          }) => {
        await certCENFixtures.step('Set all values to blank', async () => {
            await cenPayment.fillOutAndSubmitPayment({
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

        await certCENFixtures.step('Expect error messages to be visible', async () => {
            await expect(cenPayment.nameError).toBeVisible();
            await expect(cenPayment.cardNumError).toBeVisible();
            await expect(cenPayment.cvvError).toBeVisible();
            await expect(cenPayment.monthError).toBeVisible();
            await expect(cenPayment.yearError).toBeVisible();
            await expect(cenPayment.addressError).toBeVisible();
            await expect(cenPayment.zipCodeError).toBeVisible();
            await expect(cenPayment.countryError).toBeVisible();
            await expect(cenPayment.countryError).toBeVisible();
            });
        });
  
        certCENFixtures('Click cancel on payment screen, expect to return to checkout', async ({
        cenPayment,
        page
        }) => {
            await certCENFixtures.step('Click cancel button, expect to go back to checkout', async () => {
                await cenPayment.cancelButton.click();
                await page.waitForLoadState('networkidle');
                await expect(cenPayment.workflowTitle).toContainText('Checkout and Make Payment');
            });
    });
    certCENFixtures('Successful case', async ({
        cenPayment,
        page,
        homePage,
        backOffice
        }) => {
            await certCENFixtures.step('Submit details', async () => {

                await cenPayment.fillOutAndSubmitPayment({
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
            await certCENFixtures.step('Go to homepage, check SSA Message reads \'SCHEDULE\/MANAGE EXAM\'', async () => {
                await homePage.visit();
                await expect(homePage.buttonCEN).toContainText(/SCHEuuDULE\/MANAGE EXAM/i);
            });
        });
  });
});