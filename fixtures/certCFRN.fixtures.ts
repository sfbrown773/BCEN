import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Flow } from '../pages/flows.page';

type MyFixtures = {
    homePage:HomePage,
    certCFRN:Flow
  };
  export const certCFRNFixtures = base.extend<MyFixtures>({
    homePage: async ({
      page
  }, use) => {
      const homePage = new HomePage(page);
      await homePage.open();
      await use(homePage);
  },
    certCFRN: async ({
      page
    }, use) => {
      const certCFRN = new Flow(page);
      await use(certCFRN);
    }
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';