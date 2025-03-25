import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { BackOffice } from '../pages/backOffice.page';
import {CBRNExamInfo} from '../pages/-CBRN/CBRN_page1_examInfo.page'
import {CBRNMilitaryDoc} from '../pages/-CBRN/CBRN_page2_militaryDocUpload.page'
import {CBRNExamAccommodations} from '../pages/-CBRN/CBRN_page3_examAccom.page'
import {CBRNInternationalAudit} from '../pages/-CBRN/CBRN_page4_intlRNAudit.page'
import {CBRNTestAssurance} from '../pages/-CBRN/CBRN_page5_testAssurance.page'
import {CBRNCredVerification} from '../pages/-CBRN/CBRN_page6_credentialVerification.page'
import {CBRNStatus} from '../pages/-CBRN/CBRN_page7_status.page'
import {CBRNCheckout} from '../pages/-CBRN/CBRN_page8_checkout.page'
import {CBRNPayment} from '../pages/-CBRN/CBRN_page9_payment.page'

type MyFixtures = {
    homePage:HomePage,
    backOffice:BackOffice,
    cbrnExamInfo:CBRNExamInfo,
    cbrnMilitaryDoc:CBRNMilitaryDoc,
    cbrnExamAccommodations:CBRNExamAccommodations,
    cbrnInternationalAudit: CBRNInternationalAudit,
    cbrnTestAssurance: CBRNTestAssurance,
    cbrnCredVerification: CBRNCredVerification,
    cbrnStatus: CBRNStatus,
    cbrnCheckout: CBRNCheckout,
    cbrnPayment: CBRNPayment
  };
  export const certCBRNFixtures = base.extend<MyFixtures>({
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
    cbrnExamInfo: async ({
      page
    }, use) => {
      const cbrnExamInfo = new CBRNExamInfo(page);
      await use(cbrnExamInfo);
    },

    cbrnMilitaryDoc: async ({
      page
    }, use) => {
      const cbrnMilitaryDoc = new CBRNMilitaryDoc(page);
      await use(cbrnMilitaryDoc);
    },

    cbrnExamAccommodations: async ({
      page
    }, use) => {
      const cbrnExamAccommodations = new CBRNExamAccommodations(page);
      await use(cbrnExamAccommodations);
    },
    cbrnInternationalAudit: async ({
      page
    }, use) => {
      const cbrnInternationalAudit = new CBRNInternationalAudit(page);
      await use(cbrnInternationalAudit);
    },
    cbrnTestAssurance: async ({
      page
    }, use) => {
      const cbrnTestAssurance = new CBRNTestAssurance(page);
      await use(cbrnTestAssurance);
    },
    cbrnCredVerification: async ({
      page
    }, use) => {
      const cbrnCredVerification = new CBRNCredVerification(page);
      await use(cbrnCredVerification);
    },
    cbrnStatus: async ({
      page
    }, use) => {
      const cbrnStatus = new CBRNStatus(page);
      await use(cbrnStatus);
    },
    cbrnCheckout: async ({
      page
    }, use) => {
      const cbrnCheckout = new CBRNCheckout(page);
      await use(cbrnCheckout);
    },
    cbrnPayment: async ({
      page
    }, use) => {
      const cbrnPayment = new CBRNPayment(page);
      await use(cbrnPayment);
    },
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';