/**
 * Business List Component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

function BusinessList({ onLogout }) {
  const [businesses, setBusinesses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'sole_trader',
    vatRegistered: false,
    vatNumber: '',
    registrationNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await apiService.getBusinesses();
      setBusinesses(response.data.businesses);
    } catch (err) {
      setError('Failed to fetch businesses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.createBusiness(formData);
      setShowForm(false);
      setFormData({
        name: '',
        type: 'sole_trader',
        vatRegistered: false,
        vatNumber: '',
        registrationNumber: ''
      });
      fetchBusinesses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Manage Businesses</h1>
        <div>
          <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="page-content">
        {error && <div className="error-message">{error}</div>}

        <div className="action-bar">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create New Business'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>Create New Business</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Business Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="My Business Ltd"
                />
              </div>
              <div className="form-group">
                <label>Business Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="sole_trader">Sole Trader</option>
                  <option value="partnership">Partnership</option>
                  <option value="limited_company">Limited Company</option>
                </select>
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                  placeholder="12345678"
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.vatRegistered}
                    onChange={(e) => setFormData({...formData, vatRegistered: e.target.checked})}
                  />
                  VAT Registered
                </label>
              </div>
              {formData.vatRegistered && (
                <div className="form-group">
                  <label>VAT Number</label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({...formData, vatNumber: e.target.value})}
                    placeholder="GB123456789"
                  />
                </div>
              )}
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Business'}
              </button>
            </form>
          </div>
        )}

        <div className="businesses-list">
          <h2>Your Businesses ({businesses.length})</h2>
          {businesses.length === 0 ? (
            <p>No businesses yet. Create your first business above!</p>
          ) : (
            <div className="business-grid">
              {businesses.map((business) => (
                <div key={business.id} className="business-card-full">
                  <h3>{business.name}</h3>
                  <p><strong>Type:</strong> {business.type.replace(/_/g, ' ')}</p>
                  {business.registrationNumber && (
                    <p><strong>Registration:</strong> {business.registrationNumber}</p>
                  )}
                  {business.vatRegistered && (
                    <p className="vat-badge">✓ VAT Registered</p>
                  )}
                  <div className="card-actions">
                    <Link 
                      to={`/businesses/${business.id}/transactions`}
                      className="btn-primary"
                    >
                      View Transactions
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusinessList;
