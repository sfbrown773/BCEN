import { expect } from "@playwright/test";
import { Flow } from "../flows.page";

export class Checkout extends Flow {
    public pagePath = `/`

    public voucherErrorPopup = this.page.getByText('Error Using Voucher');
    public closeButtonVoucherPopup = this.page.getByRole('button', { name: ' Close' });
    public addVoucherButton = this.page.getByRole('button', { name: 'Add', exact: true });
    public checkoutItem = this.page.getByRole('cell', { name: 'CEN Initial Exam' });
    public paymentOptions = this.page.getByLabel('Payment Options');
    public creditCardOptions = this.page.getByLabel('Payment Type *');
    public recaptchaDiv = this.page.locator('#aaReCaptchaDiv');
    public submitButton = this.page.getByLabel('Use A New Payment Type').getByRole('button', { name: 'Submit' });
    public submitCheckButton = this.page.getByRole('button', { name: 'Check (organizations only)' });
    public checkoutTable = this.page.locator('table.t-Report-report tbody')

    public prices = {
          priceNoMembershipYesTestAssurance: '450.00',
          priceNoMembershipNoTestAssurance: '380.00',
          priceYesMembershipYesTestAssurance: '355.00',
          priceYesMembershipNoTestAssurance_CEN: '240.00',
          priceYesMembershipNoTestAssurance_others: '285.00',
          priceYesMilitaryYesTestAssurance: '265.00',
          priceYesMilitaryNoTestAssurance: '195.00',
          priceRetest: '200.00',
          priceSecondAttempt: '0.00'
        }

    async clearCheckout() {
        // Get all rows with the desired structure
        const deleteButtons = this.page.getByRole('link', { name: '' });
      
        // Iterate through each row
        const buttonCount = await deleteButtons.count();
        for (let i = 0; i < buttonCount; i++) {
          const deleteLink = deleteButtons.nth(i);
      
          // Attach a one-time event listener to handle the dialog
          this.page.once('dialog', async dialog => {
            await dialog.accept(); // Accept the dialog
          });
      
          // Click the delete link
          await deleteLink.click();
        }
      };

    async clickAddVoucher() {
        await this.addVoucherButton.click();
    }
    async selectPaymentOption(option:string) {
        await this.paymentOptions.selectOption(option);
       }
       async selectCreditCard(option:string) {
        await this.creditCardOptions.selectOption(option);
       }
    async clickCloseVoucherError() {
        await this.closeButtonVoucherPopup.click();
    }
    async clickSubmitCheckout() {
        await this.submitButton.click();
    }
    async clickSubmitCheck() {
        await this.submitCheckButton.click();
    }
}