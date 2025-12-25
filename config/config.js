/**
 * Configuration Module
 * Centralized configuration for the application
 */

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'uktax_secret_key',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },
  
  // UK Tax Rates (2024/25 Tax Year)
  ukTaxRates: {
    vat: {
      standard: 0.20,      // 20%
      reduced: 0.05,       // 5%
      zero: 0.00          // 0%
    },
    incomeTax: {
      personalAllowance: 12570,
      bands: [
        { min: 0, max: 12570, rate: 0.00, name: 'Personal Allowance' },
        { min: 12571, max: 50270, rate: 0.20, name: 'Basic Rate' },
        { min: 50271, max: 125140, rate: 0.40, name: 'Higher Rate' },
        { min: 125140, max: Infinity, rate: 0.45, name: 'Additional Rate' }
      ]
    },
    nationalInsurance: {
      employee: [
        { min: 0, max: 12570, rate: 0.00, name: 'Below Threshold' },
        { min: 12571, max: 50270, rate: 0.12, name: 'Standard Rate' },
        { min: 50271, max: Infinity, rate: 0.02, name: 'Additional Rate' }
      ]
    },
    corporationTax: {
      smallProfitsRate: 0.19,        // 19% for profits up to £50,000
      mainRate: 0.25,                 // 25% for profits over £250,000
      smallProfitsThreshold: 50000,
      mainRateThreshold: 250000
    }
  }
};
