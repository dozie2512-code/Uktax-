/**
 * Transaction Routes
 */

const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Business-specific transaction routes
router.post('/:businessId/transactions', TransactionController.create);
router.get('/:businessId/transactions', TransactionController.getAll);
router.get('/:businessId/transactions/summary', TransactionController.getSummary);
router.get('/:businessId/transactions/:id', TransactionController.getById);
router.put('/:businessId/transactions/:id', TransactionController.update);
router.delete('/:businessId/transactions/:id', TransactionController.delete);

module.exports = router;
