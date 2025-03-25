import { certCBRNFixtures, expect } from "../fixtures/certCBRN.fixtures";
import fs from "fs";
import { BackOffice } from "../pages/backOffice.page";
import { chromium } from "@playwright/test";

certCBRNFixtures.beforeEach("wipe submittals", async ({ homePage }) => {
    await certCBRNFixtures.step('Check cart for items. If any, clear them.', async () => {
        await homePage.clearCheckoutAtStart();
        await homePage.visit();
      });
    await certCBRNFixtures.step('Check for open submittal. If exists, delete it.', async () => {
        await homePage.removeSubmittal('CBRN');
        await homePage.visitCBRN();
    });
});
certCBRNFixtures.describe("military email and status", () => {
    certCBRNFixtures.beforeEach("get to Mil Doc Review status",
        async ({ cbrnExamInfo, cbrnMilitaryDoc, homePage }) => {
            const examInfoArgs = {
                accommodationRequest: false,
                militaryStatusRequest: true,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs);

            await certCBRNFixtures.step(
                "Fill out exam info page, requesting military discount.",
                async () => {
                    await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
                    await cbrnExamInfo.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Upload test document for review",
                async () => {
                    const path = require("path");
                    const filePath = path.resolve(__dirname, "../600.jpg");
                    await cbrnMilitaryDoc.uploadMilDoc(filePath);
                }
            );
            await certCBRNFixtures.step(
                "Navigate to end of Military Documentation Review flow",
                async () => {
                    await cbrnMilitaryDoc.clickNext(page);
                    await cbrnMilitaryDoc.clickAdvanceToMilitary();
                    await cbrnMilitaryDoc.checkWorkflowTitle(
                        "Military Discount Instructions"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to homepage, and check the SSA Message. Should be 'Military Documentation Review.'",
                async () => {}
            );
            await homePage.visit();
            await expect(homePage.buttonCBRN).toContainText(
                /Military Documentation Review/i
            );
        }
    );

    certCBRNFixtures("military app status and email", async ({ backOffice }) => {
        await certCBRNFixtures.step(
            "Check app status = MILITARY_REVIEW. Check that emails are sent",
            async () => {
                const formattedDateTime = await backOffice.getCurrentDate();
                //for status - get the submittal number from the url, use that
                const {
                    submittalNum,
                    workflowNum,
                } = await backOffice.getSubmitAndWorkNums("CBRN");
                await backOffice.checkAppStatus(
                    "MILITARY_REVIEW",
                    "CBRN",
                    submittalNum
                );
                await backOffice.checkEmailsVariable(
                    formattedDateTime,
                    "Your application is under review for a Military Discount"
                );
            }
        );
    });

    certCBRNFixtures("approve mil app, email sent, status updated",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step(
                "Approve military discount request",
                async () => {
                    await backOffice.reviewMil("Approve", "CBRN");
                }
            );
            await certCBRNFixtures.step(
                "Check application status is PENDING",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "PENDING",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step("Check correct emails sent", async () => {
                await backOffice.checkEmailsVariable(
                    formattedDateTime,
                    "Your Military Discount has been approved!",
                    "Your application is under review for a Military Discount"
                );
            });
            await certCBRNFixtures.step(
                "Check SSA message is back to In Process",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(/In Process/i);
                }
            );

            //should try another test with this user - make sure that a new app doesn't go to the review stage when you select military discount
        }
    );
    certCBRNFixtures("deny mil app, email sent, status updated",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step(
                "Approve military discount request",
                async () => {
                    await backOffice.reviewMil("Deny", "CBRN");
                }
            );
            await certCBRNFixtures.step(
                "Check application status is PENDING",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "PENDING",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step("Check correct emails sent", async () => {
                await backOffice.checkEmailsVariable(
                    formattedDateTime,
                    "Your Military Discount was not approved",
                    "Your application is under review for a Military Discount"
                );
            });
            await certCBRNFixtures.step(
                "Check SSA message is back to In Process",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(/In Process/i);
                }
            );
            certCBRNFixtures(
                "more info for mil app, email",
                async ({ homePage, backOffice }) => {
                    const formattedDateTime = await backOffice.getCurrentDate();

                    await certCBRNFixtures.step(
                        "Review application for military discount - Need More Information.",
                        async () => {
                            await backOffice.reviewMil(
                                "Need More Information",
                                "CBRN"
                            );
                        }
                    );
                    await certCBRNFixtures.step(
                        "Get submittal number and use to check application status.",
                        async () => {
                            const {
                                submittalNum,
                                workflowNum,
                            } = await backOffice.getSubmitAndWorkNums("CBRN");
                            await backOffice.checkAppStatus(
                                "MILITARY_NMI",
                                "CBRN",
                                submittalNum
                            );
                        }
                    );
                    await certCBRNFixtures.step(
                        "Check that email notifications have been sent.",
                        async () => {
                            await backOffice.checkEmailsVariable(
                                formattedDateTime,
                                "More information is needed with your Military Documentation",
                                "Your application is under review for a Military Discount"
                            );
                        }
                    );
                    await certCBRNFixtures.step(
                        "Go to home page and check SSA message for Need More Information for Military Documentation",
                        async () => {
                            await homePage.visit();
                            await expect(homePage.buttonCBRN).toContainText(
                                /Need More Information for Military Documentation/i
                            );
                        }
                    );
                }
            );

            certCBRNFixtures.afterEach(
                "restore non-military status",
                async ({ page, backOffice }) => {
                    await certCBRNFixtures.step(
                        "Go to account in back office",
                        async () => {
                            await backOffice.visitJohnetteAccount();
                        }
                    );
                    await certCBRNFixtures.step(
                        "Go to Customer Attributes",
                        async () => {
                            await page
                                .getByRole("link", { name: "Customer Attributes" })
                                .click();
                        }
                    );
                    await certCBRNFixtures.step(
                        "Click update, select No military status",
                        async () => {
                            await page
                                .getByRole("link", {
                                    name: "Update Customer Attributes",
                                })
                                .first()
                                .click();
                            await page.getByLabel("No", { exact: true }).check();
                            await page
                                .getByRole("button", { name: "Update" })
                                .nth(1)
                                .click();
                        }
                    );
                }
            );
        }
    );
});
certCBRNFixtures.describe("international RN, email and status", () => {
    certCBRNFixtures.beforeEach("get to international RN audit status",
        async ({ cbrnExamInfo, cbrnInternationalAudit, page, homePage }) => {
            await certCBRNFixtures.step(
                "Fill out exam info for an international applicant",
                async () => {
                    await cbrnExamInfo.fillOutExamInfo_CBRN({
                        accommodationRequest: true,
                        militaryStatusRequest: false,
                        licenseNumber: "1234",
                        state: "International",
                        country: "Russia",
                        membership: "No",
                    });
                    await cbrnExamInfo.clickNext(page);
                }
            );
            await certCBRNFixtures.step("Verify that international RN audit has been triggered",
                async () => {
                    await expect(cbrnExamInfo.intlRNMessage).toContainText(
                        "If you are practicing internationally but hold a current, unrestricted RN license in the US or its territories, please do not select INTERNATIONAL. Instead, select the State where your RN license has been issued."
                    );
                    await cbrnExamInfo.clickNext(page);
                    await page.waitForLoadState("networkidle");
                    await expect(
                        cbrnInternationalAudit.workflowTitle
                    ).toHaveText(
                        "International Nursing Licensure Evaluation Instructions"
                    );
                    await cbrnInternationalAudit.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Upload International RN documentation, complete flow",
                async () => {
                    const path = require("path");
                    const filePath = path.resolve(__dirname, "../600.jpg");

                    await cbrnInternationalAudit.uploadRNAuditDoc(filePath);
                    await page.waitForLoadState("load");

                    await cbrnInternationalAudit.clickNext(page);
                    await cbrnInternationalAudit.submitIntlReview.click();
                    await expect(
                        cbrnInternationalAudit.workflowTitle
                    ).toHaveText(
                        "International Credential Review Instructions"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to homepage, verify SSA message is International RN License Review",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /International RN License Review/i
                    );
                }
            );
        }
    );
    certCBRNFixtures("intl rn app status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step(
                "Get submittal number, check application status is INTL_RN_REVIEW.",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "INTL_RN_REVIEW",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that email notifications have been sent.",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "International RN Audit Under Review",
                        "Your application was selected for International RN Audit"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads International RN License Review.",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /International RN License Review/i
                    );
                }
            );
        }
    );

    certCBRNFixtures("approve intl rn, get app status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();
            await certCBRNFixtures.step("Approve RN audit.", async () => {
                await backOffice.reviewIntlRN("Approved", "CBRN");
            });
            await certCBRNFixtures.step(
                "Get submittal number and check application status for PENDING.",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "PENDING",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that notification emails have been sent.",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "International RN Audit Under Review",
                        "Your application was selected for International RN Audit",
                        "International RN Audit - Approved"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads In Process",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /In Process/i
                    );
                }
            );
        }
    );
    certCBRNFixtures("deny intl rn, get app status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step("Deny Intl RN", async () => {
                await backOffice.reviewIntlRN("Rejected", "CBRN");
            });
            await certCBRNFixtures.step(
                "Get submittal number and check application status is INTL_RN_REJECTED",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "INTL_RN_REJECTED",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate emails have been sent",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "International RN Audit Under Review",
                        "Your application was selected for International RN Audit",
                        "International RN Audit - Not Approved"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Got to home page and check SSA message reads Apply for Certification",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /Apply for Certification/i
                    );
                }
            );
        }
    );
    certCBRNFixtures("intl rn, need more information get app status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step("Deny Intl RN", async () => {
                await backOffice.reviewIntlRN("Need More Information", "CBRN");
            });
            await certCBRNFixtures.step(
                "Get submittal number and check application status is INTL_RN_REJECTED",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "INTL_RN_NMI",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate emails have been sent",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "International RN Audit Under Review",
                        "Your application was selected for International RN Audit",
                        "International RN Audit - Need More Information"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Got to home page and check SSA message reads Apply for Certification",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /International RN License - Need More Information/i
                    );
                }
            );
        }
    );
});

