import { test as setup, expect } from '@playwright/test';
import { BackOffice } from '../pages/backOffice.page';
import { LandingPage } from '../pages/landingPage.page';
import { HomePage } from '../pages/home.page';
import path from 'path';

const authFile = path.join(__dirname, '../authState.json');

setup.describe('authenticated browser state', () => {

  let backOffice: BackOffice;
  let homePage: HomePage
 
  setup.beforeEach(async ({ page }) => {
   backOffice = new BackOffice(page);
  });

setup('authenticate', async ({ page }) => {
  await backOffice.visit();
  await backOffice.clickRecentsButton();
  await backOffice.clickUserAccount();

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    backOffice.clickLoginAsCust(), // Trigger the popup
  ]);

  // Use the LandingPage class for the popup
  const landingPage = new LandingPage(popup);

  // Wait for the landing page to load
  await landingPage.clickMyAccount();
  const homePage = new HomePage(popup);
  await expect(popup.getByRole('heading', { name: 'My Certifications' })).toBeVisible();

  await page.context().storageState({ path: authFile });

  });
});