import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { BackOffice } from '../pages/backOffice.page';
import {CENExamInfo} from '../pages/-CEN/CEN_page1_examInfo.page'
import {CENMilitaryDoc} from '../pages/-CEN/CEN_page2_militaryDocUpload.page'
import {CENExamAccommodations} from '../pages/-CEN/CEN_page3_examAccom.page'
import {CENInternationalAudit} from '../pages/-CEN/CEN_page4_intlRNAudit.page'
import {CENTestAssurance} from '../pages/-CEN/CEN_page5_testAssurance.page'
import {CENCredVerification} from '../pages/-CEN/CEN_page6_credentialVerification.page'
import {CENStatus} from '../pages/-CEN/CEN_page7_status.page'
import {CENCheckout} from '../pages/-CEN/CEN_page8_checkout.page'
import {CENPayment} from '../pages/-CEN/CEN_page9_payment.page'

type MyFixtures = {
    homePage:HomePage,
    backOffice:BackOffice,
    cenExamInfo:CENExamInfo,
    cenMilitaryDoc:CENMilitaryDoc,
    cenExamAccommodations:CENExamAccommodations,
    cenInternationalAudit: CENInternationalAudit,
    cenTestAssurance: CENTestAssurance,
    cenCredVerification: CENCredVerification,
    cenStatus: CENStatus,
    cenCheckout: CENCheckout,
    cenPayment: CENPayment
  };
  export const certCENFixtures = base.extend<MyFixtures>({
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
    cenExamInfo: async ({
      page
    }, use) => {
      const cenExamInfo = new CENExamInfo(page);
      await use(cenExamInfo);
    },

    cenMilitaryDoc: async ({
      page
    }, use) => {
      const cenMilitaryDoc = new CENMilitaryDoc(page);
      await use(cenMilitaryDoc);
    },

    cenExamAccommodations: async ({
      page
    }, use) => {
      const cenExamAccommodations = new CENExamAccommodations(page);
      await use(cenExamAccommodations);
    },
    cenInternationalAudit: async ({
      page
    }, use) => {
      const cenInternationalAudit = new CENInternationalAudit(page);
      await use(cenInternationalAudit);
    },
    cenTestAssurance: async ({
      page
    }, use) => {
      const cenTestAssurance = new CENTestAssurance(page);
      await use(cenTestAssurance);
    },
    cenCredVerification: async ({
      page
    }, use) => {
      const cenCredVerification = new CENCredVerification(page);
      await use(cenCredVerification);
    },
    cenStatus: async ({
      page
    }, use) => {
      const cenStatus = new CENStatus(page);
      await use(cenStatus);
    },
    cenCheckout: async ({
      page
    }, use) => {
      const cenCheckout = new CENCheckout(page);
      await use(cenCheckout);
    },
    cenPayment: async ({
      page
    }, use) => {
      const cenPayment = new CENPayment(page);
      await use(cenPayment);
    },
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';