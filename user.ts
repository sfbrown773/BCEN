import { test, expect, Page } from '@playwright/test';

export class User {
    page: Page
    firstName:string;
    lastName:string;
    customerId:string;
    state: 'new application' | 'retest' | 'second attempt' | 'expired';

    constructor(page: Page, firstName: string, lastName: string, customerId: string, state: 'new application' | 'retest' | 'second attempt' | 'expired') {
        this.page = page
        this.firstName = firstName;
        this.lastName = lastName;
        this.customerId = customerId;
        this.state = state;
    }
}