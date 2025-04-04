import { useState } from 'react';

interface PaymentState {
  sourceCurrency: string;
  targetCurrency: string;
  amount: string;
  convertedAmount: number | null;
  paymentStatus: string;
  errorMessage: string;
  recipientCountry: string;
  riskWarning: string;
  complianceMessage: string;
  suspiciousActivityWarning: string;
  transactionCount: number;
  lastTransactionTime: number;
  isRegistered: boolean;
  kycStatus: string;
  kycPrompt: string;
}

const MOCK_EXCHANGE_RATES = {
  USD: {
    EUR: 0.9,
    GBP: 0.78
  }
};

export const CrossBorderPayment = () => {
  const [state, setState] = useState<PaymentState>({
    sourceCurrency: 'USD',
    targetCurrency: 'EUR',
    amount: '',
    convertedAmount: null,
    paymentStatus: '',
    errorMessage: '',
    recipientCountry: '',
    riskWarning: '',
    complianceMessage: '',
    suspiciousActivityWarning: '',
    transactionCount: 0,
    lastTransactionTime: 0,
    isRegistered: false,
    kycStatus: '',
    kycPrompt: ''
  });

  const handleCurrencyChange = (currency: string, type: 'source' | 'target') => {
    setState(prev => ({
      ...prev,
      [type === 'source' ? 'sourceCurrency' : 'targetCurrency']: currency,
      convertedAmount: null
    }));
  };

  const handleAmountChange = (value: string) => {
    setState(prev => ({
      ...prev,
      amount: value,
      convertedAmount: null
    }));
  };

  const convertAmount = () => {
    const amount = parseFloat(state.amount);
    if (isNaN(amount)) return;

    const rate = MOCK_EXCHANGE_RATES[state.sourceCurrency as keyof typeof MOCK_EXCHANGE_RATES]?.[state.targetCurrency as keyof typeof MOCK_EXCHANGE_RATES['USD']] || 1;
    const converted = amount * rate;

    setState(prev => ({
      ...prev,
      convertedAmount: converted,
      errorMessage: ''
    }));
  };

  const handlePayment = () => {
    const amount = parseFloat(state.amount);
    const isHighRiskCountry = state.recipientCountry === 'HighRiskCountry';
    const isRestrictedCurrency = state.targetCurrency === 'RestrictedCurrency';
    const now = Date.now();
    const timeSinceLastTransaction = now - state.lastTransactionTime;

    // Reset all warning messages
    setState(prev => ({
      ...prev,
      riskWarning: '',
      complianceMessage: '',
      suspiciousActivityWarning: '',
      errorMessage: ''
    }));

    // Check for restricted currency
    if (isRestrictedCurrency) {
      setState(prev => ({
        ...prev,
        complianceMessage: 'Transactions involving restricted currencies are not allowed',
        paymentStatus: ''
      }));
      return;
    }

    // Check transaction limits for high-risk countries
    if (isHighRiskCountry && amount > 10000) {
      setState(prev => ({
        ...prev,
        riskWarning: 'Transaction exceeds allowed limit for high-risk countries',
        complianceMessage: 'Transaction blocked due to compliance policy',
        paymentStatus: ''
      }));
      return;
    }

    // Check for suspicious activity (rapid consecutive transactions)
    if (timeSinceLastTransaction < 5000 && state.transactionCount >= 3) {
      setState(prev => ({
        ...prev,
        suspiciousActivityWarning: 'Suspicious activity detected. Please verify your identity.',
        paymentStatus: ''
      }));
      return;
    }

    // Process normal payment
    if (amount > 1000) {
      setState(prev => ({
        ...prev,
        errorMessage: 'Insufficient funds',
        paymentStatus: ''
      }));
    } else {
      setState(prev => ({
        ...prev,
        paymentStatus: 'Payment Successful',
        errorMessage: '',
        transactionCount: prev.transactionCount + 1,
        lastTransactionTime: now
      }));
    }
  };

  const handleRegistration = (email: string, password: string) => {
    setState(prev => ({
      ...prev,
      isRegistered: true,
      kycPrompt: 'Please complete KYC verification to proceed with cross-border payments'
    }));
  };

  const handleKYCSubmission = () => {
    setState(prev => ({
      ...prev,
      kycStatus: 'KYC verification successful'
    }));
  };

  return (
    <div className="cross-border-payment">
      {!state.isRegistered && (
        <div className="registration-form">
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
          />
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
          />
          <button
            id="register-button"
            onClick={() => handleRegistration(
              (document.getElementById('email') as HTMLInputElement).value,
              (document.getElementById('password') as HTMLInputElement).value
            )}
          >
            Register
          </button>
        </div>
      )}

      {state.kycPrompt && (
        <div className="kyc-section">
          <div id="kyc-prompt" className="kyc-prompt">
            {state.kycPrompt}
          </div>
          <div className="kyc-upload-section">
            <input
              id="document-upload"
              type="file"
              accept=".pdf,.jpg,.png"
            />
            <button
              id="submit-kyc-button"
              onClick={handleKYCSubmission}
            >
              Submit KYC Documents
            </button>
          </div>
        </div>
      )}

      {state.kycStatus && (
        <div id="kyc-approval" className="kyc-approval">
          {state.kycStatus}
        </div>
      )}
      <div className="currency-selection">
        <select
          id="source-currency"
          value={state.sourceCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value, 'source')}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>

        <select
          id="target-currency"
          value={state.targetCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value, 'target')}
        >
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="RestrictedCurrency">RestrictedCurrency</option>
        </select>
      </div>

      <div className="recipient-info">
        <select
          id="recipient-country"
          value={state.recipientCountry}
          onChange={(e) => setState(prev => ({ ...prev, recipientCountry: e.target.value }))}
        >
          <option value="">Select Country</option>
          <option value="LowRiskCountry">Low Risk Country</option>
          <option value="HighRiskCountry">High Risk Country</option>
        </select>
      </div>

      <div className="amount-input">
        <input
          id="amount-input"
          type="number"
          value={state.amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder="Enter amount"
        />
        <button id="convert-button" onClick={convertAmount}>Convert</button>
      </div>

      {state.convertedAmount !== null && (
        <div id="converted-amount" className="converted-amount">
          Converted Amount: {state.convertedAmount.toFixed(2)} {state.targetCurrency}
        </div>
      )}

      <button id="proceed-to-payment-button" onClick={handlePayment}>Proceed to Payment</button>

      {state.paymentStatus && (
        <div id="payment-status" className="success-message">
          {state.paymentStatus}
        </div>
      )}

      {state.errorMessage && (
        <div id="error-message" className="payment-error-message">
          {state.errorMessage}
        </div>
      )}

      {state.riskWarning && (
        <div id="risk-warning" className="risk-warning-message">
          {state.riskWarning}
        </div>
      )}

      {state.complianceMessage && (
        <div id="compliance-rejection" className="compliance-error-message">
          {state.complianceMessage}
        </div>
      )}

      {state.suspiciousActivityWarning && (
        <div id="suspicious-activity-warning" className="suspicious-activity-warning">
          {state.suspiciousActivityWarning}
        </div>
      )}
    </div>
  );
};