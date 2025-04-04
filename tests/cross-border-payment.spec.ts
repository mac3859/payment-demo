import { test, expect } from '@playwright/test';

test.describe('Cross Border Payment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial currency selection options', async ({ page }) => {
    await expect(page.locator('#source-currency')).toHaveValue('USD');
    await expect(page.locator('#target-currency')).toHaveValue('EUR');
  });

  test('should convert currency when amount is entered', async ({ page }) => {
    await page.fill('#amount-input', '100');
    await page.click('#convert-button');
    
    const convertedAmount = await page.locator('#converted-amount');
    await expect(convertedAmount).toBeVisible();
    await expect(convertedAmount).toContainText('90.00'); // Based on mock rate USD to EUR
  });

  test('should handle currency change', async ({ page }) => {
    await page.selectOption('#source-currency', 'USD');
    await page.selectOption('#target-currency', 'GBP');
    await page.fill('#amount-input', '100');
    await page.click('#convert-button');
    
    const convertedAmount = await page.locator('#converted-amount');
    await expect(convertedAmount).toBeVisible();
    await expect(convertedAmount).toContainText('78.00'); // Based on mock rate USD to GBP
  });

  test('should show success message for valid payment', async ({ page }) => {
    await page.fill('#amount-input', '500');
    await page.click('#convert-button');
    await page.click('#proceed-to-payment-button');
    
    const successMessage = page.locator('#payment-status');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Payment Successful');
  });

  test('should show error message for payment exceeding limit', async ({ page }) => {
    await page.fill('#amount-input', '1500');
    await page.click('#convert-button');
    await page.click('#proceed-to-payment-button');
    
    const errorMessage = page.locator('#error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Insufficient funds');
  });
});