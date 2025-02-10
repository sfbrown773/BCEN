import { stat } from "fs";
import { AppPage } from "./page.holder";
import { expect } from "@playwright/test";
import { HomePage } from "./home.page";

export class BackOffice extends AppPage {
    public pagePath = '/'
    public logoutDropdown = this.page.locator('#n2-user-menu-button')
    public recentsButton = this.page.locator('#toggle-recents-menu')
    public johnetteAccount = this.page.getByRole('link', { name: 'badge Johnette K Bennage' });
    public fernandoAccount = this.page.getByRole('link', { name: 'badge Fernando Antonio Chila' });
    //here we go to a different page, so this should technically be a different page
    public loginAsCust = this.page.getByText('Login as this Customer');
    public myAccount = this.page.getByText('My Account');
    
    
   async visit(){
    await this.page.goto('https://dbrown:Catalyst1@online.bcen.org/bcendev/home', {
        waitUntil: 'load', // Wait until network activity has stopped
      })
   }

   async visitJohnetteAccount() {
    await this.page.goto('https://dbrown:Catalyst1@https://online.bcen.org/bcendev/cencustmast.master_pg?q_cust_id=105307&p_app_context=CEN&p_view_menu_id=')
   }

   async clickRecentsButton(){
        await this.recentsButton.click()
    }

    async clickLoginAsCust(){
        await this.loginAsCust.click();
    }

    async clickJohnetteAccount(){
        await this.johnetteAccount.click()
    }

    async clickFernandoAccount(){
        await this.fernandoAccount.click()
    }

    async clickMyAccount(){
        await this.myAccount.click()
    }

