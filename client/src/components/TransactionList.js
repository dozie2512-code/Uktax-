/**
 * Transaction List Component
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiService from '../services/api';

function TransactionList({ onLogout }) {
  const { businessId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    category: 'general',
    amount: '',
    vatRate: 'standard',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (businessId) {
      fetchTransactions();
      fetchSummary();
    }
  }, [businessId]);

  const fetchTransactions = async () => {
    try {
      const response = await apiService.getTransactions(businessId);
      setTransactions(response.data.transactions);
    } catch (err) {
      setError('Failed to fetch transactions');
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await apiService.getTransactionSummary(businessId);
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Failed to fetch summary');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.createTransaction(businessId, formData);
      setShowForm(false);
      setFormData({
        type: 'income',
        category: 'general',
        amount: '',
        vatRate: 'standard',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
      fetchSummary();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Transactions</h1>
        <div>
          <Link to="/businesses" className="btn-secondary">Back to Businesses</Link>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="page-content">
        {error && <div className="error-message">{error}</div>}

        {summary && (
          <div className="summary-cards">
            <div className="summary-card income">
              <h3>Total Income</h3>
              <p className="amount">{formatCurrency(summary.income)}</p>
            </div>
            <div className="summary-card expense">
              <h3>Total Expenses</h3>
              <p className="amount">{formatCurrency(summary.expenses)}</p>
            </div>
            <div className="summary-card profit">
              <h3>Profit</h3>
              <p className="amount">{formatCurrency(summary.profit)}</p>
            </div>
            <div className="summary-card vat">
              <h3>VAT Liability</h3>
              <p className="amount">{formatCurrency(summary.vatLiability)}</p>
            </div>
          </div>
        )}

        <div className="action-bar">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>Add New Transaction</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (£) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    placeholder="100.00"
                  />
                </div>
                <div className="form-group">
                  <label>VAT Rate *</label>
                  <select
                    value={formData.vatRate}
                    onChange={(e) => setFormData({...formData, vatRate: e.target.value})}
                    required
                  >
                    <option value="standard">Standard (20%)</option>
                    <option value="reduced">Reduced (5%)</option>
                    <option value="zero">Zero (0%)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Transaction'}
              </button>
            </form>
          </div>
        )}

        <div className="transactions-list">
          <h2>Recent Transactions ({transactions.length})</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet. Add your first transaction above!</p>
          ) : (
            <div className="table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Net Amount</th>
                    <th>VAT</th>
                    <th>Gross Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString('en-GB')}</td>
                      <td>
                        <span className={`badge ${transaction.type}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.description || '-'}</td>
                      <td>{formatCurrency(transaction.netAmount)}</td>
                      <td>{formatCurrency(transaction.vatAmount)}</td>
                      <td><strong>{formatCurrency(transaction.amount + transaction.vatAmount)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
