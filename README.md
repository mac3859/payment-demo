

# Payment Service Test Suite

This repository contains comprehensive test suites for our payment service, covering both API-level testing with Karate and end-to-end testing with Playwright.

## Test Coverage

### 1. Payment API Tests (Karate)

Location: [`src/test/java/karate/payment/payment-api.feature`](src/test/java/karate/payment/payment-api.feature)

Key test scenarios:
- Payment Idempotency Validation
  - Ensures duplicate transactions are prevented using idempotency keys
  - Verifies error handling for requests without idempotency protection
- GDPR Compliance
  - Validates proper masking of sensitive customer data
  - Tests data protection for personal information, payment details, and timestamps

### 2. Risk Control Tests (Playwright)

Location: 
- [`tests/cross-border-risk-control.spec.ts`](tests/cross-border-risk-control.spec.ts)
- [`tests/cross-border-payment.spec.ts`](tests/cross-border-payment.spec.ts)

Key test scenarios:
- Transaction Limits
  - Validates limits for high-risk countries
  - Tests compliance rejection for exceeded limits
- Suspicious Activity Detection
  - Monitors and flags rapid consecutive transactions
  - Tests user verification triggers
- Restricted Currency Compliance
  - Validates blocks on restricted currency transactions
  - Tests compliance error messaging
- KYC Process Validation
  - Tests user registration and document upload
  - Verifies KYC approval workflow

## Running the Tests

### Running Playwright Tests

1. npm run dev - starts the Vite development server for the React TypeScript application.
2. npx playwright test - Playwright end-to-end tests in the project

### Karate Tests - script only

script only. Endpoints are for demo purposes only.
 
### Test Results Screenshot

![Screenshot 2025-04-04 at 2 12 51 pm](https://github.com/user-attachments/assets/0926bdd8-e905-4086-9c2c-3e4e22f20664)

The screenshot above shows the actual test execution results from a sample test run.
