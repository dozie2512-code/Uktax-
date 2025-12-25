/**
 * Formatter Utilities
 * Common formatting functions for UK accounting
 */

class Formatter {
  /**
   * Format amount as UK currency
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  }
  
  /**
   * Format date in UK format
   */
  static formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  }
  
  /**
   * Format percentage
   */
  static formatPercentage(value) {
    return `${(value * 100).toFixed(2)}%`;
  }
  
  /**
   * Format number with thousand separators
   */
  static formatNumber(number) {
    return new Intl.NumberFormat('en-GB').format(number);
  }
}

module.exports = Formatter;
