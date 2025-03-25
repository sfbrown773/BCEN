import { test, expect } from '@playwright/test';

test.describe('CBRN Tests', () => {
    // This will apply metadata for the whole group of tests
    test.beforeEach(() => {
        // Setting up custom annotations for all tests
        test.info().annotations = [
          { type: 'international', description: 'Y' },
          { type: 'military', description: 'N' },
          { type: 'societyMembership', description: 'Y' },
          { type: 'examAccommodations', description: 'N' },
          { type: 'testAssurance', description: 'Y' },
          { type: 'rnAudit', description: 'N' },
          { type: 'emailSent', description: 'Y' },
        ];
      });

test('basic test to check reporter functionality', async ({ page }) => {
  // This will simulate a successful test
  //expect(true).toBe(true); // This should pass

  // Simulate a failing test to test the error handling in the reporter
  // Uncomment this line to trigger a failure
   expect(false).toBe(true); // This will fail
});
});
