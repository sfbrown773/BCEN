import { test as base, expect } from '@playwright/test';
import { UserManager } from './userManager';
import { User } from './user';

export const test = base.extend<{ userManager: UserManager, getNewApplicationUser: () => User, getRetestUser: () => User, getSecondAttemptUser: () => User }>({
    userManager: async ({ page }, use) => {
        const userManager = new UserManager();

        // Set the minimum number of users per state
        const targetCounts = {
            'new application': 5,
            'retest': 4,
            'second attempt': 4,
            'no good': 0
        };

        // Ensure enough users exist
        await userManager.initializeUsers(page, targetCounts);

        await use(userManager);

        // Replenish after tests finish
        await userManager.replenishUsers(page, targetCounts);
    },

    getNewApplicationUser: async ({ userManager }, use) => {
        await use(() => userManager.getUser('new application'));
    },

    getRetestUser: async ({ userManager }, use) => {
        await use(() => userManager.getUser('retest'));
    },

    getSecondAttemptUser: async ({ userManager }, use) => {
        await use(() => userManager.getUser('second attempt'));
    }
});