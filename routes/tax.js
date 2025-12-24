/**
 * Tax Calculation Routes
 */

const express = require('express');
const router = express.Router();
const TaxController = require('../controllers/taxController');
const { authenticate } = require('../middleware/auth');

// Public tax calculation endpoints
router.post('/calculate/vat', TaxController.calculateVAT);
router.post('/calculate/income-tax', TaxController.calculateIncomeTax);
router.post('/calculate/national-insurance', TaxController.calculateNI);
router.post('/calculate/corporation-tax', TaxController.calculateCorporationTax);
router.get('/rates', TaxController.getTaxRates);

// Protected business-specific tax summary
router.get('/business/:businessId/summary', authenticate, TaxController.getBusinessTaxSummary);

module.exports = router;
