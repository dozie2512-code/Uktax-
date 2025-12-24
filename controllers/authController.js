/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

class AuthController {
  /**
   * Register a new user
   */
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;
      
      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'Please provide email, password, and name'
        });
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Please provide a valid email address'
        });
      }
      
      // Password validation
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long'
        });
      }
      
      // Create user
      const user = await User.create({ email, password, name });
      
      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        user: user.toJSON(),
        token
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
  
  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Please provide email and password'
        });
      }
      
      // Find user
      const user = User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }
      
      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }
      
      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      res.json({
        message: 'Login successful',
        user: user.toJSON(),
        token
      });
    } catch (error) {
      res.status(500).json({
        error: 'Login failed'
      });
    }
  }
  
  /**
   * Get current user profile
   */
  static async getProfile(req, res) {
    try {
      const user = User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
      
      res.json({
        user: user.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch profile'
      });
    }
  }
}

module.exports = AuthController;
