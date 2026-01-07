/**
 * UK Tax Calculation Service
 * Real-time tax calculations based on UK tax rates and rules
 */

const config = require('../config/config');

class TaxService {
  /**
   * Calculate VAT for a transaction
   * @param {number} amount - Net amount
   * @param {string} vatRate - 'standard', 'reduced', or 'zero'
   * @returns {object} VAT calculation details
   */
  static calculateVAT(amount, vatRate = 'standard') {
    const rates = config.ukTaxRates.vat;
    let rate = 0;
    
    switch (vatRate.toLowerCase()) {
      case 'standard':
        rate = rates.standard;
        break;
      case 'reduced':
        rate = rates.reduced;
        break;
      case 'zero':
        rate = rates.zero;
        break;
      default:
        rate = rates.standard;
    }
    
    const vatAmount = amount * rate;
    const grossAmount = amount + vatAmount;
    
    return {
      netAmount: parseFloat(amount.toFixed(2)),
      vatRate: rate,
      vatRatePercentage: (rate * 100).toFixed(2) + '%',
      vatAmount: parseFloat(vatAmount.toFixed(2)),
      grossAmount: parseFloat(grossAmount.toFixed(2))
    };
  }
  
  /**
   * Calculate Income Tax for an individual
   * @param {number} income - Annual gross income
   * @returns {object} Income tax calculation details
   */
  static calculateIncomeTax(income) {
    const bands = config.ukTaxRates.incomeTax.bands;
    let totalTax = 0;
    const breakdown = [];
    
    for (const band of bands) {
      if (income > band.min) {
        const taxableInBand = Math.min(income, band.max) - band.min;
        const taxInBand = taxableInBand * band.rate;
        
        if (taxableInBand > 0) {
          breakdown.push({
            band: band.name,
            taxableAmount: parseFloat(taxableInBand.toFixed(2)),
            rate: (band.rate * 100).toFixed(2) + '%',
            tax: parseFloat(taxInBand.toFixed(2))
          });
          
          totalTax += taxInBand;
        }
      }
    }
    
    return {
      grossIncome: parseFloat(income.toFixed(2)),
      totalTax: parseFloat(totalTax.toFixed(2)),
      netIncome: parseFloat((income - totalTax).toFixed(2)),
      effectiveRate: income > 0 ? ((totalTax / income) * 100).toFixed(2) + '%' : '0.00%',
      breakdown
    };
  }
  
  /**
   * Calculate National Insurance Contributions
   * @param {number} income - Annual gross income
   * @returns {object} NI calculation details
   */
  static calculateNationalInsurance(income) {
    const bands = config.ukTaxRates.nationalInsurance.employee;
    let totalNI = 0;
    const breakdown = [];
    
    for (const band of bands) {
      if (income > band.min) {
        const niableInBand = Math.min(income, band.max) - band.min;
        const niInBand = niableInBand * band.rate;
        
        if (niableInBand > 0) {
          breakdown.push({
            band: band.name,
            niableAmount: parseFloat(niableInBand.toFixed(2)),
            rate: (band.rate * 100).toFixed(2) + '%',
            contribution: parseFloat(niInBand.toFixed(2))
          });
          
          totalNI += niInBand;
        }
      }
    }
    
    return {
      grossIncome: parseFloat(income.toFixed(2)),
      totalNI: parseFloat(totalNI.toFixed(2)),
      netIncome: parseFloat((income - totalNI).toFixed(2)),
      effectiveRate: income > 0 ? ((totalNI / income) * 100).toFixed(2) + '%' : '0.00%',
      breakdown
    };
  }
  
  /**
   * Calculate Corporation Tax
   * @param {number} profit - Annual company profit
   * @returns {object} Corporation tax calculation details
   */
  static calculateCorporationTax(profit) {
    const { smallProfitsRate, mainRate, smallProfitsThreshold, mainRateThreshold } = 
      config.ukTaxRates.corporationTax;
    
    let tax = 0;
    let rate = 0;
    let description = '';
    
    if (profit <= smallProfitsThreshold) {
      // Small profits rate
      tax = profit * smallProfitsRate;
      rate = smallProfitsRate;
      description = 'Small Profits Rate';
    } else if (profit >= mainRateThreshold) {
      // Main rate
      tax = profit * mainRate;
      rate = mainRate;
      description = 'Main Rate';
    } else {
      // Marginal relief applies
      // UK formula: marginalRelief = ((upper threshold - profit) / upper threshold) * rate difference * profit
      const marginalRelief = ((mainRateThreshold - profit) / mainRateThreshold) * 
                             (mainRate - smallProfitsRate) * profit;
      tax = (profit * mainRate) - marginalRelief;
      rate = tax / profit;
      description = 'Marginal Relief Applied';
    }
    
    return {
      profit: parseFloat(profit.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      netProfit: parseFloat((profit - tax).toFixed(2)),
      rate: (rate * 100).toFixed(2) + '%',
      description,
      rateType: description
    };
  }
  
  /**
   * Calculate comprehensive tax for a business transaction
   * @param {object} transaction - Transaction details
   * @returns {object} Comprehensive tax calculation
   */
  static calculateTransactionTax(transaction) {
    const { amount, type, vatRate } = transaction;
    
    // Calculate VAT
    const vatCalc = this.calculateVAT(amount, vatRate || 'standard');
    
    return {
      type,
      ...vatCalc,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Get tax summary for a business
   * @param {object} summary - Business financial summary
   * @param {string} businessType - Type of business
   * @returns {object} Complete tax summary
   */
  static getBusinessTaxSummary(summary, businessType) {
    const { income, expenses, profit, vatCollected, vatPaid } = summary;
    
    let taxCalculation = {};
    
    if (businessType === 'limited_company') {
      taxCalculation = this.calculateCorporationTax(profit);
    } else {
      // For sole traders and partnerships, calculate income tax and NI
      const incomeTax = this.calculateIncomeTax(profit);
      const ni = this.calculateNationalInsurance(profit);
      
      taxCalculation = {
        incomeTax,
        nationalInsurance: ni,
        totalTax: parseFloat((incomeTax.totalTax + ni.totalNI).toFixed(2))
      };
    }
    
    return {
      financialSummary: {
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        profit: parseFloat(profit.toFixed(2))
      },
      vat: {
        collected: parseFloat(vatCollected.toFixed(2)),
        paid: parseFloat(vatPaid.toFixed(2)),
        liability: parseFloat((vatCollected - vatPaid).toFixed(2))
      },
      taxCalculation,
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = TaxService;
