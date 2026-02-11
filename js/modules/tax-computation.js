// Tax Computation Module

const TaxComputation = {
    async render(container) {
        const business = businessManager.currentBusiness;
        const taxpayerType = business?.taxpayerType || 'sole-trader';
        const taxYear = business?.taxYear || '2025-26';

        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Tax Computation</h1>
                <p class="page-subtitle">Tax Year ${taxYear} - ${this.formatTaxpayerType(taxpayerType)}</p>
            </div>

            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Select Computation Type</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                                <button class="btn ${taxpayerType === 'sole-trader' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="TaxComputation.switchType('sole-trader')">
                                    Sole Trader
                                </button>
                                <button class="btn ${taxpayerType === 'limited-company' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="TaxComputation.switchType('limited-company')">
                                    Limited Company
                                </button>
                                <button class="btn ${taxpayerType === 'director' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="TaxComputation.switchType('director')">
                                    Director
                                </button>
                                <button class="btn ${taxpayerType === 'landlord' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="TaxComputation.switchType('landlord')">
                                    Landlord
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="computationContent">
                ${this.renderComputation(taxpayerType, taxYear)}
            </div>
        `;
    },

    formatTaxpayerType(type) {
        const types = {
            'sole-trader': 'Sole Trader',
            'partnership': 'Partnership',
            'limited-company': 'Limited Company',
            'director': 'Director (Salary & Dividends)',
            'employee': 'Employee (PAYE)',
            'landlord': 'Landlord/Property',
            'mixed': 'Mixed Income'
        };
        return types[type] || type;
    },

    switchType(type) {
        if (businessManager.currentBusiness) {
            businessManager.currentBusiness.taxpayerType = type;
            document.getElementById('taxpayerTypeSelect').value = type;
            this.render(document.getElementById('mainContent'));
        }
    },

    renderComputation(type, taxYear) {
        switch (type) {
            case 'sole-trader':
                return this.renderSoleTraderComputation(taxYear);
            case 'limited-company':
                return this.renderLimitedCompanyComputation(taxYear);
            case 'director':
                return this.renderDirectorComputation(taxYear);
            case 'landlord':
                return this.renderLandlordComputation(taxYear);
            default:
                return '<div class="card"><div class="card-body"><p class="text-muted text-center">Select a taxpayer type to view computation</p></div></div>';
        }
    },

    renderSoleTraderComputation(taxYear) {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">INCOME TAX COMPUTATION - SOLE TRADER</h3>
                    <button class="btn btn-secondary btn-sm" onclick="helpers.showNotification('Export functionality coming soon', 'info')">
                        Export PDF
                    </button>
                </div>
                <div class="card-body">
                    <div style="font-family: monospace; line-height: 1.8;">
                        <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                            <strong>Tax Year: ${taxYear}</strong><br>
                            <strong>Business: ${businessManager.currentBusiness?.name || 'N/A'}</strong><br>
                            <strong>UTR: ${businessManager.currentBusiness?.registrationNumbers?.utr || 'N/A'}</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">TRADING INCOME</h4>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                            <span>Turnover</span>
                            <strong>£0.00</strong>
                        </div>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Less: Allowable Expenses</span>
                                <span>£0.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Net Profit per Accounts</strong>
                            <strong>£0.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">ADJUSTMENTS</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Add: Depreciation</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Less: Capital Allowances</span>
                                <span>£0.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Trading Profit for Tax</strong>
                            <strong>£0.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">TAX CALCULATION</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Less: Personal Allowance</span>
                                <span>£12,570.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Taxable Income</strong>
                            <strong>£0.00</strong>
                        </div>

                        <div style="margin: 1rem 0;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Basic Rate (20%) on £37,700</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Higher Rate (40%)</span>
                                <span>£0.00</span>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 2px solid var(--border-color); font-size: 1.1rem;">
                            <strong>INCOME TAX LIABILITY</strong>
                            <strong style="color: var(--primary-color);">£0.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">NATIONAL INSURANCE</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Class 2 NI (£3.45 per week)</span>
                                <span>£179.40</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Class 4 NI (9% on £12,571 - £50,270)</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Class 4 NI (2% over £50,270)</span>
                                <span>£0.00</span>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 2px solid var(--border-color); font-size: 1.25rem; background: var(--bg-secondary); margin-top: 1rem; padding: 1rem; border-radius: 8px;">
                            <strong>TOTAL TAX AND NI DUE</strong>
                            <strong style="color: var(--danger-color);">£179.40</strong>
                        </div>
                    </div>

                    <div class="alert alert-info mt-3">
                        <strong>Note:</strong> This is a template computation. Enter your actual figures to calculate your tax liability.
                    </div>
                </div>
            </div>
        `;
    },

    renderLimitedCompanyComputation(taxYear) {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">CORPORATION TAX COMPUTATION</h3>
                    <button class="btn btn-secondary btn-sm" onclick="helpers.showNotification('Export functionality coming soon', 'info')">
                        Export PDF
                    </button>
                </div>
                <div class="card-body">
                    <div style="font-family: monospace; line-height: 1.8;">
                        <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                            <strong>Accounting Period: 01/04/${taxYear.split('-')[0]} to 31/03/${taxYear.split('-')[1]}</strong><br>
                            <strong>Company: ${businessManager.currentBusiness?.name || 'N/A'}</strong><br>
                            <strong>Company Number: ${businessManager.currentBusiness?.registrationNumbers?.companyNumber || 'N/A'}</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">PROFIT AND LOSS ACCOUNT</h4>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                            <span>Turnover</span>
                            <strong>£0.00</strong>
                        </div>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Less: Cost of Sales</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Less: Operating Expenses</span>
                                <span>£0.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Net Profit per Accounts</strong>
                            <strong>£0.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">ADJUSTMENTS FOR TAX</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Add: Depreciation</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Less: Capital Allowances</span>
                                <span>£0.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Profits Chargeable to Corporation Tax</strong>
                            <strong>£0.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">CORPORATION TAX CALCULATION</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Tax at 19% (profits up to £50,000)</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Tax at 25% (profits over £250,000)</span>
                                <span>£0.00</span>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 2px solid var(--border-color); font-size: 1.25rem; background: var(--bg-secondary); margin-top: 1rem; padding: 1rem; border-radius: 8px;">
                            <strong>CORPORATION TAX LIABILITY</strong>
                            <strong style="color: var(--danger-color);">£0.00</strong>
                        </div>

                        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-tertiary); border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>Payment Due Date:</span>
                                <strong>9 months after period end</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Filing Deadline:</span>
                                <strong>12 months after period end</strong>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info mt-3">
                        <strong>Note:</strong> This is a template computation. Enter your actual figures to calculate your corporation tax.
                    </div>
                </div>
            </div>
        `;
    },

    renderDirectorComputation(taxYear) {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">INCOME TAX COMPUTATION - COMPANY DIRECTOR</h3>
                </div>
                <div class="card-body">
                    <div style="font-family: monospace; line-height: 1.8;">
                        <h4 style="margin: 1rem 0; color: var(--primary-color);">EMPLOYMENT INCOME</h4>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                            <span>Salary</span>
                            <strong>£12,570.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">DIVIDEND INCOME</h4>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                            <span>Dividends Received</span>
                            <strong>£0.00</strong>
                        </div>

                        <div class="alert alert-warning mt-3">
                            <strong>Optimisation Note:</strong><br>
                            Current salary: £12,570 (optimal for NI efficiency)<br>
                            This uses your full personal allowance with no employee NI due.
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderLandlordComputation(taxYear) {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">PROPERTY INCOME TAX COMPUTATION</h3>
                </div>
                <div class="card-body">
                    <div style="font-family: monospace; line-height: 1.8;">
                        <h4 style="margin: 1rem 0; color: var(--primary-color);">RENTAL INCOME</h4>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                            <span>Total Rental Income</span>
                            <strong>£0.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">ALLOWABLE EXPENSES</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Letting Agent Fees</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Insurance</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Repairs & Maintenance</span>
                                <span>£0.00</span>
                            </div>
                        </div>

                        <div class="alert alert-info mt-3">
                            <strong>Note:</strong> Mortgage interest relief is restricted to basic rate (20%) tax credit from 2020/21 onwards.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