    async setUsernameFilled(email:string){
       // await this.userName.type(email);
    }  
    async removeSubmittal() {
    // Launch the browser and create a new page
    const thisUrl = this.page.url();
    // Use a regular expression to find two sequences of exactly six digits
    const match = thisUrl.match(/(\d{6})\D+(\d{6})/);
    console.log(match);

    if (match) {
    const submittalNum = match[1];
    const workflowNum = match[2];
    console.log(`Submittal Number: ${submittalNum}`);
    console.log(`Workflow Number: ${workflowNum}`);
    await this.page.goto(`https://online.bcen.org/bcendevssa/acgiapps.cf_remove_submittal?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
    await expect(this.page.locator('body')).toHaveText(`Submittal ${submittalNum} Removed`);
    } else {
    console.log('No matching sequences of six numbers found in the URL.');
    }
    }

    async getSubmitAndWorkNums(flow: string) {
        const flowTextMap: Record<string, string> = {
            CTRN: 'Certified Transport Registered',
            CBRN: 'Certified Burn Registered',
            CEN: 'Certified Emergency Nurse',
            CFRN: 'Certified Flight Registered',
            CPEN: 'Certified Pediatric Emergency',
            TCRN: 'Trauma Certified Registered'
        };
        await this.page.goto('https://online.bcen.org/bcendevssa/f?p=700:2222:7932820419680:');
        // Ensure the flow is valid
        const flowText = flowTextMap[flow];
        if (!flowText) {
            throw new Error(`Invalid flow: ${flow}. Please provide a valid flow.`);
        }
    
        // Construct locators dynamically
        const buttonLocator = this.page.locator('li.cert-list-item').filter({ hasText: new RegExp(flowText) });
        const linkLocator = buttonLocator.locator('a');
        const thisUrl = await linkLocator.getAttribute('href');

        let submittalNum: string | undefined;
        let workflowNum: string | undefined;
        
        if (thisUrl) {
            // Extract only the value after `p_itemvalues=`
            const match = thisUrl.match(/p_itemvalues=([^&]+)/);
        
            if (match) {
                // Split values by comma
                const values = match[1].split(',');
        
                // Extract the first two valid six-digit numbers
                const sixDigitNumbers = values.filter(num => /^\d{6}$/.test(num));
        
                if (sixDigitNumbers.length >= 2) {
                    submittalNum = sixDigitNumbers[0];  // First six-digit number
                    workflowNum = sixDigitNumbers[1]; 
                }
            }
        }
    return { submittalNum, workflowNum };
}
async checkAppStatus(status:string, flow:string) {

const {submittalNum, workflowNum} = await this.getSubmitAndWorkNums(flow);
if (submittalNum) { // Make sure submittalNum is defined before proceeding
    await this.visit();
    await this.clickRecentsButton();
    await this.clickJohnetteAccount();
    const frame = await this.page.frameLocator('iframe').first();
    const cellInRow = await frame.getByText(submittalNum);
    const row = await cellInRow.locator('xpath=ancestor::tr'); // Use XPath to find the <tr> ancestor
    // Find the cell in the same row that contains "Military_Review"
    const statusCell = await row.locator('td', { hasText: status });
    // Highlight in red
    //await statusCell.evaluate(node => node.style.border = '3px solid red');
    // Assert that the status cell contains the correct text
    await expect(statusCell).toContainText(status);
} else {
    console.log('submittalNum not found');
}
}

async goToSubmittalInBO(flow:string) {
    const {submittalNum, workflowNum} = await this.getSubmitAndWorkNums(flow);
    if (submittalNum && workflowNum) {
        await this.page.goto(`https://dbrown:Catalyst1@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
        return { submittalNum, workflowNum };
    } else {
        console.log('Submittal or workflow number is undefined.');
        return { submittalNum: undefined, workflowNum: undefined }; 
    }
}
async clickMessageSummaryTab() {
    await this.page.getByRole('link', { name: 'Message Summary', exact: true }).click();
}
async checkEmails(emailTitle1:string, emailTitle2:string, date: string) {
    await this.visit();
    await this.clickRecentsButton();
    await this.clickJohnetteAccount();
    await this.page.getByRole('link', { name: 'Message Summary', exact: true }).click();
    await this.page.waitForLoadState('networkidle');

    for (let i = 0; i < 30; i++) {  // Retry 30 times, waiting 5 seconds between each
        const cellText = await this.page.locator('table.aaTabularTable tbody tr').first().locator('td').nth(1).textContent();
            console.log(`Attempt ${i + 1}:`, cellText);
        
            if (cellText !== null && cellText > date) {
                    const firstText = await this.page.locator('table.aaTabularTable tbody tr').first().locator('td').nth(5).textContent();
                    const secondText = await this.page.locator('table.aaTabularTable tbody tr').nth(1).locator('td').nth(5).textContent();
                    console.log(firstText, secondText);
                    
                    // Check either/or condition
                    if (firstText?.includes(emailTitle1) && secondText?.includes(emailTitle2)) {
                        await expect(this.page.locator('table.aaTabularTable tbody tr').first().locator('td').nth(5)).toContainText(emailTitle1);
                        await expect(this.page.locator('table.aaTabularTable tbody tr').nth(1).locator('td').nth(5)).toContainText(emailTitle2);
                        break;
                    } else if (firstText?.includes(emailTitle2) && secondText?.includes(emailTitle1)) {
                        await expect(this.page.locator('table.aaTabularTable tbody tr').first().locator('td').nth(5)).toContainText(emailTitle2);
                        await expect(this.page.locator('table.aaTabularTable tbody tr').nth(1).locator('td').nth(5)).toContainText(emailTitle1);
                        break;
                    } else {
                        // If neither condition is met, log an error or fail the test
                        throw new Error('The texts in the two cells do not match the expected conditions.');
                    }
            }
            await this.page.waitForTimeout(5000); // Wait 5 seconds before retrying
            await this.page.reload();
      }
}
async checkEmailsVariable(date:string, ...emailTitles: string[]) {
    await this.visit();
    await this.clickRecentsButton();
    await this.clickJohnetteAccount();
    await this.page.getByRole('link', { name: 'Message Summary', exact: true }).click();
    await this.page.waitForLoadState('networkidle');

    for (let i = 0; i < 30; i++) {  // Retry 30 times, waiting 5 seconds between each
        // Get timestamps for the same number of rows as emailTitles
        const cellTimestamps = await Promise.all(
            emailTitles.map((_, index) =>
                this.page.locator('table.aaTabularTable tbody tr').nth(index).locator('td').nth(1).textContent()
            )
        );

        console.log(`Attempt ${i + 1}:`, cellTimestamps, 'time at start:', date);

        // Check if all required emails have timestamps greater than `date`
        const allEmailsArrived = cellTimestamps.every(timestamp => timestamp !== null && timestamp > date);

        if (allEmailsArrived) {
            // Extract email texts from the same number of rows
            const emailTexts = await Promise.all(
                emailTitles.map((_, index) =>
                    this.page.locator('table.aaTabularTable tbody tr').nth(index).locator('td').nth(5).textContent()
                )
            );

            console.log("Extracted email texts:", emailTexts);

            // Ensure all expected email titles exist, regardless of order
            const allMatch = emailTitles.every(title => emailTexts.some(text => text?.includes(title)));

            if (allMatch) {
                for (let j = 0; j < emailTitles.length; j++) {
                    const expectedTitle = emailTitles[j];
                    const matchingIndex = emailTexts.findIndex(text => text?.includes(expectedTitle));

                    if (matchingIndex !== -1) {
                        await expect(
                            this.page.locator('table.aaTabularTable tbody tr').nth(matchingIndex).locator('td').nth(5)
                        ).toContainText(expectedTitle);
                    }
                }
                break;
            } else {
                console.error('The email titles do not match the expected conditions.');
                throw new Error('Email validation failed.');
            }
        }

        await this.page.waitForTimeout(5000); // Wait 5 seconds before retrying
        await this.page.reload();
        await this.page.getByRole('link', { name: 'Message Summary', exact: true }).click();
        await this.page.waitForLoadState('networkidle');
    }
}

async getCurrentDate() {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 8);
    currentDate.setMinutes(currentDate.getMinutes() - 1);

    // Format the date and time as "MM/DD/YYYY HH:mm:ss"
    const formattedDateTime = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/` +  // Get month (1-12), pad with zero
                                `${currentDate.getDate().toString().padStart(2, '0')}/` +        // Get day (1-31), pad with zero
                                `${currentDate.getFullYear()} ` +                                 // Get full year (e.g., 2025)
                                `${currentDate.getHours().toString().padStart(2, '0')}:` +       // Get hours (00-23), pad with zero
                                `${currentDate.getMinutes().toString().padStart(2, '0')}:` +     // Get minutes (00-59), pad with zero
                                `${currentDate.getSeconds().toString().padStart(2, '0')}`;       // Get seconds (00-59), pad with zero
    return formattedDateTime
}



async reviewMil(choice:string, flow:string) {
    await this.goToSubmittalInBO(flow);
    await this.page.getByRole('link', { name: 'Staff - Review Documentation' }).click();
    await this.page.getByLabel(choice).check();
    await this.page.getByRole('button', { name: 'Next' }).click();
    if (choice === "Need More Information") {
        await this.page.getByRole('link', { name: 'Staff > Need More Information' }).click();
        await expect(this.page.locator('#aaSbmHeaderSubmittalStatus')).toContainText('Status: Need More Information for Military Documentation');
    } else {
    await this.page.getByRole('link', { name: 'Move Application back to' }).click();
    }
}
async reviewIntlRN(choice:string, flow:string) {
    
    await this.goToSubmittalInBO(flow);
    await this.page.getByRole('link', { name: 'Staff - Decision' }).click();
    await this.page.getByLabel(choice).check();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.locator('#STDBtnRegion a').click();
    //await this.page.getByRole('link', { name: `${choice} > Move Application` }).click();
}
async reviewAccom(choice:string, flow:string) {
    
    await this.goToSubmittalInBO(flow);
    await this.page.getByRole('link', { name: 'Staff - Approved' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();
    if ( choice === 'Approve') {
        await this.page.getByRole('link', { name: 'Staff > Exam Eligible', exact: true }).click();
    } else if (choice === 'Reject') {
        await this.page.getByRole('link', { name: 'Staff > Exam Eligible Accommodation Rejected' }).click();
    } else if (choice === 'NMI') {
        await this.page.getByRole('link', { name: 'Staff > Accommodation NMI' }).click();
    } else {
        console.log('Function argument must be one of the following: Approve, Reject, or NMI.');
    }
    await this.page.waitForLoadState('networkidle');
}

}