import { AppPage } from "./page.holder";
import { expect } from "@playwright/test";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export class BackOffice extends AppPage {
    public pagePath = '/'
    public logoutDropdown = this.page.locator('#n2-user-menu-button')
    public recentsButton = this.page.locator('#toggle-recents-menu')
    public johnetteAccount = this.page.getByRole('link', { name: 'badge Johnette K Bennage' });
    public jaredAccount = this.page.getByRole('link', { name: 'badge Jared TEST' });
    public fernandoAccount = this.page.getByRole('link', { name: 'badge Fernando Antonio Chila' });
    public jenniferAccount = this.page.getByRole('link', { name: 'badge Jennifer Morgan Perry' });
    //here we go to a different page, so this should technically be a different page
    public loginAsCust = this.page.getByText('Login as this Customer');
    public myAccount = this.page.getByText('My Account');
    
    
    async visit() {
        const encodedCredentials = Buffer.from(`${process.env.AA_BACKOFFICE_USERNAME}:${process.env.AA_BACKOFFICE_PASSWORD}`).toString('base64');
        await this.page.setExtraHTTPHeaders({
          'Authorization': `Basic ${encodedCredentials}`
        });
        
        await this.page.goto(process.env.AA_BACKOFFICE_URL!);
    }

   async visitUserAccount() {
    await this.visit();
    await this.clickRecentsButton();
    await this.clickUserAccount();
}

   async clickRecentsButton(){
        await this.recentsButton.click()
    }

    async clickLoginAsCust(){
        await this.loginAsCust.click();
    }

    async clickUserAccount(){
        await this.jenniferAccount.click()
        //Jennifer, Jared, Johnette, Fernando
    }

    async clickMyAccount(){
        await this.myAccount.click()
    }

    async setUsernameFilled(email:string){
       // await this.userName.type(email);
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
async checkAppStatus(status:string, flow:string, submittalNum) {

if (submittalNum) { // Make sure submittalNum is defined before proceeding
    await this.visit();
    await this.clickRecentsButton();
    await this.clickUserAccount();
    const frame = await this.page.frameLocator('iframe').first();
    const cellInRow = await frame.getByText(submittalNum).first();
    const row = await cellInRow.locator('xpath=ancestor::tr');
    const statusCell = await row.locator('td', { hasText: new RegExp(`^${status}$`) });
    await frame.getByRole('link', { name: 'Application Created On' }).click();
    await frame.getByRole('button', { name: '' }).click();
    await statusCell.waitFor({ state: 'visible' });
    // Highlight in red
    //await statusCell.evaluate(node => node.style.border = '3px solid red');
    await expect(statusCell).toContainText(status);
} else {
    console.log('submittalNum not found');
}
}

async goToSubmittalInBO(flow:string) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
        throw new Error("Missing credentials in environment variables");
    }
    const {submittalNum, workflowNum} = await this.getSubmitAndWorkNums(flow);
    if (submittalNum && workflowNum) {
        await this.page.goto(`https://${username}:${password}@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
        return { submittalNum, workflowNum };
    } else {
        console.log('Submittal or workflow number is undefined.');
        return { submittalNum: undefined, workflowNum: undefined }; 
    }
}
async clickMessageSummaryTab() {
    await this.page.getByRole('link', { name: 'Message Summary', exact: true }).click();
}
async checkEmailsVariable(date:string, ...emailTitles: string[]) {
    await this.visit();
    await this.clickRecentsButton();
    await this.clickUserAccount();
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
    currentDate.setMinutes(currentDate.getMinutes() - 2);

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
async updateExamStatus(flow:string, status:string) {
    //locator(#aaVerticalLinks ul li).getByText
    const frame = this.page.locator('#iframe_51000001261');
    const possibleOverrideLink = this.page.locator('#aaVerticalLinks').getByText('OVERRIDE USE WITH CAUTION Continue > Exam Authorized')
    //await frame.getByRole('link', { name: 'Staff - Exam Authorization (Limited' }).evaluate(node => node.style.border = '3px solid red');
    if (await possibleOverrideLink.isVisible()){
        possibleOverrideLink.click();
    }
    //frame.contentFrame()
    await this.page.getByRole('link', { name: 'Staff - Exam Authorization (' }).click({delay:70});//
    await this.page.waitForLoadState('load');
    await this.page.getByRole('link', { name: 'Edit' }).click();
    await this.page.waitForLoadState('load');
    //await this.page.locator('#P2100_LEVEL1').selectOption(flow);//
    const resultCode = this.page.getByLabel('Result Code');//
    const psiCode = this.page.getByLabel('PSI Status');//
    const psiMessage = this.page.locator('#aaAttrty_PSIMESSAGE textarea');
    await psiMessage.fill('');
    if (status === 'P') {
        await resultCode.fill('P');
        await psiCode.fill('PASSED');
    } else if (status === 'F') {
        await resultCode.fill('F');
        await psiCode.fill('FAILURE');

    } else {
        throw new Error('Enter either F or P.');
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const yyyy = tomorrow.getFullYear();
    const formattedDate = `${mm}/${dd}/${yyyy}`
    await this.page.getByLabel('End Date').fill(formattedDate);//
    await this.page.getByRole('button', { name: 'Save' }).click();//

    if ( status === 'P') {
        await this.page.getByRole('link', { name: 'Staff > Certified' }).click();//
    } else if ( status === 'F' ) {
        await this.page.getByRole('link', { name: 'Staff > Failed' }).click();//
    } else {
        throw Error
    }
    await this.page.waitForLoadState('networkidle');
}

async revertCertifiedToNewApp() {
    await this.page.getByRole('link', { name: 'Certifications Held' }).click();
  await this.page.locator('#iframe_51000000365').contentFrame().getByRole('link', { name: 'Details' }).nth(1).click();
  await this.page.locator('#iframe_51000000365').contentFrame().getByRole('row', { name: 'Update Certified 02/11/2025' }).getByRole('link').click();
  await this.page.goto('https://online.bcen.org/bcendev/crtwebapp.update_cert?p_cust_id=105307&p_cert_ty=CBRN&p_spec_ty=CBRN&p_level_id=CERTIFIED&p_period_serno=847122');
  await this.page.getByRole('link', { name: 'Apply For a New Certificate' }).click();
  await this.page.locator('#section-header').click();
  await this.page.getByRole('link', { name: 'Certified Burn Registered' }).click();
  await this.page.locator('#selLDS_chzn_o_2').click();
  await this.page.getByRole('link', { name: 'Certified Burn Registered' }).click();
  //await page.locator('#selLDS_chzn_o_6').click(); THIS IS TO RETIRE
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await this.page.getByRole('button', { name: 'Submit' }).click();
}

async convertFailedToSecondApp(submittalNum:string, workflowNum:string) {

    const encodedCredentials = Buffer.from(`${process.env.AA_BACKOFFICE_USERNAME}:${process.env.AA_BACKOFFICE_PASSWORD}`).toString('base64');
    await this.page.setExtraHTTPHeaders({
      'Authorization': `Basic ${encodedCredentials}`
    });
    
    await this.page.goto(process.env.AA_BACKOFFICE_URL! + `/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);

    

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const formattedDate = threeMonthsAgo.toLocaleDateString('en-US');

    await this.page.getByRole('link', { name: 'Staff - Application Information' }).click();
    await this.page.getByRole('textbox', { name: 'Exam Fail Date' }).click();
    await this.page.getByRole('textbox', { name: 'Exam Fail Date' }).fill(formattedDate);
    await this.page.getByRole('button', { name: 'Save' }).click();
    //await expect(page.locator('#ui-id-4')).toContainText('Updates Successful!');
    await expect(this.page.locator('#ui-id-4 div').filter({ hasText: 'Updates Successful!' }).nth(1)).toBeVisible();
}
async revertFailedToNewApp(submittalNum:string, workflowNum:string) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
        throw new Error("Missing credentials in environment variables");
    }

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const formattedDate = twoYearsAgo.toLocaleDateString('en-US');

    await this.visitUserAccount();
    await this.page.goto(`https://${username}:${password}@online.bcen.org/bcendev/sbmssamysubmittals.review_page?p_submittal_serno=${submittalNum}&p_wkf_serno=${workflowNum}`);
    await this.page.getByRole('link', { name: 'Staff - Application Information' }).click();
    await this.page.getByRole('textbox', { name: 'Exam Fail Date' }).click();
    await this.page.getByRole('textbox', { name: 'Exam Fail Date' }).fill(formattedDate);
    await this.page.getByRole('button', { name: 'Save' }).click();
    //await expect(page.locator('#ui-id-4')).toContainText('Updates Successful!');
    await expect(this.page.locator('#ui-id-4 div').filter({ hasText: 'Updates Successful!' }).nth(1)).toBeVisible();
}
async setToRetired() {
    await this.visitUserAccount();
        await this.page.getByRole('link', { name: 'Certifications Held' }).click();
        const iframe = await this.page.locator('#iframe_51000000365').contentFrame();

        // Find the cell that contains the text 'Certified Burn Registered Nurse (CBRN)'
        const cbrnCell = iframe.locator('td', { hasText: 'Certified Burn Registered Nurse (CBRN)' });
        await cbrnCell.evaluate(node => node.style.border = '3px solid red');

        // Traverse to the sibling element with the role 'link' and name 'Details'
        const detailsLink = cbrnCell.locator('xpath=preceding-sibling::td//a[text()="Details"]');
        await detailsLink.evaluate(node => node.style.border = '3px solid red');

        // Click on the link (or perform other actions)
        await detailsLink.click();
        //await this.page.locator('#iframe_51000000365').contentFrame().getByRole('link', { name: 'Details' }).nth(1).click();

        //CHANGE THIS
        //await this.page.locator('#iframe_51000000365').contentFrame().getByLabel('Region = Current').getByRole('rowgroup').click();
        const updateCell = this.page.locator('#iframe_51000000365').contentFrame().locator('td[headers="aaCRTCurrentAction"]');
        await updateCell.evaluate(node => node.style.border = '3px solid red');
        await updateCell.click();
        await this.page.getByRole('link', { name: 'Apply For a New Certificate' }).click();
        await this.page.getByRole('link', { name: 'Certified Burn Registered' }).click();
        await this.page.getByRole('textbox').fill('Certified Burn Registered Nurse (CBRN) - Certified Burn Registered Nurse - Retired');
        await this.page.getByRole('heading', { name: 'Certification Application' }).click();
        
        await this.page.getByRole('button', { name: 'Continue' }).click();
        await this.page.getByRole('button', { name: 'Submit' }).click();
}
}