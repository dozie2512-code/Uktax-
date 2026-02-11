// Annual Accounts Module - Companies House Format

const AnnualAccounts = {
    async render(container) {
        const business = businessManager.currentBusiness;
        const companySize = this.detectCompanySize();

        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Annual Accounts</h1>
                <p class="page-subtitle">Companies House Statutory Accounts</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Company Size Classification</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-4">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px; text-align: center;">
                                <div class="text-small text-muted">Detected Size</div>
                                <h3 style="margin: 0.5rem 0; color: var(--primary-color);">${companySize}</h3>
                            </div>
                        </div>
                        <div class="col-8">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px;">
                                <h4>Classification Criteria</h4>
                                <div style="display: grid; gap: 0.5rem; margin-top: 0.5rem;">
                                    <div style="display: flex; justify-content: space-between;">
                                        <span>Turnover:</span>
                                        <strong>${companySize === 'Micro-Entity' ? '≤ £632,000' : companySize === 'Small' ? '≤ £10.2m' : '> £10.2m'}</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span>Assets:</span>
                                        <strong>${companySize === 'Micro-Entity' ? '≤ £316,000' : companySize === 'Small' ? '≤ £5.1m' : '> £5.1m'}</strong>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span>Employees:</span>
                                        <strong>${companySize === 'Micro-Entity' ? '≤ 10' : companySize === 'Small' ? '≤ 50' : '> 50'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Report Options</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 0.75rem;">
                                <button class="btn ${companySize === 'Micro-Entity' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="AnnualAccounts.showReport('micro')">
                                    Micro-Entity Accounts
                                </button>
                                <button class="btn ${companySize === 'Small' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="AnnualAccounts.showReport('small')">
                                    Small Company Accounts
                                </button>
                                <button class="btn ${companySize === 'Medium/Large' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="AnnualAccounts.showReport('full')">
                                    Full Statutory Accounts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-8">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Important Deadlines</h3>
                        </div>
                        <div class="card-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Prepare Annual Accounts</td>
                                        <td>9 months after year end</td>
                                        <td><span class="badge badge-warning">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>File with Companies House</td>
                                        <td>9 months after year end (private) / 6 months (public)</td>
                                        <td><span class="badge badge-warning">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>File Corporation Tax Return</td>
                                        <td>12 months after period end</td>
                                        <td><span class="badge badge-warning">Pending</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id="reportContent">
                ${this.renderMicroEntityAccounts()}
            </div>
        `;
    },

    detectCompanySize() {
        // Default to Micro-Entity for demo
        // In production, calculate based on turnover, assets, and employees
        return 'Micro-Entity';
    },

    showReport(type) {
        const reportContent = document.getElementById('reportContent');
        switch (type) {
            case 'micro':
                reportContent.innerHTML = this.renderMicroEntityAccounts();
                break;
            case 'small':
                reportContent.innerHTML = this.renderSmallCompanyAccounts();
                break;
            case 'full':
                reportContent.innerHTML = this.renderFullStatutoryAccounts();
                break;
        }
    },

    renderMicroEntityAccounts() {
        const business = businessManager.currentBusiness;
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Micro-Entity Accounts</h3>
                    <button class="btn btn-secondary btn-sm" onclick="helpers.showNotification('Export to iXBRL coming soon', 'info')">
                        Export to iXBRL
                    </button>
                </div>
                <div class="card-body">
                    <div style="font-family: monospace; line-height: 1.8;">
                        <div style="text-align: center; border-bottom: 2px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 2rem;">
                            <h2>${business?.name || 'Company Name'}</h2>
                            <p>Company Number: ${business?.registrationNumbers?.companyNumber || 'N/A'}</p>
                            <p><strong>BALANCE SHEET</strong></p>
                            <p>As at 31 December 2025</p>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">FIXED ASSETS</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Tangible Assets</span>
                                <span>£0.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Total Fixed Assets</strong>
                            <strong>£0.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">CURRENT ASSETS</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Stock</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Debtors</span>
                                <span>£0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Cash at Bank</span>
                                <span>£15,000.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Total Current Assets</strong>
                            <strong>£15,000.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">CREDITORS (amounts falling due within one year)</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Trade Creditors</span>
                                <span>£0.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-top: 1px solid var(--border-color);">
                            <strong>Net Current Assets</strong>
                            <strong>£15,000.00</strong>
                        </div>

                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 2px solid var(--border-color); font-size: 1.1rem;">
                            <strong>NET ASSETS</strong>
                            <strong style="color: var(--primary-color);">£15,000.00</strong>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--primary-color);">CAPITAL AND RESERVES</h4>
                        <div style="margin-left: 2rem;">
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Called up Share Capital</span>
                                <span>£100.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                                <span>Profit and Loss Account</span>
                                <span>£14,900.00</span>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 2px solid var(--border-color); font-size: 1.1rem;">
                            <strong>SHAREHOLDERS' FUNDS</strong>
                            <strong style="color: var(--primary-color);">£15,000.00</strong>
                        </div>

                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border-color);">
                            <p>The directors acknowledge their responsibilities for complying with the requirements of the Companies Act 2006 with respect to accounting records and the preparation of accounts.</p>
                            <p style="margin-top: 1rem;">These accounts have been prepared in accordance with the provisions applicable to companies subject to the small companies regime and in accordance with FRS 102 Section 1A.</p>
                        </div>
                    </div>

                    <div class="alert alert-info mt-3">
                        <strong>Note:</strong> Micro-entities are not required to file a profit and loss account with Companies House.
                    </div>
                </div>
            </div>
        `;
    },

    renderSmallCompanyAccounts() {
        return `
            <div class="card">
                <div class="card-body">
                    <p class="text-muted text-center" style="padding: 2rem;">
                        Small Company Accounts template available. Full implementation coming soon.
                    </p>
                </div>
            </div>
        `;
    },

    renderFullStatutoryAccounts() {
        return `
            <div class="card">
                <div class="card-body">
                    <p class="text-muted text-center" style="padding: 2rem;">
                        Full Statutory Accounts template available. Full implementation coming soon.
                    </p>
                </div>
            </div>
        `;
    }
};
