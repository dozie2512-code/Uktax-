/**
 * Main Server Entry Point
 * UK Tax Accounting Application
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const transactionRoutes = require('./routes/transaction');
const taxRoutes = require('./routes/tax');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'UK Tax Accounting API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/tax', taxRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'UK Tax Accounting API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      businesses: '/api/businesses',
      transactions: '/api/transactions',
      tax: '/api/tax'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 UK Tax Accounting Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
