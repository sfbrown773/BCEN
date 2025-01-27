import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Flow } from '../pages/flows.page';

type MyFixtures = {
    homePage:HomePage,
    certCTRN:Flow
  };
  export const certCTRNFixtures = base.extend<MyFixtures>({
    homePage: async ({
      page
  }, use) => {
      const homePage = new HomePage(page);
      await homePage.open();
      await use(homePage);
  },
    certCTRN: async ({
      page
    }, use) => {
      const certCTRN = new Flow(page);
      await use(certCTRN);
    }
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';