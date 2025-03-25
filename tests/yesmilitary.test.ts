import { certCENFixtures, expect } from "../fixtures/certCEN.fixtures";
import fs from 'fs';
import { BackOffice } from "../pages/backOffice.page";
import { LandingPage } from "../pages/landingPage.page";
import { test } from "@playwright/test";
import { Flow } from "../pages/flows.page";
import { HomePage } from "../pages/home.page";

//evidently only one discount can be applied - if you get the military discount, being a member doesn't result in additional discount

    test('yes military', async ({
        page
        }) => {
            const backOffice = new BackOffice(page);
            await backOffice.visit();
            await backOffice.clickRecentsButton();
            await backOffice.clickFernandoAccount();
        
            const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            backOffice.clickLoginAsCust(), // Trigger the popup
            ]);
        
            // Use the LandingPage class for the popup
            const landingPage = new LandingPage(popup);
        
            // Wait for the landing page to load
            await expect(landingPage.myAccountLink).toBeVisible();
            await landingPage.clickMyAccount();
            await page.waitForLoadState('load');

            await page.context().storageState({ path: 'authState_Military.json' });
        });

        test.describe('yes military', () => {
    test.use({
       storageState: 'authState_Military.json'
      });

      test.beforeEach('yes military', async ({ page }) => {
        const certCen = new Flow(page);
        const homePage = new HomePage(page);
        await homePage.visit();
        await homePage.removeSubmittal('CEN');
      await certCen.visitCEN();
      await certCen.fillOutExamInfo_CEN();
      await certCen.clickNext(page);
      });
      
        test('yes military, no member, yes assurance', async ({ page }) => {

        const certCen = new Flow(page);
          await certCen.clickYesTestAssurance();
          await certCen.clickNext(page);
          // Move to Credential Verification
          await certCen.clickNext(page);
          // Move to Status

          await page.waitForLoadState('load');
          await page.waitForTimeout(500)
          await certCen.clickCheckoutButton();
          await page.waitForLoadState('load');
          // Move to checkout
          await certCen.checkoutTable.waitFor({ state: 'visible' });
          await expect(certCen.checkoutTable).toContainText(certCen.priceYesMilYesAssur);
          await expect(certCen.checkoutTable).toContainText('includes Test Assurance');
          await certCen.clearCheckout();
          await expect(certCen.checkoutTable).toBeHidden();
        });
      
        test('yes military, no member, no assurance', async ({ page }) => {
            const certCen = new Flow(page);
          await certCen.clickNoTestAssurance();
          await certCen.clickNext(page);
          // Move to Credential Verification
          await certCen.clickNext(page);
          await page.waitForLoadState('load');
          // Move to Status
          await certCen.clickCheckoutButton();
          await page.waitForLoadState('load');
          // Move to checkout
          await certCen.checkoutTable.waitFor({ state: 'visible' });
          await expect(certCen.checkoutTable).toContainText(certCen.priceYesMilYesAssur);
          await certCen.clearCheckout();
          await expect(certCen.checkoutTable).toBeHidden();
        });
    });