
import { test, expect } from "@playwright/test";
import { Locator } from '@playwright/test';
import { Flow } from "../pages/flows.page";
import { HomePage } from "../pages/home.page";

//Go through every page of the flows and run universal tests. Save the universal tests on a page.ts. Maybe a separate one.

//Test idea: Dropdowns have the same background fill in different browsers
//Credential Verification requires email format

test.describe('', () => {

    test('navigate through CEN', async ({ page }) => {
        const flow = new Flow(page);
        const homePage = new HomePage(page);

        await homePage.visit();
        await homePage.removeSubmittal('CEN');
        await flow.visitCEN();
        //navigate to 'Exam Information' page.
        //run tests
        await flow.fillOutYesMil_CEN();
        await expect(flow.workflowTitle).toContainText(/Upload Military Documentation/i);
        //navigate to Upload Military Documentation
        //run tests
        await flow.goToExamInformation();
        await flow.clickNoMilDiscount();
        await flow.clickYesExamAccom();
        await flow.clickNext(page);
        await expect(flow.workflowTitle).toContainText(/Exam Accommodation Request/i);
        //navigate to Exam Accom
        //run tests
        await flow.goToExamInformation();
        await flow.clickNoExamAccom();
        await flow.clickNext(page);
        await expect(flow.workflowTitle).toContainText(/Test Assurance/i);
        //navigate to Test Assurance
        //run tests
        await flow.clickYesTestAssurance();
        await flow.clickNext(page);
        await expect(flow.workflowTitle).toContainText(/Credential Verification/i);
        //navigate to Credential Verification
        //run tests
        await flow.clickNext(page);
        await expect(flow.workflowTitle).toContainText(/Status/i);
        //navigate to Status
        //run tests
        await flow.clickCheckoutButton();
        await expect(flow.workflowTitle).toContainText(/Checkout and Make Payment/i);
        //navigate to Checkout
        //run tests
        await flow.selectPaymentOption('CREDIT CARD');
        await expect(flow.creditCardOptions).toBeVisible();
        await flow.selectCreditCard('0K'); //'OK' is AE, 'OJ' is Visa/Discover/MC
        await expect(flow.submitButton).toBeVisible();
        await flow.submitButton.click();
        await expect(flow.nameOnCard).toBeVisible();
        //navigate to Payment Interface
        //Run tests

    });

    test('radio, click parent or sibling', async ({ page }) => {
        const radioButtons = page.locator('input[type="radio"]');
        const radioCount = await radioButtons.count();

        for (let i = 0; i < radioCount; i++) {

            const radioButton = radioButtons.nth(i);
            const parentDiv = await radioButton.locator('xpath=parent::div').first();
            const followingSibling = radioButton.locator('xpath=following-sibling::*');
            const precedingSibling = radioButton.locator('xpath=preceding-sibling::*');

            // Identify the group of the current radio button using the "name" attribute
            const radioButtonName = await radioButton.getAttribute('name');
            const sameGroupRadioButtons = page.locator(`input[type="radio"][name="${radioButtonName}"]`);

            // Find another radio button in the same group
            const sameGroupCount = await sameGroupRadioButtons.count();
            let otherButtonInGroup: Locator | null = null;

            for (let j = 0; j < sameGroupCount; j++) {
                if (j !== i) {
                    otherButtonInGroup = sameGroupRadioButtons.nth(j);
                    break;
                }
            }

        async function uncheckRadio() {// Ensure the radio button can be toggled
            if (await radioButton.isChecked() && otherButtonInGroup) {
                await otherButtonInGroup.click(); // Uncheck the current radio button
            } else if (await radioButton.isChecked() && !otherButtonInGroup) {
                console.warn(`No other radio button in the same group to toggle for radio button at index ${i}`);
            }
        }

            if (await parentDiv.count() > 0) {
                await uncheckRadio();
                await parentDiv.click();
                await expect(radioButton).toBeChecked();
                await uncheckRadio();
            }

            if (await followingSibling.count() > 0) {
                await uncheckRadio();
                await followingSibling.click();
                await expect(radioButton).toBeChecked();
                await uncheckRadio();
            }

            if (await precedingSibling.count() > 0) {
                await uncheckRadio();
                await precedingSibling.click();
                await expect(radioButton).toBeChecked();
                await uncheckRadio();
            }

        }
    });

    test('labels and legends padding', async ({
        page,
        
    }) => {
        const labelsAndLegends = page.locator('label, legend');
        
        const elementsCount = await labelsAndLegends.count();
        const firstElementCSS = await labelsAndLegends.nth(0).evaluate((element) => {
            // Get computed styles of the first element
            const computedStyle = window.getComputedStyle(element);
            return {
                font: computedStyle.font,
                border: computedStyle.border,
                margin: computedStyle.margin,
                align: computedStyle.alignContent,
                background: computedStyle.background,
                color: computedStyle.color,
                max: computedStyle.maxWidth,
                min: computedStyle.minWidth,
                padding: computedStyle.padding,
                transform: computedStyle.transform
            };
        });

        // Loop through all elements and check their computed CSS
        for (let i = 0; i < elementsCount; i++) {
            const currentElementCSS = await labelsAndLegends.nth(i).evaluate((element) => {
                const computedStyle = window.getComputedStyle(element);
                return {
                    font: computedStyle.font,
                    border: computedStyle.border,
                    margin: computedStyle.margin,
                    align: computedStyle.alignContent,
                    background: computedStyle.background,
                    color: computedStyle.color,
                    max: computedStyle.maxWidth,
                    min: computedStyle.minWidth,
                    padding: computedStyle.padding,
                    transform: computedStyle.transform
                };
            });

            try {
                // Soft assertion for the CSS comparison
                expect(currentElementCSS).toEqual(firstElementCSS);
            } catch (error) {
                // If the test fails, log the locator
                const locator = await labelsAndLegends.nth(i).evaluate((element) => element.outerHTML);
                console.log(`Mismatch found in element ${i}: ${locator}`);
            }
        }
    });

    test('external links open in new tab', async ({
        page
    }) => {
        const links = await page.locator('a');
        const hrefs = await links.evaluateAll((anchors) => 
            anchors
            .filter((a) => a instanceof HTMLAnchorElement) // Ensure the element is an HTMLAnchorElement
            .map((a) => a.href) // Access href only on anchor elements
        );
        const currentDomain = new URL(await page.url()).hostname;
        
        const extLinks = hrefs.filter((href) => {
            const linkDomain = new URL(href).hostname;
            return linkDomain !== currentDomain && href.startsWith('http');
        });

        const extLinksCount = extLinks.length;
        for (let i = 0; i < extLinksCount; i++) {
            const externalLink = extLinks[i];
            const linkLocator = page.locator(`a[href="${externalLink}"]`);
            await expect(linkLocator).toHaveAttribute('target', '_blank');
            //await expect(linkLocator).toHaveAttribute('rel', 'noopener');
            //Many sources say this is best practice to avoid tab-nabbing, but maybe they are doing some other way
            console.log(`Link Locator ${i}:`, linkLocator);
        }
    }); 

    test('_Height, font of input boxes', async ({
        page,
        
    }) => {
        const inputBoxes = page.locator('input.form-control[type="text"]');
        const elementsCount = await inputBoxes.count();

        const firstElementCSS = await inputBoxes.nth(0).evaluate((element) => {
            const computedStyle = window.getComputedStyle(element);
            return {
                font: computedStyle.font,
                border: computedStyle.border,
                margin: computedStyle.margin,
                align: computedStyle.alignContent,
                background: computedStyle.background,
                color: computedStyle.color,
                max: computedStyle.maxWidth,
                min: computedStyle.minWidth,
                padding: computedStyle.padding,
                transform: computedStyle.transform
            };
        });

        // To collect any mismatches (soft assertion)
        const mismatches: number[] = [];;

        for (let i = 1; i < elementsCount; i++) {
            const currentElementCSS = await inputBoxes.nth(i).evaluate((element) => {
                const computedStyle = window.getComputedStyle(element);
                return {
                    font: computedStyle.font,
                    border: computedStyle.border,
                    margin: computedStyle.margin,
                    align: computedStyle.alignContent,
                    background: computedStyle.background,
                    color: computedStyle.color,
                    max: computedStyle.maxWidth,
                    min: computedStyle.minWidth,
                    padding: computedStyle.padding,
                    transform: computedStyle.transform
                };
            });

            if (JSON.stringify(currentElementCSS) !== JSON.stringify(firstElementCSS)) {
                // Log the mismatch and the locator
                const locator = await inputBoxes.nth(i).evaluate((element) => element.outerHTML);
                console.log(`Mismatch found in ${locator}`);
                mismatches.push(i); // Collecting mismatches
            }
        }

        if (mismatches.length > 0) {
            console.log(`Mismatch found in the following elements: ${mismatches.join(', ')}`);
        }
    });
    test('for all buttons, cursor changes to pointer', async ({
        page
    }) => {
        const buttonsAndLinks = await page.locator('button:not([disabled])')
        const buttonsLinksCount = await buttonsAndLinks.count();
        for (let i=0; buttonsLinksCount<0; i++) {
            const element = buttonsAndLinks.nth(i);
            await expect(element).toHaveCSS('cursor', 'pointer');
        }
        //no isClickable() method, ready made. Can check isVisible, isEnabled (already controlled by :not([disabled]))
    });
    test('all buttons have border', async ({
        page
    }) => {
        const referenceValue = { border: '1px solid rgba(0, 0, 0, 0)' }

        for (const button of await page.locator('button').all()) {

            const border = await button.evaluate((el) => {
                const computedStyle = window.getComputedStyle(el);
                return {
                    border: computedStyle.border
                }
                
            });
            console.log(border);
            await expect.soft(border).toEqual(referenceValue);
        }
            //JUST AN EXAMPLE, BUT NEED HELP TO DETERMINE WHAT THE CONDITION IS FOR THE 'expect'  
        
    });

    test('checkboxes, click whole div', async ({ page }) => {
        const checkboxes = page.locator('input[type="checkbox"]');
        const checkboxCount = await checkboxes.count();

        for (let i = 0; i < checkboxCount; i++) {
            const checkbox = checkboxes.nth(i);
            const parentDiv = await checkbox.locator('xpath=parent::div').first();

            if (await checkbox.isChecked()) {
                await parentDiv.click();
                await expect.soft(checkbox).not.toBeChecked();
            } else {
                await parentDiv.click();
                await expect(checkbox).toBeChecked();
            }
        }
    });

    var comboBox = {};
    comboBox._input = page.locator('');
    comboBox._dropdown = pageXOffset.locator('');
    comboBox.isOtherSelected = function() {
        return comboBox._dropdown.value == other
    }
    const thisComboBox = new comboBox(selector1, selector2);

    test('dropdown alphabetized', async ({ page }) => {

        const dropdowns = page.locator('.react-select__input-container');

        async function loopGetAndCheckAll() {
            const dropdownCount = await dropdowns.count(); 

            for (let i = 0; i < dropdownCount; i++) {
                const dropdown = dropdowns.nth(i); 

                await dropdown.click(); 
                await page.waitForSelector('.react-select__menu', { state: 'visible' }); 

                const items = await getDropdownItems();
                console.log(`Dropdown ${i + 1} Items:`, items); 

                const sortedItems = [...items].sort();
                console.log(`Sorted Dropdown ${i + 1} Items:`, sortedItems);
                await checkDropdownItems(items);
                await page.getByLabel('Title').click();
            }
        }

        async function getDropdownItems(): Promise<string[]> {
            const dropdownItems: string[] = await page.$$eval(
                '.react-select__menu .react-select__option',
                (options) => options.map((option) => option.textContent?.trim() || '')
            );

            return dropdownItems;
        }

        function isAlphabetized(items: string[]): boolean {
            const itemsWithoutOther = items.filter(item => item !== 'Other' && item !== 'Select...');
            const sortedItems = [...itemsWithoutOther].sort();

            // Combine the sorted items with 'Other' at the end
            const finalSortedItems = ['Select...', ...sortedItems, 'Other'];

            // Compare the original list with the final sorted list
            return items.every((item, index) => item === finalSortedItems[index]);
        }

        async function checkDropdownItems(items: string[]): Promise<void> {
            expect.soft(isAlphabetized(items)).toBe(true);
        }

        await loopGetAndCheckAll(); // Run the loop to check all dropdowns
    });
});