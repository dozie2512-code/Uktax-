/**
 * Transaction Model
 * Manages financial transactions for businesses
 */

const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
const transactions = [];

class Transaction {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.businessId = data.businessId;
    this.type = data.type; // 'income' or 'expense'
    this.category = data.category; // e.g., 'sales', 'purchases', 'salary'
    this.amount = parseFloat(data.amount);
    this.vatRate = data.vatRate || 0;
    this.vatAmount = data.vatAmount || 0;
    this.netAmount = data.netAmount || this.amount;
    this.description = data.description || '';
    this.date = data.date || new Date().toISOString();
    this.reference = data.reference || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  /**
   * Create a new transaction
   */
  static create(transactionData) {
    const transaction = new Transaction(transactionData);
    transactions.push(transaction);
    return transaction;
  }
  
  /**
   * Find transactions by business ID
   */
  static findByBusinessId(businessId) {
    return transactions.filter(t => t.businessId === businessId);
  }
  
  /**
   * Find transaction by ID
   */
  static findById(id) {
    return transactions.find(t => t.id === id);
  }
  
  /**
   * Update transaction
   */
  static update(id, updateData) {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      return null;
    }
    
    transactions[index] = {
      ...transactions[index],
      ...updateData,
      id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    
    return transactions[index];
  }
  
  /**
   * Delete transaction
   */
  static delete(id) {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      return false;
    }
    
    transactions.splice(index, 1);
    return true;
  }
  
  /**
   * Get transactions by date range
   */
  static findByDateRange(businessId, startDate, endDate) {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.businessId === businessId &&
             transactionDate >= new Date(startDate) &&
             transactionDate <= new Date(endDate);
    });
  }
  
  /**
   * Get transaction summary
   */
  static getSummary(businessId) {
    const businessTransactions = transactions.filter(t => t.businessId === businessId);
    
    const income = businessTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = businessTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const vatCollected = businessTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.vatAmount, 0);
    
    const vatPaid = businessTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.vatAmount, 0);
    
    return {
      income,
      expenses,
      profit: income - expenses,
      vatCollected,
      vatPaid,
      vatLiability: vatCollected - vatPaid,
      transactionCount: businessTransactions.length
    };
  }
  
  /**
   * Get all transactions (admin only)
   */
  static getAll() {
    return transactions;
  }
}

module.exports = Transaction;
