/**
 * Tax Service Tests
 * Unit tests for UK tax calculations
 */

const TaxService = require('../services/taxService');

describe('TaxService', () => {
  describe('calculateVAT', () => {
    test('should calculate standard VAT (20%)', () => {
      const result = TaxService.calculateVAT(100, 'standard');
      
      expect(result.netAmount).toBe(100);
      expect(result.vatRate).toBe(0.20);
      expect(result.vatAmount).toBe(20);
      expect(result.grossAmount).toBe(120);
    });
    
    test('should calculate reduced VAT (5%)', () => {
      const result = TaxService.calculateVAT(100, 'reduced');
      
      expect(result.netAmount).toBe(100);
      expect(result.vatRate).toBe(0.05);
      expect(result.vatAmount).toBe(5);
      expect(result.grossAmount).toBe(105);
    });
    
    test('should calculate zero VAT (0%)', () => {
      const result = TaxService.calculateVAT(100, 'zero');
      
      expect(result.netAmount).toBe(100);
      expect(result.vatRate).toBe(0);
      expect(result.vatAmount).toBe(0);
      expect(result.grossAmount).toBe(100);
    });
  });
  
  describe('calculateIncomeTax', () => {
    test('should calculate no tax for personal allowance', () => {
      const result = TaxService.calculateIncomeTax(12000);
      
      expect(result.grossIncome).toBe(12000);
      expect(result.totalTax).toBe(0);
      expect(result.netIncome).toBe(12000);
    });
    
    test('should calculate basic rate tax', () => {
      const result = TaxService.calculateIncomeTax(30000);
      
      expect(result.grossIncome).toBe(30000);
      // Tax on £17,429 at 20% = £3,485.80
      expect(result.totalTax).toBeCloseTo(3485.80, 1);
      expect(result.breakdown.length).toBeGreaterThan(0);
    });
    
    test('should calculate higher rate tax', () => {
      const result = TaxService.calculateIncomeTax(60000);
      
      expect(result.grossIncome).toBe(60000);
      // Should include basic and higher rate bands
      expect(result.breakdown.length).toBeGreaterThan(1);
      expect(result.totalTax).toBeGreaterThan(0);
    });
  });
  
  describe('calculateNationalInsurance', () => {
    test('should calculate no NI below threshold', () => {
      const result = TaxService.calculateNationalInsurance(12000);
      
      expect(result.grossIncome).toBe(12000);
      expect(result.totalNI).toBe(0);
    });
    
    test('should calculate standard rate NI', () => {
      const result = TaxService.calculateNationalInsurance(30000);
      
      expect(result.grossIncome).toBe(30000);
      // NI on £17,429 at 12% = £2,091.48
      expect(result.totalNI).toBeCloseTo(2091.48, 1);
    });
  });
  
  describe('calculateCorporationTax', () => {
    test('should calculate small profits rate', () => {
      const result = TaxService.calculateCorporationTax(40000);
      
      expect(result.profit).toBe(40000);
      expect(result.tax).toBe(7600); // 19% of 40000
      expect(result.description).toBe('Small Profits Rate');
    });
    
    test('should calculate main rate', () => {
      const result = TaxService.calculateCorporationTax(300000);
      
      expect(result.profit).toBe(300000);
      expect(result.tax).toBe(75000); // 25% of 300000
      expect(result.description).toBe('Main Rate');
    });
    
    test('should apply marginal relief', () => {
      const result = TaxService.calculateCorporationTax(150000);
      
      expect(result.profit).toBe(150000);
      expect(result.description).toBe('Marginal Relief Applied');
      expect(result.tax).toBeGreaterThan(0);
      expect(result.tax).toBeLessThan(37500); // Less than 25% of 150000
    });
  });
});
