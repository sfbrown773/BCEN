import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { BackOffice } from '../pages/backOffice.page';
import {CPENExamInfo} from '../pages/-CPEN/CPEN_page1_examInfo.page'
import {CPENMilitaryDoc} from '../pages/-CPEN/CPEN_page2_militaryDocUpload.page'
import {CPENExamAccommodations} from '../pages/-CPEN/CPEN_page3_examAccom.page'
import {CPENInternationalAudit} from '../pages/-CPEN/CPEN_page4_intlRNAudit.page'
import {CPENTestAssurance} from '../pages/-CPEN/CPEN_page5_testAssurance.page'
import {CPENCredVerification} from '../pages/-CPEN/CPEN_page6_credentialVerification.page'
import {CPENStatus} from '../pages/-CPEN/CPEN_page7_status.page'
import {CPENCheckout} from '../pages/-CPEN/CPEN_page8_checkout.page'
import {CPENPayment} from '../pages/-CPEN/CPEN_page9_payment.page'

type MyFixtures = {
    homePage:HomePage,
    backOffice:BackOffice,
    cpenExamInfo:CPENExamInfo,
    cpenMilitaryDoc:CPENMilitaryDoc,
    cpenExamAccommodations:CPENExamAccommodations,
    cpenInternationalAudit: CPENInternationalAudit,
    cpenTestAssurance: CPENTestAssurance,
    cpenCredVerification: CPENCredVerification,
    cpenStatus: CPENStatus,
    cpenCheckout: CPENCheckout,
    cpenPayment: CPENPayment
  };
  export const certCPENFixtures = base.extend<MyFixtures>({
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
    cpenExamInfo: async ({
      page
    }, use) => {
      const cpenExamInfo = new CPENExamInfo(page);
      await use(cpenExamInfo);
    },

    cpenMilitaryDoc: async ({
      page
    }, use) => {
      const cpenMilitaryDoc = new CPENMilitaryDoc(page);
      await use(cpenMilitaryDoc);
    },

    cpenExamAccommodations: async ({
      page
    }, use) => {
      const cpenExamAccommodations = new CPENExamAccommodations(page);
      await use(cpenExamAccommodations);
    },
    cpenInternationalAudit: async ({
      page
    }, use) => {
      const cpenInternationalAudit = new CPENInternationalAudit(page);
      await use(cpenInternationalAudit);
    },
    cpenTestAssurance: async ({
      page
    }, use) => {
      const cpenTestAssurance = new CPENTestAssurance(page);
      await use(cpenTestAssurance);
    },
    cpenCredVerification: async ({
      page
    }, use) => {
      const cpenCredVerification = new CPENCredVerification(page);
      await use(cpenCredVerification);
    },
    cpenStatus: async ({
      page
    }, use) => {
      const cpenStatus = new CPENStatus(page);
      await use(cpenStatus);
    },
    cpenCheckout: async ({
      page
    }, use) => {
      const cpenCheckout = new CPENCheckout(page);
      await use(cpenCheckout);
    },
    cpenPayment: async ({
      page
    }, use) => {
      const cpenPayment = new CPENPayment(page);
      await use(cpenPayment);
    },
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';