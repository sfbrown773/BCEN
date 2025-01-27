import type { Page } from '@playwright/test';

export class PageHolder { 
    constructor(protected page: Page) { }
}
export  class Component extends PageHolder {

}

export abstract class AppPage extends Component {
    /**
     * Path to the page can be relative to the baseUrl defined in playwright.config.ts
     * or absolute (on your own risk)
     */
    public abstract pagePath: string;

    /**
     * Opens the page in the browser and expectLoaded should pass
     */
    async open(path?: string) {
        await this.page.goto(path ?? this.pagePath);
    }
}