certCBRNFixtures.describe("exam accommodation tests, email and status", () => {
    certCBRNFixtures.beforeEach("request exam accommodation, go to payment",
        async ({
            cbrnExamInfo,
            page,
            cbrnExamAccommodations,
            cbrnTestAssurance,
            cbrnCredVerification,
            cbrnStatus,
            cbrnCheckout,
        }) => {
            const examInfoArgs = {
                accommodationRequest: true,
                militaryStatusRequest: false,
                licenseNumber: '1234',
                state: 'IL',
                membership: 'No'
            }
            const testAssuranceArg = false
            await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);

            await certCBRNFixtures.step(
                "Fill out exam info, requesting exam accommodations.",
                async () => {
                    await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
                    await cbrnExamInfo.clickNext(page);
                }
            );

            await certCBRNFixtures.step(
                "Upload test documentation for exam accommodation review",
                async () => {
                    const path = require("path");
                    const filePath = path.resolve(__dirname, "../600.jpg");

                    await cbrnExamAccommodations.uploadExamAccomDoc(filePath);
                    await page.waitForLoadState("load");
                }
            );

            await certCBRNFixtures.step(
                "Continue past Test Assurance",
                async () => {
                    await cbrnTestAssurance.selectTestAssurance(testAssuranceArg);
                    await cbrnTestAssurance.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Continue past Credential Verification",
                async () => {
                    await cbrnCredVerification.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Continue past Status and save Checkout URL",
                async () => {
                    await cbrnStatus.clickCheckoutButton();
                    await page.waitForLoadState('networkidle');
                    await expect(cbrnCheckout.workflowTitle).toHaveText(
                        "Checkout and Make Payment"
                    );
                }
            );

            await certCBRNFixtures.step(
                "Choose payment type, credit card type",
                async () => {
                    await cbrnCheckout.selectPaymentOption(
                        "CREDIT CARD"
                    );
                    await expect(
                        cbrnCheckout.creditCardOptions
                    ).toBeVisible();
                    await cbrnCheckout.selectCreditCard("0K"); //'OK' is AE, 'OJ' is Visa/Discover/MC
                    await expect(
                        cbrnCheckout.submitButton
                    ).toBeVisible();
                    await cbrnCheckout.clickSubmitCheckout();
                }
            );
        }
    );

    certCBRNFixtures("check status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();
            await certCBRNFixtures.step(
                "Get submittal number, check application status is ACCOMMODATION_REVIEW",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "ACCOMMODATION_REVIEW",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate emails have been sent out",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "Consolidated Receipt",
                        "BCEN is reviewing your Exam Accommodation"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads Accommodation Review",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /Accommodation Review/i
                    );
                }
            );
        }
    );
    certCBRNFixtures("approve accom, check status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step(
                "Approve exam accommodations",
                async () => {
                    await backOffice.reviewAccom("Approve", "CBRN");
                }
            );
            await certCBRNFixtures.step(
                "Get submittal number and check that application status is EXAM_ELIGIBLE",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "EXAM_ELIGIBLE",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate emails have been sent out.",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "Consolidated Receipt",
                        "BCEN is reviewing your Exam Accommodation"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads 'SCHEDULE/MANAGE EXAM'",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /SCHEDULE\/MANAGE EXAM/i
                    );
                }
            );
        }
    );

    certCBRNFixtures("deny accom, check status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step(
                "Reject exam accommodations",
                async () => {
                    await backOffice.reviewAccom("Reject", "CBRN");
                }
            );
            await certCBRNFixtures.step(
                "Get submittal number and check that application status is EXAM_ELIGIBLE",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "EXAM_ELIGIBLE",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate emails have been sent out.",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "Consolidated Receipt",
                        "BCEN is reviewing your Exam Accommodation",
                        "Authorized to test and test accommodation not approved"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads 'SCHEDULE/MANAGE EXAM'",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /SCHEDULE\/MANAGE EXAM/i
                    );
                }
            );
        }
    );
    certCBRNFixtures("NMI for accom, check status and email",
        async ({ homePage, backOffice }) => {
            const formattedDateTime = await backOffice.getCurrentDate();

            await certCBRNFixtures.step(
                "Require more information for exam accommodations",
                async () => {
                    await backOffice.reviewAccom("NMI", "CBRN");
                }
            );
            await certCBRNFixtures.step(
                "Get submittal number and check that application status is EXAM_ELIGIBLE",
                async () => {
                    const {
                        submittalNum,
                        workflowNum,
                    } = await backOffice.getSubmitAndWorkNums("CBRN");
                    await backOffice.checkAppStatus(
                        "ACCOMMODATION_NMI",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate emails have been sent out.",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "Consolidated Receipt",
                        "BCEN is reviewing your Exam Accommodation",
                        "Exam Accommodation - Need More Information"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads 'SCHEDULE/MANAGE EXAM'",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /Accommodation Additional Information Needed/i
                    );
                }
            );
        }
    );
});

