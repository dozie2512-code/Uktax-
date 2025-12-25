/**
 * API Service
 * Centralized API calls to backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),

  // Businesses
  createBusiness: (data) => api.post('/businesses', data),
  getBusinesses: () => api.get('/businesses'),
  getBusiness: (id) => api.get(`/businesses/${id}`),
  updateBusiness: (id, data) => api.put(`/businesses/${id}`, data),
  deleteBusiness: (id) => api.delete(`/businesses/${id}`),

  // Transactions
  createTransaction: (businessId, data) => 
    api.post(`/transactions/${businessId}/transactions`, data),
  getTransactions: (businessId) => 
    api.get(`/transactions/${businessId}/transactions`),
  getTransactionSummary: (businessId) => 
    api.get(`/transactions/${businessId}/transactions/summary`),
  updateTransaction: (businessId, transactionId, data) => 
    api.put(`/transactions/${businessId}/transactions/${transactionId}`, data),
  deleteTransaction: (businessId, transactionId) => 
    api.delete(`/transactions/${businessId}/transactions/${transactionId}`),

  // Tax
  calculateVAT: (data) => api.post('/tax/calculate/vat', data),
  calculateIncomeTax: (data) => api.post('/tax/calculate/income-tax', data),
  calculateNI: (data) => api.post('/tax/calculate/national-insurance', data),
  calculateCorporationTax: (data) => api.post('/tax/calculate/corporation-tax', data),
  getTaxRates: () => api.get('/tax/rates'),
  getBusinessTaxSummary: (businessId) => 
    api.get(`/tax/business/${businessId}/summary`)
};

export default apiService;
