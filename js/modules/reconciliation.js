// Bank Reconciliation Module

const BankReconciliation = {
    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Bank Reconciliation</h1>
                <p class="page-subtitle">Reconcile bank statements with recorded transactions</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Upload Bank Statement</h3>
                </div>
                <div class="card-body">
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📁</div>
                        <p class="text-muted mb-2">Upload your bank statement in CSV format</p>
                        <input type="file" id="bankStatementUpload" accept=".csv" style="display: none;">
                        <button class="btn btn-primary" onclick="document.getElementById('bankStatementUpload').click()">
                            Choose File
                        </button>
                        <p class="text-small text-muted mt-2">Supported format: CSV</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Reconciliation Summary</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px; text-align: center;">
                                <div class="text-small text-muted">Opening Balance</div>
                                <h3 style="margin: 0.5rem 0; color: var(--primary-color);">£15,000.00</h3>
                            </div>
                        </div>
                        <div class="col-3">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px; text-align: center;">
                                <div class="text-small text-muted">Cleared Items</div>
                                <h3 style="margin: 0.5rem 0; color: var(--success-color);">0</h3>
                            </div>
                        </div>
                        <div class="col-3">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px; text-align: center;">
                                <div class="text-small text-muted">Outstanding Items</div>
                                <h3 style="margin: 0.5rem 0; color: var(--warning-color);">0</h3>
                            </div>
                        </div>
                        <div class="col-3">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px; text-align: center;">
                                <div class="text-small text-muted">Closing Balance</div>
                                <h3 style="margin: 0.5rem 0; color: var(--primary-color);">£15,000.00</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Unreconciled Transactions</h3>
                </div>
                <div class="card-body">
                    <p class="text-muted text-center" style="padding: 2rem;">
                        No unreconciled transactions. Upload a bank statement to begin reconciliation.
                    </p>
                </div>
            </div>
        `;

        document.getElementById('bankStatementUpload').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                helpers.showNotification('Bank statement upload functionality coming soon', 'info');
            }
        });
    }
};
