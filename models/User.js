/**
 * User Model
 * Manages user data and authentication
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// In-memory storage (replace with database in production)
const users = [];

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.name = data.name;
    this.password = data.password; // Hashed password
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  /**
   * Create a new user
   */
  static async create(userData) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    
    users.push(user);
    return user;
  }
  
  /**
   * Find user by email
   */
  static findByEmail(email) {
    return users.find(u => u.email === email);
  }
  
  /**
   * Find user by ID
   */
  static findById(id) {
    return users.find(u => u.id === id);
  }
  
  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  /**
   * Get all users (admin only)
   */
  static getAll() {
    return users;
  }
  
  /**
   * Convert to JSON (exclude password)
   */
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
