/**
 * Business Controller
 * Handles business management operations
 */

const Business = require('../models/Business');

class BusinessController {
  /**
   * Create a new business
   */
  static create(req, res) {
    try {
      const { name, type, registrationNumber, vatRegistered, vatNumber, address } = req.body;
      
      // Validate input
      if (!name || !type) {
        return res.status(400).json({
          error: 'Please provide business name and type'
        });
      }
      
      // Validate business type
      const validTypes = ['sole_trader', 'partnership', 'limited_company'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: 'Invalid business type. Must be: sole_trader, partnership, or limited_company'
        });
      }
      
      // Create business
      const business = Business.create({
        userId: req.user.id,
        name,
        type,
        registrationNumber,
        vatRegistered: vatRegistered || false,
        vatNumber,
        address
      });
      
      res.status(201).json({
        message: 'Business created successfully',
        business
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Get all businesses for the current user
   */
  static getAll(req, res) {
    try {
      const businesses = Business.findByUserId(req.user.id);
      
      res.json({
        count: businesses.length,
        businesses
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch businesses'
      });
    }
  }
  
  /**
   * Get a specific business
   */
  static getById(req, res) {
    try {
      const { id } = req.params;
      const business = Business.findById(id);
      
      if (!business) {
        return res.status(404).json({
          error: 'Business not found'
        });
      }
      
      // Check ownership
      if (business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      res.json({
        business
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch business'
      });
    }
  }
  
  /**
   * Update a business
   */
  static update(req, res) {
    try {
      const { id } = req.params;
      const business = Business.findById(id);
      
      if (!business) {
        return res.status(404).json({
          error: 'Business not found'
        });
      }
      
      // Check ownership
      if (business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      // Update business
      const updatedBusiness = Business.update(id, {
        ...req.body,
        userId: req.user.id // Preserve owner
      });
      
      res.json({
        message: 'Business updated successfully',
        business: updatedBusiness
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Delete a business
   */
  static delete(req, res) {
    try {
      const { id } = req.params;
      const business = Business.findById(id);
      
      if (!business) {
        return res.status(404).json({
          error: 'Business not found'
        });
      }
      
      // Check ownership
      if (business.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      
      // Delete business
      Business.delete(id);
      
      res.json({
        message: 'Business deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to delete business'
      });
    }
  }
}

module.exports = BusinessController;
