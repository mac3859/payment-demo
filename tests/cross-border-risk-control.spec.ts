import { test, expect } from '@playwright/test';

// Test suite for cross-border risk control scenarios
test.describe('Cross-Border Risk Control Testing', () => {
  // Scenario 1: Validate transaction limits for cross-border payments
  test('Validate transaction limits for high-risk countries', async ({ page }) => {
    // Navigate to the payment page
    await page.goto('/');

    // Select a high-risk country (e.g., sanctioned country)
    await page.selectOption('#recipient-country', 'HighRiskCountry');

    // Enter an amount exceeding the allowed limit
    await page.fill('#amount-input', '50000'); // Exceeds $10,000 limit
    await page.click('#convert-button');
    await page.click('#proceed-to-payment-button');

    // Verify risk warning message
    await expect(page.locator('#risk-warning')).toHaveText(
      'Transaction exceeds allowed limit for high-risk countries'
    );

    // Verify compliance rejection
    await expect(page.locator('#compliance-rejection')).toHaveText(
      'Transaction blocked due to compliance policy'
    );
  });

  // Scenario 2: Detect suspicious activity (rapid consecutive transactions)
  test('Detect suspicious activity during rapid consecutive transactions', async ({ page }) => {
    // Navigate to the payment page
    await page.goto('/');

    // Perform three rapid transactions
    for (let i = 0; i < 3; i++) {
      await page.selectOption('#recipient-country', 'LowRiskCountry');
      await page.fill('#amount-input', '1000');
      await page.click('#convert-button');
      await page.click('#proceed-to-payment-button');
      await page.waitForSelector('#payment-status', { timeout: 5000 });
    }

    // Perform a fourth transaction to trigger suspicious activity detection
    await page.selectOption('#recipient-country', 'LowRiskCountry');
    await page.fill('#amount-input', '1000');
    await page.click('#convert-button');
    await page.click('#proceed-to-payment-button');

    // Verify suspicious activity warning
    await expect(page.locator('#suspicious-activity-warning')).toHaveText(
      'Suspicious activity detected. Please verify your identity.'
    );
  });

  // Scenario 3: Compliance check for restricted currencies
  test('Block transactions involving restricted currencies', async ({ page }) => {
    // Navigate to the payment page
    await page.goto('/');

    // Select a restricted currency (e.g., cryptocurrency)
    await page.selectOption('#target-currency', 'RestrictedCurrency');

    // Enter payment details
    await page.fill('#amount-input', '500');
    await page.click('#convert-button');
    await page.click('#proceed-to-payment-button');

    // Verify compliance rejection
    await page.waitForSelector('.compliance-error-message');
    await expect(page.locator('.compliance-error-message')).toHaveText(
      'Transactions involving restricted currencies are not allowed'
    );
  });

  // Scenario 4: Validate KYC (Know Your Customer) process
  test('Validate KYC process for new users', async ({ page }) => {
    // Navigate to the registration page
    await page.goto('/');

    // Register a new user
    const randomEmail = `user-${Math.random().toString(36).substring(7)}@example.com`;
    await page.waitForSelector('#email', { timeout: 5000 });
    await page.fill('#email', randomEmail);
    await page.fill('#password', 'SecurePassword123!');
    await page.click('#register-button');

    // Verify KYC verification prompt
    await expect(page.locator('#kyc-prompt')).toHaveText(
      'Please complete KYC verification to proceed with cross-border payments'
    );

    // Simulate uploading documents
    await page.setInputFiles('#document-upload', 'tests/mock-document.pdf');
    await page.click('#submit-kyc-button');

    // Verify KYC approval
    await expect(page.locator('#kyc-approval')).toHaveText('KYC verification successful');
  });
});