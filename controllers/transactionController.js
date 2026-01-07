/**
 * Transaction Controller
 * Handles transaction operations for businesses
 */

const Transaction = require('../models/Transaction');
const Business = require('../models/Business');
const TaxService = require('../services/taxService');

class TransactionController {
  /**
   * Create a new transaction
   */
  static create(req, res) {
    try {
      const { businessId } = req.params;
      const { type, category, amount, vatRate, description, date, reference } = req.body;
      
      // Validate input
      if (!type || !amount) {
        return res.status(400).json({
          error: 'Please provide transaction type and amount'
        });
      }
      
      // Validate type
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({
          error: 'Transaction type must be either "income" or "expense"'
        });
      }
      
      // Check business exists and user owns it
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
      
      // Calculate VAT
      const taxCalc = TaxService.calculateVAT(parseFloat(amount), vatRate || 'standard');
      
      // Create transaction
      const transaction = Transaction.create({
        businessId,
        type,
        category: category || 'general',
        amount: parseFloat(amount),
        vatRate: taxCalc.vatRate,
        vatAmount: taxCalc.vatAmount,
        netAmount: taxCalc.netAmount,
        description,
        date,
        reference
      });
      
      res.status(201).json({
        message: 'Transaction created successfully',
        transaction,
        taxCalculation: taxCalc
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Get all transactions for a business
   */
  static getAll(req, res) {
    try {
      const { businessId } = req.params;
      
      // Check business exists and user owns it
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
      
      const transactions = Transaction.findByBusinessId(businessId);
      
      res.json({
        count: transactions.length,
        transactions
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch transactions'
      });
    }
  }
  
  /**
   * Get a specific transaction
   */
  static getById(req, res) {
    try {
      const { businessId, id } = req.params;
      
      // Check business ownership
      const business = Business.findById(businessId);
      if (!business || business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      const transaction = Transaction.findById(id);
      
      if (!transaction) {
        return res.status(404).json({
          error: 'Transaction not found'
        });
      }
      
      if (transaction.businessId !== businessId) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      res.json({
        transaction
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch transaction'
      });
    }
  }
  
  /**
   * Update a transaction
   */
  static update(req, res) {
    try {
      const { businessId, id } = req.params;
      
      // Check business ownership
      const business = Business.findById(businessId);
      if (!business || business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      const transaction = Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({
          error: 'Transaction not found'
        });
      }
      
      if (transaction.businessId !== businessId) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      // Recalculate VAT if amount or rate changed
      let updateData = { ...req.body };
      if (req.body.amount || req.body.vatRate) {
        const amount = parseFloat(req.body.amount || transaction.amount);
        const vatRate = req.body.vatRate || transaction.vatRate;
        const taxCalc = TaxService.calculateVAT(amount, vatRate);
        
        updateData = {
          ...updateData,
          amount,
          vatRate: taxCalc.vatRate,
          vatAmount: taxCalc.vatAmount,
          netAmount: taxCalc.netAmount
        };
      }
      
      const updatedTransaction = Transaction.update(id, updateData);
      
      res.json({
        message: 'Transaction updated successfully',
        transaction: updatedTransaction
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Delete a transaction
   */
  static delete(req, res) {
    try {
      const { businessId, id } = req.params;
      
      // Check business ownership
      const business = Business.findById(businessId);
      if (!business || business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      const transaction = Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({
          error: 'Transaction not found'
        });
      }
      
      if (transaction.businessId !== businessId) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      Transaction.delete(id);
      
      res.json({
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete transaction'
      });
    }
  }
  
  /**
   * Get transaction summary for a business
   */
  static getSummary(req, res) {
    try {
      const { businessId } = req.params;
      
      // Check business ownership
      const business = Business.findById(businessId);
      if (!business || business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      const summary = Transaction.getSummary(businessId);
      
      res.json({
        businessId,
        summary
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch summary'
      });
    }
  }
}

module.exports = TransactionController;
