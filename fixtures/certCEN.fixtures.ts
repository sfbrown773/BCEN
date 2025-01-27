import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { Flow } from '../pages/flows.page';

type MyFixtures = {
    homePage:HomePage,
    certCen:Flow
  };
  export const certCENFixtures = base.extend<MyFixtures>({
    homePage: async ({
      page
  }, use) => {
      const homePage = new HomePage(page);
      await homePage.open();
      await use(homePage);
  },
    certCen: async ({
      page
    }, use) => {
      const certCen = new Flow(page);
      await use(certCen);
    }
  });
  export {
    expect,
    test as setup
  }
  from '@playwright/test';