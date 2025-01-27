import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Flow } from '../pages/flows.page';

type MyFixtures = {
    homePage:HomePage,
    certCBRN:Flow,
    skipBeforeEach: boolean;

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
    skipBeforeEach: async ({}, use) => {
      await use(false);
    },
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';