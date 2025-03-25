import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { BackOffice } from '../pages/backOffice.page';
import {CFRNExamInfo} from '../pages/-CFRN/CFRN_page1_examInfo.page'
import {CFRNMilitaryDoc} from '../pages/-CFRN/CFRN_page2_militaryDocUpload.page'
import {CFRNExamAccommodations} from '../pages/-CFRN/CFRN_page3_examAccom.page'
import {CFRNInternationalAudit} from '../pages/-CFRN/CFRN_page4_intlRNAudit.page'
import {CFRNTestAssurance} from '../pages/-CFRN/CFRN_page5_testAssurance.page'
import {CFRNCredVerification} from '../pages/-CFRN/CFRN_page6_credentialVerification.page'
import {CFRNStatus} from '../pages/-CFRN/CFRN_page7_status.page'
import {CFRNCheckout} from '../pages/-CFRN/CFRN_page8_checkout.page'
import {CFRNPayment} from '../pages/-CFRN/CFRN_page9_payment.page'

type MyFixtures = {
    homePage:HomePage,
    backOffice:BackOffice,
    cfrnExamInfo:CFRNExamInfo,
    cfrnMilitaryDoc:CFRNMilitaryDoc,
    cfrnExamAccommodations:CFRNExamAccommodations,
    cfrnInternationalAudit: CFRNInternationalAudit,
    cfrnTestAssurance: CFRNTestAssurance,
    cfrnCredVerification: CFRNCredVerification,
    cfrnStatus: CFRNStatus,
    cfrnCheckout: CFRNCheckout,
    cfrnPayment: CFRNPayment
  };
  export const certCFRNFixtures = base.extend<MyFixtures>({
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
    cfrnExamInfo: async ({
      page
    }, use) => {
      const cfrnExamInfo = new CFRNExamInfo(page);
      await use(cfrnExamInfo);
    },

    cfrnMilitaryDoc: async ({
      page
    }, use) => {
      const cfrnMilitaryDoc = new CFRNMilitaryDoc(page);
      await use(cfrnMilitaryDoc);
    },

    cfrnExamAccommodations: async ({
      page
    }, use) => {
      const cfrnExamAccommodations = new CFRNExamAccommodations(page);
      await use(cfrnExamAccommodations);
    },
    cfrnInternationalAudit: async ({
      page
    }, use) => {
      const cfrnInternationalAudit = new CFRNInternationalAudit(page);
      await use(cfrnInternationalAudit);
    },
    cfrnTestAssurance: async ({
      page
    }, use) => {
      const cfrnTestAssurance = new CFRNTestAssurance(page);
      await use(cfrnTestAssurance);
    },
    cfrnCredVerification: async ({
      page
    }, use) => {
      const cfrnCredVerification = new CFRNCredVerification(page);
      await use(cfrnCredVerification);
    },
    cfrnStatus: async ({
      page
    }, use) => {
      const cfrnStatus = new CFRNStatus(page);
      await use(cfrnStatus);
    },
    cfrnCheckout: async ({
      page
    }, use) => {
      const cfrnCheckout = new CFRNCheckout(page);
      await use(cfrnCheckout);
    },
    cfrnPayment: async ({
      page
    }, use) => {
      const cfrnPayment = new CFRNPayment(page);
      await use(cfrnPayment);
    },
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';