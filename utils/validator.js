/**
 * Validation Utilities
 * Common validation functions
 */

class Validator {
  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate UK VAT number
   */
  static isValidVATNumber(vatNumber) {
    // UK VAT number format: GB followed by 9 or 12 digits
    const vatRegex = /^GB\d{9}$|^GB\d{12}$/;
    return vatRegex.test(vatNumber);
  }
  
  /**
   * Validate UK company registration number
   */
  static isValidCompanyNumber(number) {
    // UK company number: 8 characters, can be digits or letters
    const companyRegex = /^[A-Z0-9]{8}$/i;
    return companyRegex.test(number);
  }
  
  /**
   * Validate amount (must be positive number)
   */
  static isValidAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= 0;
  }
  
  /**
   * Validate date format (ISO 8601)
   */
  static isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

module.exports = Validator;
