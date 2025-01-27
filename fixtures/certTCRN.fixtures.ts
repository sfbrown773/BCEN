import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Flow } from '../pages/flows.page';

type MyFixtures = {
    homePage:HomePage,
    certTCRN:Flow
  };
  export const certTCRNFixtures = base.extend<MyFixtures>({
    homePage: async ({
      page
  }, use) => {
      const homePage = new HomePage(page);
      await homePage.open();
      await use(homePage);
  },
    certTCRN: async ({
      page
    }, use) => {
      const certTCRN = new Flow(page);
      await use(certTCRN);
    }
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';