/**
 * Dashboard Component
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

function Dashboard({ user, onLogout }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await apiService.getBusinesses();
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.error('Failed to fetch businesses', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>UK Tax Accounting Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name || 'User'}</span>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Quick Links</h2>
          <div className="quick-links">
            <Link to="/businesses" className="quick-link-card">
              <h3>📊 Manage Businesses</h3>
              <p>Create and manage your businesses</p>
            </Link>
            <Link to="/tax-calculator" className="quick-link-card">
              <h3>🧮 Tax Calculator</h3>
              <p>Calculate UK taxes in real-time</p>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Your Businesses ({businesses.length})</h2>
          {loading ? (
            <p>Loading businesses...</p>
          ) : businesses.length === 0 ? (
            <div className="empty-state">
              <p>No businesses yet.</p>
              <Link to="/businesses" className="btn-primary">Create Your First Business</Link>
            </div>
          ) : (
            <div className="business-cards">
              {businesses.map((business) => (
                <Link 
                  key={business.id} 
                  to={`/businesses/${business.id}/transactions`}
                  className="business-card"
                >
                  <h3>{business.name}</h3>
                  <p>Type: {business.type.replace('_', ' ')}</p>
                  {business.vatRegistered && <span className="badge">VAT Registered</span>}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h4>✅ Multi-Business Support</h4>
              <p>Manage multiple businesses from one account</p>
            </div>
            <div className="feature-item">
              <h4>✅ Real-Time Tax Calculations</h4>
              <p>Automatic VAT, Income Tax, NI, and Corporation Tax</p>
            </div>
            <div className="feature-item">
              <h4>✅ Transaction Management</h4>
              <p>Track all income and expenses</p>
            </div>
            <div className="feature-item">
              <h4>✅ UK Tax Compliant</h4>
              <p>Based on 2024/25 tax rates and rules</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
