/**
 * Tax Controller
 * Handles tax calculation requests
 */

const TaxService = require('../services/taxService');
const Business = require('../models/Business');
const Transaction = require('../models/Transaction');

class TaxController {
  /**
   * Calculate VAT for an amount
   */
  static calculateVAT(req, res) {
    try {
      const { amount, vatRate } = req.body;
      
      if (!amount) {
        return res.status(400).json({
          error: 'Please provide amount'
        });
      }
      
      const calculation = TaxService.calculateVAT(
        parseFloat(amount),
        vatRate || 'standard'
      );
      
      res.json({
        calculation
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Calculate Income Tax
   */
  static calculateIncomeTax(req, res) {
    try {
      const { income } = req.body;
      
      if (!income) {
        return res.status(400).json({
          error: 'Please provide income amount'
        });
      }
      
      const calculation = TaxService.calculateIncomeTax(parseFloat(income));
      
      res.json({
        calculation
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Calculate National Insurance
   */
  static calculateNI(req, res) {
    try {
      const { income } = req.body;
      
      if (!income) {
        return res.status(400).json({
          error: 'Please provide income amount'
        });
      }
      
      const calculation = TaxService.calculateNationalInsurance(parseFloat(income));
      
      res.json({
        calculation
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Calculate Corporation Tax
   */
  static calculateCorporationTax(req, res) {
    try {
      const { profit } = req.body;
      
      if (!profit) {
        return res.status(400).json({
          error: 'Please provide profit amount'
        });
      }
      
      const calculation = TaxService.calculateCorporationTax(parseFloat(profit));
      
      res.json({
        calculation
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Get comprehensive tax summary for a business
   */
  static getBusinessTaxSummary(req, res) {
    try {
      const { businessId } = req.params;
      
      // Check business ownership
      const business = Business.findById(businessId);
      if (!business) {
        return res.status(404).json({
          error: 'Business not found'
        });
      }
      
      if (business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      // Get transaction summary
      const summary = Transaction.getSummary(businessId);
      
      // Calculate taxes
      const taxSummary = TaxService.getBusinessTaxSummary(summary, business.type);
      
      res.json({
        businessId,
        businessName: business.name,
        businessType: business.type,
        taxSummary
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
  
  /**
   * Get UK tax rates information
   */
  static getTaxRates(req, res) {
    try {
      const config = require('../config/config');
      
      res.json({
        taxYear: '2024/25',
        rates: config.ukTaxRates
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch tax rates'
      });
    }
  }
}

module.exports = TaxController;
