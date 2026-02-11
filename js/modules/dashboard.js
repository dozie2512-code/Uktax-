// Dashboard Module

const Dashboard = {
    async render(container) {
        const business = businessManager.currentBusiness;
        
        if (!business) {
            container.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">Welcome to UK Tax & Accounting System</h1>
                    <p class="page-subtitle">Select or create a business to get started</p>
                </div>
                <div class="card">
                    <div class="card-body text-center" style="padding: 3rem;">
                        <h2>Get Started</h2>
                        <p class="text-muted mb-3">Create your first business to start managing your accounts</p>
                        <button class="btn btn-primary btn-lg" onclick="app.showAddBusinessModal()">
                            + Add Your First Business
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Get statistics
        const stats = await this.getStatistics();

        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Dashboard</h1>
                <p class="page-subtitle">${business.name} - ${business.type.replace('-', ' ').toUpperCase()}</p>
            </div>

            <!-- Key Metrics -->
            <div class="row">
                <div class="col-3">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <div class="text-muted text-small">Total Invoices</div>
                                    <h2 style="margin: 0.5rem 0;">${stats.totalInvoices}</h2>
                                    <div class="text-small">
                                        <span class="badge badge-success">${stats.paidInvoices} Paid</span>
                                        <span class="badge badge-warning">${stats.outstandingInvoices} Outstanding</span>
                                    </div>
                                </div>
                                <div style="font-size: 2rem;">📄</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-3">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <div class="text-muted text-small">Outstanding Amount</div>
                                    <h2 style="margin: 0.5rem 0;">${helpers.formatCurrency(stats.outstandingAmount)}</h2>
                                    <div class="text-small text-muted">Awaiting payment</div>
                                </div>
                                <div style="font-size: 2rem;">💰</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <div class="text-muted text-small">Bank Balance</div>
                                    <h2 style="margin: 0.5rem 0;">${helpers.formatCurrency(stats.bankBalance)}</h2>
                                    <div class="text-small text-muted">${stats.bankAccounts} accounts</div>
                                </div>
                                <div style="font-size: 2rem;">🏦</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-3">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <div class="text-muted text-small">Products/Services</div>
                                    <h2 style="margin: 0.5rem 0;">${stats.totalProducts}</h2>
                                    <div class="text-small">
                                        <span class="badge badge-warning">${stats.lowStockProducts} Low Stock</span>
                                    </div>
                                </div>
                                <div style="font-size: 2rem;">📦</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tax Information -->
            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Tax Information</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 1rem;">
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 6px;">
                                    <span><strong>Taxpayer Type:</strong></span>
                                    <span>${this.formatTaxpayerType(business.taxpayerType)}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 6px;">
                                    <span><strong>Tax Year:</strong></span>
                                    <span>${business.taxYear || '2025-26'}</span>
                                </div>
                                ${business.registrationNumbers?.utr ? `
                                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 6px;">
                                        <span><strong>UTR:</strong></span>
                                        <span>${business.registrationNumbers.utr}</span>
                                    </div>
                                ` : ''}
                                ${business.registrationNumbers?.vatNumber ? `
                                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: 6px;">
                                        <span><strong>VAT Number:</strong></span>
                                        <span>${business.registrationNumbers.vatNumber}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Quick Actions</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 0.75rem;">
                                <button class="btn btn-primary" style="justify-content: flex-start;" onclick="app.loadView('invoicing')">
                                    📄 Create New Invoice
                                </button>
                                <button class="btn btn-secondary" style="justify-content: flex-start;" onclick="app.loadView('cashbook')">
                                    💰 Record Transaction
                                </button>
                                <button class="btn btn-secondary" style="justify-content: flex-start;" onclick="app.loadView('reconciliation')">
                                    🔄 Reconcile Bank Account
                                </button>
                                <button class="btn btn-secondary" style="justify-content: flex-start;" onclick="app.loadView('tax-computation')">
                                    🧮 View Tax Computation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Activity</h3>
                </div>
                <div class="card-body">
                    <p class="text-muted text-center" style="padding: 2rem;">
                        No recent activity. Start by creating an invoice or recording a transaction.
                    </p>
                </div>
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

    async getStatistics() {
        const businessId = businessManager.currentBusiness?.id;

        if (!businessId) {
            return {
                totalInvoices: 0,
                paidInvoices: 0,
                outstandingInvoices: 0,
                outstandingAmount: 0,
                bankBalance: 0,
                bankAccounts: 0,
                totalProducts: 0,
                lowStockProducts: 0
            };
        }

        // Get invoices
        const invoices = await db.getByIndex('invoices', 'businessId', businessId);
        const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
        const outstandingInvoices = invoices.filter(inv => 
            inv.status === 'sent' || inv.status === 'overdue'
        ).length;
        const outstandingAmount = invoices
            .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
            .reduce((sum, inv) => sum + (inv.total || 0), 0);

        // Get bank accounts
        const bankAccounts = await db.getByIndex('bankAccounts', 'businessId', businessId);
        const bankBalance = bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

        // Get products
        const products = await db.getByIndex('products', 'businessId', businessId);
        const lowStockProducts = products.filter(p => 
            p.currentStock <= (p.reorderLevel || 0)
        ).length;

        return {
            totalInvoices: invoices.length,
            paidInvoices,
            outstandingInvoices,
            outstandingAmount,
            bankBalance,
            bankAccounts: bankAccounts.length,
            totalProducts: products.length,
            lowStockProducts
        };
    }
};
