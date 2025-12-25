/**
 * Tax Calculator Component
 * Public tax calculation tool
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

function TaxCalculator() {
  const [activeTab, setActiveTab] = useState('vat');
  const [vatData, setVatData] = useState({ amount: '', vatRate: 'standard' });
  const [incomeData, setIncomeData] = useState({ income: '' });
  const [niData, setNiData] = useState({ income: '' });
  const [corpData, setCorpData] = useState({ profit: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateVAT = async () => {
    setLoading(true);
    try {
      const response = await apiService.calculateVAT(vatData);
      setResult(response.data.calculation);
    } catch (error) {
      console.error('Calculation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateIncomeTax = async () => {
    setLoading(true);
    try {
      const response = await apiService.calculateIncomeTax(incomeData);
      setResult(response.data.calculation);
    } catch (error) {
      console.error('Calculation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNI = async () => {
    setLoading(true);
    try {
      const response = await apiService.calculateNI(niData);
      setResult(response.data.calculation);
    } catch (error) {
      console.error('Calculation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCorporationTax = async () => {
    setLoading(true);
    try {
      const response = await apiService.calculateCorporationTax(corpData);
      setResult(response.data.calculation);
    } catch (error) {
      console.error('Calculation failed', error);
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
        <h1>UK Tax Calculator</h1>
        <div>
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      </header>

      <div className="page-content">
        <div className="calculator-container">
          <div className="tabs">
            <button
              className={activeTab === 'vat' ? 'active' : ''}
              onClick={() => { setActiveTab('vat'); setResult(null); }}
            >
              VAT Calculator
            </button>
            <button
              className={activeTab === 'income' ? 'active' : ''}
              onClick={() => { setActiveTab('income'); setResult(null); }}
            >
              Income Tax
            </button>
            <button
              className={activeTab === 'ni' ? 'active' : ''}
              onClick={() => { setActiveTab('ni'); setResult(null); }}
            >
              National Insurance
            </button>
            <button
              className={activeTab === 'corp' ? 'active' : ''}
              onClick={() => { setActiveTab('corp'); setResult(null); }}
            >
              Corporation Tax
            </button>
          </div>

          <div className="calculator-content">
            {activeTab === 'vat' && (
              <div className="calculator-form">
                <h3>Calculate VAT</h3>
                <div className="form-group">
                  <label>Net Amount (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={vatData.amount}
                    onChange={(e) => setVatData({...vatData, amount: e.target.value})}
                    placeholder="100.00"
                  />
                </div>
                <div className="form-group">
                  <label>VAT Rate</label>
                  <select
                    value={vatData.vatRate}
                    onChange={(e) => setVatData({...vatData, vatRate: e.target.value})}
                  >
                    <option value="standard">Standard (20%)</option>
                    <option value="reduced">Reduced (5%)</option>
                    <option value="zero">Zero (0%)</option>
                  </select>
                </div>
                <button onClick={calculateVAT} disabled={loading || !vatData.amount}>
                  Calculate
                </button>
              </div>
            )}

            {activeTab === 'income' && (
              <div className="calculator-form">
                <h3>Calculate Income Tax</h3>
                <div className="form-group">
                  <label>Annual Income (£)</label>
                  <input
                    type="number"
                    value={incomeData.income}
                    onChange={(e) => setIncomeData({income: e.target.value})}
                    placeholder="50000"
                  />
                </div>
                <button onClick={calculateIncomeTax} disabled={loading || !incomeData.income}>
                  Calculate
                </button>
              </div>
            )}

            {activeTab === 'ni' && (
              <div className="calculator-form">
                <h3>Calculate National Insurance</h3>
                <div className="form-group">
                  <label>Annual Income (£)</label>
                  <input
                    type="number"
                    value={niData.income}
                    onChange={(e) => setNiData({income: e.target.value})}
                    placeholder="50000"
                  />
                </div>
                <button onClick={calculateNI} disabled={loading || !niData.income}>
                  Calculate
                </button>
              </div>
            )}

            {activeTab === 'corp' && (
              <div className="calculator-form">
                <h3>Calculate Corporation Tax</h3>
                <div className="form-group">
                  <label>Annual Profit (£)</label>
                  <input
                    type="number"
                    value={corpData.profit}
                    onChange={(e) => setCorpData({profit: e.target.value})}
                    placeholder="100000"
                  />
                </div>
                <button onClick={calculateCorporationTax} disabled={loading || !corpData.profit}>
                  Calculate
                </button>
              </div>
            )}

            {result && (
              <div className="result-card">
                <h3>Calculation Results</h3>
                {activeTab === 'vat' && (
                  <div>
                    <div className="result-row">
                      <span>Net Amount:</span>
                      <strong>{formatCurrency(result.netAmount)}</strong>
                    </div>
                    <div className="result-row">
                      <span>VAT ({result.vatRatePercentage}):</span>
                      <strong>{formatCurrency(result.vatAmount)}</strong>
                    </div>
                    <div className="result-row total">
                      <span>Gross Amount:</span>
                      <strong>{formatCurrency(result.grossAmount)}</strong>
                    </div>
                  </div>
                )}

                {(activeTab === 'income' || activeTab === 'ni') && (
                  <div>
                    <div className="result-row">
                      <span>Gross Income:</span>
                      <strong>{formatCurrency(result.grossIncome)}</strong>
                    </div>
                    <div className="result-row">
                      <span>Total {activeTab === 'income' ? 'Tax' : 'NI'}:</span>
                      <strong>{formatCurrency(activeTab === 'income' ? result.totalTax : result.totalNI)}</strong>
                    </div>
                    <div className="result-row total">
                      <span>Net Income:</span>
                      <strong>{formatCurrency(result.netIncome)}</strong>
                    </div>
                    <div className="result-row">
                      <span>Effective Rate:</span>
                      <strong>{result.effectiveRate}</strong>
                    </div>
                    {result.breakdown && (
                      <div className="breakdown">
                        <h4>Breakdown:</h4>
                        {result.breakdown.map((item, index) => (
                          <div key={index} className="breakdown-item">
                            <span>{item.band}: </span>
                            <span>{formatCurrency(activeTab === 'income' ? item.taxableAmount : item.niableAmount)} @ {item.rate}</span>
                            <strong>{formatCurrency(activeTab === 'income' ? item.tax : item.contribution)}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'corp' && (
                  <div>
                    <div className="result-row">
                      <span>Company Profit:</span>
                      <strong>{formatCurrency(result.profit)}</strong>
                    </div>
                    <div className="result-row">
                      <span>Corporation Tax ({result.rate}):</span>
                      <strong>{formatCurrency(result.tax)}</strong>
                    </div>
                    <div className="result-row total">
                      <span>Net Profit:</span>
                      <strong>{formatCurrency(result.netProfit)}</strong>
                    </div>
                    <div className="result-info">
                      <p>{result.description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="tax-info">
            <h3>UK Tax Year 2024/25</h3>
            <p>All calculations based on current HMRC rates and thresholds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxCalculator;