certCBRNFixtures.describe("Take exam, pass or fail, check status", () => {
    certCBRNFixtures( "passed exam - email, status",
        async ({
            cbrnExamInfo,
            cbrnTestAssurance,
            cbrnCredVerification,
            cbrnStatus,
            cbrnCheckout,
            page,
            backOffice,
            homePage,
            cbrnPayment
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

            await certCBRNFixtures.step(
                "Fill out exam info.",
                async () => {
                    await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
                    await cbrnExamInfo.clickNext(page);
                }
            );
            const formattedDateTime = await backOffice.getCurrentDate();

            const {
                submittalNum,
                workflowNum,
            } = await backOffice.getSubmitAndWorkNums("CBRN");

            await certCBRNFixtures.step(
                "Go back to exam info after grabbing submittal number",
                async () => {
                    await homePage.visitCBRN();
                    await cbrnExamInfo.clickNext(page);
                }
            );

            await certCBRNFixtures.step(
                "Continue past Test Assurance",
                async () => {
                    await page.waitForLoadState('networkidle');
                    await cbrnTestAssurance.selectTestAssurance(testAssuranceArg);
                    await cbrnTestAssurance.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Continue past Credential Verification",
                async () => {
                    await cbrnCredVerification.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Continue past Status",
                async () => {
                    await cbrnStatus.clickCheckoutButton();
                    await expect(cbrnCheckout.workflowTitle).toHaveText(
                        "Checkout and Make Payment"
                    );
                }
            );

            await certCBRNFixtures.step(
                "Choose payment type, credit card type",
                async () => {
                    await cbrnCheckout.selectPaymentOption("CREDIT CARD");
                    await expect(cbrnCheckout.creditCardOptions).toBeVisible();
                    await cbrnCheckout.selectCreditCard("0K"); //'OK' is AE, 'OJ' is Visa/Discover/MC
                    await expect(cbrnCheckout.submitButton).toBeVisible();
                    await cbrnCheckout.clickSubmitCheckout();
                    await page.waitForLoadState("networkidle");
                }
            );
            await certCBRNFixtures.step("Submit payment", async () => {
                await cbrnPayment.fillCardNumber("341111597242000");
                await cbrnPayment.fillCVV("1154");
                await cbrnPayment.selectMonth("12");
                await cbrnPayment.selectYear("2025");
                await cbrnPayment.submitCardDetails();
                await page.waitForLoadState("networkidle");
            });
            await certCBRNFixtures.step(
                "Go to account in back office",
                async () => {
                    await backOffice.visitJohnetteAccount();
                }
            );
            await certCBRNFixtures.step("Go to submittal", async () => {
                const frame = await page.frameLocator("iframe").first();
                await page
                    .locator("#iframe_51000001261")
                    .contentFrame()
                    .getByRole("link", { name: "Application Created On " })
                    .click();
                await page
                    .locator("#iframe_51000001261")
                    .contentFrame()
                    .getByRole("button", { name: "" })
                    .click();
                if (submittalNum) {
                    await frame
                        .getByText(submittalNum)
                        .evaluate(
                            (node) => (node.style.border = "3px solid red")
                        );
                    await frame.getByText(submittalNum).click();
                }
                await page.waitForLoadState("networkidle");
            });
            await certCBRNFixtures.step(
                "Update exam status to Passed",
                async () => {
                    await backOffice.updateExamStatus("CBRN", "P");
                }
            );
            await certCBRNFixtures.step(
                "Check that application status is CERTIFIED",
                async () => {
                    await backOffice.checkAppStatus(
                        "CERTIFIED",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate email notifications have been sent",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "BCEN Exam Eligibility Notification",
                        "Consolidated Receipt",
                        "BCEN Exam Result Verification Notification"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads Certified",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /Certified through/i
                    );
                }
            );
            //logic to undo

            //for failed exam, Retest application available in 90 days, EXAM_FAILED, BCEN Exam and Next Steps
        }
    );

    certCBRNFixtures.only("failed exam - email, status",
        async ({
            cbrnExamInfo,
            cbrnTestAssurance,
            cbrnCredVerification,
            cbrnStatus,
            cbrnCheckout,
            page,
            backOffice,
            homePage,
            cbrnPayment
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

            //the reason this is so long is that I need the submittal number, and that can't be passed between tests.
            await certCBRNFixtures.step(
                "Fill out exam info",
                async () => {
                    await cbrnExamInfo.fillOutExamInfo_CBRN(examInfoArgs);
                    await cbrnExamInfo.clickNext(page);
                }
            );
            const formattedDateTime = await backOffice.getCurrentDate();

            const {
                submittalNum,
                workflowNum,
            } = await backOffice.getSubmitAndWorkNums("CBRN");

            await certCBRNFixtures.step(
                "Go back to exam info after grabbing submittal number",
                async () => {
                    await homePage.visit();
                    await homePage.linkCBRN.focus();
                    await homePage.linkCBRN.click();
                    await cbrnExamInfo.clickNext(page);
                }
            );

            await certCBRNFixtures.step(
                "Continue past Test Assurance",
                async () => {
                    await page.waitForLoadState('networkidle');
                    await cbrnTestAssurance.selectTestAssurance(testAssuranceArg);
                    await cbrnTestAssurance.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Continue past Credential Verification",
                async () => {
                    await cbrnCredVerification.clickNext(page);
                }
            );
            await certCBRNFixtures.step(
                "Continue past Status",
                async () => {
                    await cbrnStatus.clickCheckoutButton();
                    await expect(cbrnCheckout.workflowTitle).toHaveText(
                        "Checkout and Make Payment"
                    );
                }
            );

            await certCBRNFixtures.step(
                "Choose payment type, credit card type",
                async () => {
                    await cbrnCheckout.selectPaymentOption("CREDIT CARD");
                    await expect(cbrnCheckout.creditCardOptions).toBeVisible();
                    await cbrnCheckout.selectCreditCard("0K"); //'OK' is AE, 'OJ' is Visa/Discover/MC
                    await expect(cbrnCheckout.submitButton).toBeVisible();
                    await cbrnCheckout.clickSubmitCheckout();
                    await page.waitForLoadState("networkidle");
                }
            );
            await certCBRNFixtures.step("Submit payment", async () => {
                await cbrnPayment.fillCardNumber("341111597242000");
                await cbrnPayment.fillCVV("1154");
                await cbrnPayment.selectMonth("12");
                await cbrnPayment.selectYear("2025");
                await cbrnPayment.submitCardDetails();
                await page.waitForLoadState("networkidle");
                await expect(cbrnPayment.workflowTitle).toContainText(/Exam Authorized/i);
            });
            await certCBRNFixtures.step(
                "Go to submittal",
                async () => {
                    if (submittalNum && workflowNum) {
                        await backOffice.visit();
                        await page.goto(`https://online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
                    } else {
                        throw new Error('Error in navigation to back office.')
                    }
                }
            );
        /*    await certCBRNFixtures.step("Go to submittal", async () => {
                const frame = await page.frameLocator("iframe").first();
                await frame.getByRole('link', { name: 'Application Created On' }).click();
                await frame.getByRole('button', { name: '' }).click();
                if (submittalNum) {
                    await frame
                        .getByText(submittalNum)
                        .evaluate(
                            (node) => (node.style.border = "3px solid red")
                        );
                    await frame.getByText(submittalNum).click();
                }
                await page.waitForLoadState("networkidle");
            }); */
            await certCBRNFixtures.step(
                "Update exam status to Failed",
                async () => {
                    await backOffice.updateExamStatus("CBRN", "F");
                }
            );
            await certCBRNFixtures.step(
                "Check that application status is CERTIFIED",
                async () => {
                    await backOffice.checkAppStatus(
                        "EXAM_FAILED",
                        "CBRN",
                        submittalNum
                    );
                }
            );
            await certCBRNFixtures.step(
                "Check that appropriate email notifications have been sent",
                async () => {
                    await backOffice.checkEmailsVariable(
                        formattedDateTime,
                        "BCEN Exam Eligibility Notification",
                        "Consolidated Receipt",
                        "BCEN Exam and Next Steps"
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to home page and check that SSA message reads 'Retest application available in 90 days'",
                async () => {
                    await homePage.visit();
                    await expect(homePage.buttonCBRN).toContainText(
                        /Retest application available in 90 days/i
                    );
                }
            );
            await certCBRNFixtures.step(
                "Go to submittal",
                async () => {
                    if (submittalNum && workflowNum) {
                        await backOffice.visit();
                        await page.goto(`https://online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
                    } else {
                        throw new Error('Error in navigation to back office.')
                    }
                }
            );

            await certCBRNFixtures.step("return to submittal", async () => {
                if (submittalNum && workflowNum) {
                    await page.goto(
                        `https://dbrown:Catalyst1@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`
                    );
                } else {
                    console.log("Submittal or workflow number is undefined.");
                }
            });
            await certCBRNFixtures.step(
                "revert to initial application",
                async () => {
                    if(submittalNum && workflowNum) {
                        await backOffice.revertFailedToNewApp(submittalNum, workflowNum);
                    }
                }
            );
        }
    );
});

certCBRNFixtures("retired status, SSA message",
    async ({ homePage, backOffice, page, cbrnExamInfo }) => {
        const examInfoArgs = {
            accommodationRequest: null,
            militaryStatusRequest: null,
            licenseNumber: null,
            state: null,
            membership: null
        }
        const testAssuranceArg = null
        await cbrnExamInfo.setTestAnnotations(certCBRNFixtures.info(), examInfoArgs, testAssuranceArg);
        await certCBRNFixtures.step(
            "Set membership status to Retired",
            async () => {
                await backOffice.setToRetired();
            }
        );
        await certCBRNFixtures.step(
            "Go to home page and check that SSA message reads Retired",
            async () => {
                await homePage.visit();
                await expect(homePage.buttonCBRN).toContainText(/Retired on/i);
            }
        );
        await certCBRNFixtures.step(
            "Revert membership status to new application",
            async () => {
                await backOffice.revertCertifiedToNewApp();
            }
        );
        await certCBRNFixtures.step("", async () => {});
    }
);
