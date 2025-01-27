import { test, expect, Browser } from '@playwright/test';

test.use({
    storageState: './authState.json'
  });

test('Remove submittal from links in cert-list', async ({ browser }) => {
   // Create the main context and page for iterating links
   const mainContext = await browser.newContext();
   const mainPage = await mainContext.newPage();
 
   // Create a second context and page for removeSubmittal
   const submittalContext = await browser.newContext();
   const submittalPage = await submittalContext.newPage();

  await mainPage.goto('https://online.bcen.org/bcendevssa/f?p=700:2222:711942347350:'); // Replace with the actual URL

  // Locate the <ul> with the class "cert-list"
  const certList = mainPage.locator('ul.cert-list');

  // Find all link elements within the <ul>
  const links = await certList.locator('a').all();

  // Iterate through each link and call removeSubmittal
  for (const link of links) {
    const href = await link.getAttribute('href');
    if (href) {
      await removeSubmittal(href);
    }
  }

  // Define the removeSubmittal method
  async function removeSubmittal(href: any) {
    const match = href.match(/(\d{6})\D+(\d{6})/);
    console.log(match);

    if (match) {
      const submittalNum = match[1];
      const workflowNum = match[2];
      console.log(`Submittal Number: ${submittalNum}`);
      console.log(`Workflow Number: ${workflowNum}`);
      await submittalPage.goto(
        `https://online.bcen.org/bcendevssa/acgiapps.cf_remove_submittal?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`
      );
      await expect(submittalPage.locator('body')).toHaveText(`Submittal ${submittalNum} Removed`);
    } else {
      console.log('No matching sequences of six numbers found in the URL.');
    }
  }
});
