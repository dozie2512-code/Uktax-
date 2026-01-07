/**
 * Business Model
 * Manages business entities for multi-business functionality
 */

const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
const businesses = [];

class Business {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.name = data.name;
    this.type = data.type; // 'sole_trader', 'partnership', 'limited_company'
    this.registrationNumber = data.registrationNumber || null;
    this.vatRegistered = data.vatRegistered || false;
    this.vatNumber = data.vatNumber || null;
    this.address = data.address || {};
    this.taxYear = data.taxYear || '2024/25';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  /**
   * Create a new business
   */
  static create(businessData) {
    const business = new Business(businessData);
    businesses.push(business);
    return business;
  }
  
  /**
   * Find businesses by user ID
   */
  static findByUserId(userId) {
    return businesses.filter(b => b.userId === userId);
  }
  
  /**
   * Find business by ID
   */
  static findById(id) {
    return businesses.find(b => b.id === id);
  }
  
  /**
   * Update business
   */
  static update(id, updateData) {
    const index = businesses.findIndex(b => b.id === id);
    if (index === -1) {
      return null;
    }
    
    businesses[index] = {
      ...businesses[index],
      ...updateData,
      id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    
    return businesses[index];
  }
  
  /**
   * Delete business
   */
  static delete(id) {
    const index = businesses.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    
    businesses.splice(index, 1);
    return true;
  }
  
  /**
   * Check if user owns business
   */
  static isOwner(businessId, userId) {
    const business = businesses.find(b => b.id === businessId);
    return business && business.userId === userId;
  }
  
  /**
   * Get all businesses (admin only)
   */
  static getAll() {
    return businesses;
  }
}

module.exports = Business;
