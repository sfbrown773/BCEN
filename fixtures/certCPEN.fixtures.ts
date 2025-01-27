import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Flow } from '../pages/flows.page';

type MyFixtures = {
    homePage:HomePage,
    certCPEN:Flow
  };
  export const certCPENFixtures = base.extend<MyFixtures>({
    homePage: async ({
      page
  }, use) => {
      const homePage = new HomePage(page);
      await homePage.open();
      await use(homePage);
  },
    certCPEN: async ({
      page
    }, use) => {
      const certCPEN  = new Flow(page);
      await use(certCPEN);
    }
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';