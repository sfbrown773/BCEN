import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Flow } from '../pages/flows.page';
import { BackOffice } from '../pages/backOffice.page';

type MyFixtures = {
    homePage:HomePage,
    certCBRN:Flow,
    backOffice:BackOffice

  };
  export const certCBRNFixtures = base.extend<MyFixtures>({
    homePage: async ({
      page
  }, use) => {
      const homePage = new HomePage(page);
      await homePage.visit();
      await use(homePage);
  },
    certCBRN: async ({
      page,
      homePage
    }, use) => {
      const certCBRN = new Flow(page);
      await use(certCBRN);
    },
    backOffice: async ({
      page
    }, use) => {
      const backOffice = new BackOffice(page)
      await use(backOffice);
    }
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';