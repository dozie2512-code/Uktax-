/**
 * Tax Calculation Routes
 */

const express = require('express');
const router = express.Router();
const TaxController = require('../controllers/taxController');
const { authenticate } = require('../middleware/auth');
const { taxCalcLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Public tax calculation endpoints with rate limiting
router.post('/calculate/vat', taxCalcLimiter, TaxController.calculateVAT);
router.post('/calculate/income-tax', taxCalcLimiter, TaxController.calculateIncomeTax);
router.post('/calculate/national-insurance', taxCalcLimiter, TaxController.calculateNI);
router.post('/calculate/corporation-tax', taxCalcLimiter, TaxController.calculateCorporationTax);
router.get('/rates', taxCalcLimiter, TaxController.getTaxRates);

// Protected business-specific tax summary with rate limiting
router.get('/business/:businessId/summary', authenticate, apiLimiter, TaxController.getBusinessTaxSummary);

module.exports = router;
