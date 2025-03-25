import { test } from '../userFixtures';
import { expect } from '@playwright/test';

test('New application state check', async ({ getNewApplicationUser }) => {
    const user = getNewApplicationUser();
    console.log(user);
    expect(user.state).toBe('new application');
});

test.skip('Retest user state check', async ({ getRetestUser }) => {
    const user = getRetestUser();
    console.log(user)
    expect(user.state).toBe('retest');
});

test.skip('Second attempt user state check', async ({ getSecondAttemptUser }) => {
    const user = getSecondAttemptUser();
    console.log(user);
    expect(user.state).toBe('second attempt');
});
