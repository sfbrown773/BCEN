import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { BackOffice } from '../pages/backOffice.page';
import {CTRNExamInfo} from '../pages/-CTRN/CTRN_page1_examInfo.page'
import {CTRNMilitaryDoc} from '../pages/-CTRN/CTRN_page2_militaryDocUpload.page'
import {CTRNExamAccommodations} from '../pages/-CTRN/CTRN_page3_examAccom.page'
import {CTRNInternationalAudit} from '../pages/-CTRN/CTRN_page4_intlRNAudit.page'
import {CTRNTestAssurance} from '../pages/-CTRN/CTRN_page5_testAssurance.page'
import {CTRNCredVerification} from '../pages/-CTRN/CTRN_page6_credentialVerification.page'
import {CTRNStatus} from '../pages/-CTRN/CTRN_page7_status.page'
import {CTRNCheckout} from '../pages/-CTRN/CTRN_page8_checkout.page'
import {CTRNPayment} from '../pages/-CTRN/CTRN_page9_payment.page'

type MyFixtures = {
    homePage:HomePage,
    backOffice:BackOffice,
    ctrnExamInfo:CTRNExamInfo,
    ctrnMilitaryDoc:CTRNMilitaryDoc,
    ctrnExamAccommodations:CTRNExamAccommodations,
    ctrnInternationalAudit: CTRNInternationalAudit,
    ctrnTestAssurance: CTRNTestAssurance,
    ctrnCredVerification: CTRNCredVerification,
    ctrnStatus: CTRNStatus,
    ctrnCheckout: CTRNCheckout,
    ctrnPayment: CTRNPayment
  };
  export const certCTRNFixtures = base.extend<MyFixtures>({
    homePage: async ({
      page
  }, use) => {
      const homePage = new HomePage(page);
      await homePage.open();
      await use(homePage);
  },
  backOffice: async ({
    page
  }, use) => {
    const backOffice = new BackOffice(page);
    await use(backOffice);
  },
    ctrnExamInfo: async ({
      page
    }, use) => {
      const ctrnExamInfo = new CTRNExamInfo(page);
      await use(ctrnExamInfo);
    },

    ctrnMilitaryDoc: async ({
      page
    }, use) => {
      const ctrnMilitaryDoc = new CTRNMilitaryDoc(page);
      await use(ctrnMilitaryDoc);
    },

    ctrnExamAccommodations: async ({
      page
    }, use) => {
      const ctrnExamAccommodations = new CTRNExamAccommodations(page);
      await use(ctrnExamAccommodations);
    },
    ctrnInternationalAudit: async ({
      page
    }, use) => {
      const ctrnInternationalAudit = new CTRNInternationalAudit(page);
      await use(ctrnInternationalAudit);
    },
    ctrnTestAssurance: async ({
      page
    }, use) => {
      const ctrnTestAssurance = new CTRNTestAssurance(page);
      await use(ctrnTestAssurance);
    },
    ctrnCredVerification: async ({
      page
    }, use) => {
      const ctrnCredVerification = new CTRNCredVerification(page);
      await use(ctrnCredVerification);
    },
    ctrnStatus: async ({
      page
    }, use) => {
      const ctrnStatus = new CTRNStatus(page);
      await use(ctrnStatus);
    },
    ctrnCheckout: async ({
      page
    }, use) => {
      const ctrnCheckout = new CTRNCheckout(page);
      await use(ctrnCheckout);
    },
    ctrnPayment: async ({
      page
    }, use) => {
      const ctrnPayment = new CTRNPayment(page);
      await use(ctrnPayment);
    },
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';