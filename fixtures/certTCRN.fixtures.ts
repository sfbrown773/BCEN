import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { BackOffice } from '../pages/backOffice.page';
import {TCRNExamInfo} from '../pages/-TCRN/TCRN_page1_examInfo.page'
import {TCRNMilitaryDoc} from '../pages/-TCRN/TCRN_page2_militaryDocUpload.page'
import {TCRNExamAccommodations} from '../pages/-TCRN/TCRN_page3_examAccom.page'
import {TCRNInternationalAudit} from '../pages/-TCRN/TCRN_page4_intlRNAudit.page'
import {TCRNTestAssurance} from '../pages/-TCRN/TCRN_page5_testAssurance.page'
import {TCRNCredVerification} from '../pages/-TCRN/TCRN_page6_credentialVerification.page'
import {TCRNStatus} from '../pages/-TCRN/TCRN_page7_status.page'
import {TCRNCheckout} from '../pages/-TCRN/TCRN_page8_checkout.page'
import {TCRNPayment} from '../pages/-TCRN/TCRN_page9_payment.page'

type MyFixtures = {
    homePage:HomePage,
    backOffice:BackOffice,
    tcrnExamInfo:TCRNExamInfo,
    tcrnMilitaryDoc:TCRNMilitaryDoc,
    tcrnExamAccommodations:TCRNExamAccommodations,
    tcrnInternationalAudit: TCRNInternationalAudit,
    tcrnTestAssurance: TCRNTestAssurance,
    tcrnCredVerification: TCRNCredVerification,
    tcrnStatus: TCRNStatus,
    tcrnCheckout: TCRNCheckout,
    tcrnPayment: TCRNPayment
  };
  export const certTCRNFixtures = base.extend<MyFixtures>({
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
    tcrnExamInfo: async ({
      page
    }, use) => {
      const tcrnExamInfo = new TCRNExamInfo(page);
      await use(tcrnExamInfo);
    },

    tcrnMilitaryDoc: async ({
      page
    }, use) => {
      const tcrnMilitaryDoc = new TCRNMilitaryDoc(page);
      await use(tcrnMilitaryDoc);
    },

    tcrnExamAccommodations: async ({
      page
    }, use) => {
      const tcrnExamAccommodations = new TCRNExamAccommodations(page);
      await use(tcrnExamAccommodations);
    },
    tcrnInternationalAudit: async ({
      page
    }, use) => {
      const tcrnInternationalAudit = new TCRNInternationalAudit(page);
      await use(tcrnInternationalAudit);
    },
    tcrnTestAssurance: async ({
      page
    }, use) => {
      const tcrnTestAssurance = new TCRNTestAssurance(page);
      await use(tcrnTestAssurance);
    },
    tcrnCredVerification: async ({
      page
    }, use) => {
      const tcrnCredVerification = new TCRNCredVerification(page);
      await use(tcrnCredVerification);
    },
    tcrnStatus: async ({
      page
    }, use) => {
      const tcrnStatus = new TCRNStatus(page);
      await use(tcrnStatus);
    },
    tcrnCheckout: async ({
      page
    }, use) => {
      const tcrnCheckout = new TCRNCheckout(page);
      await use(tcrnCheckout);
    },
    tcrnPayment: async ({
      page
    }, use) => {
      const tcrnPayment = new TCRNPayment(page);
      await use(tcrnPayment);
    },
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';