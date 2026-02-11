// Cashbook Module - Receipts and Payments

const Cashbook = {
    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Cashbook</h1>
                <p class="page-subtitle">Record receipts and payments</p>
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Record Receipt</h3>
                        </div>
                        <div class="card-body">
                            <form id="receiptForm">
                                <div class="form-group">
                                    <label class="form-label required">Date</label>
                                    <input type="date" class="form-control" value="${helpers.formatDate(new Date(), 'iso')}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Description</label>
                                    <input type="text" class="form-control" placeholder="e.g., Sales invoice payment" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Amount (£)</label>
                                    <input type="number" class="form-control" step="0.01" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Category</label>
                                    <select class="form-control">
                                        <option value="sales">Sales</option>
                                        <option value="other-income">Other Income</option>
                                        <option value="loan">Loan Received</option>
                                        <option value="capital">Capital Introduced</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">VAT Rate</label>
                                    <select class="form-control">
                                        <option value="0.20">20%</option>
                                        <option value="0.05">5%</option>
                                        <option value="0.00">0%</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-success">Record Receipt</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Record Payment</h3>
                        </div>
                        <div class="card-body">
                            <form id="paymentForm">
                                <div class="form-group">
                                    <label class="form-label required">Date</label>
                                    <input type="date" class="form-control" value="${helpers.formatDate(new Date(), 'iso')}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Description</label>
                                    <input type="text" class="form-control" placeholder="e.g., Office rent" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Amount (£)</label>
                                    <input type="number" class="form-control" step="0.01" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Expense Category</label>
                                    <select class="form-control">
                                        <option value="rent">Rent & Rates</option>
                                        <option value="utilities">Utilities</option>
                                        <option value="salaries">Salaries & Wages</option>
                                        <option value="supplies">Office Supplies</option>
                                        <option value="professional">Professional Fees</option>
                                        <option value="travel">Travel & Subsistence</option>
                                        <option value="motor">Motor Expenses</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="insurance">Insurance</option>
                                        <option value="other">Other Expenses</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">VAT Reclaimable</label>
                                    <select class="form-control">
                                        <option value="0.20">20%</option>
                                        <option value="0.05">5%</option>
                                        <option value="0.00">0%</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-danger">Record Payment</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Transactions</h3>
                </div>
                <div class="card-body">
                    <p class="text-muted text-center" style="padding: 2rem;">
                        No transactions yet. Record your first receipt or payment to get started.
                    </p>
                </div>
            </div>
        `;

        // Add form submit handlers
        document.getElementById('receiptForm').addEventListener('submit', (e) => {
            e.preventDefault();
            helpers.showNotification('Receipt recorded successfully', 'success');
            e.target.reset();
        });

        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            helpers.showNotification('Payment recorded successfully', 'success');
            e.target.reset();
        });
    }
};
