// Invoicing Module - Comprehensive Invoice Management

const Invoicing = {
    currentInvoice: null,
    lineItems: [],

    async render(container) {
        const invoices = await db.getByIndex('invoices', 'businessId', businessManager.currentBusiness.id);
        
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Invoicing</h1>
                <p class="page-subtitle">Create and manage invoices</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Invoices</h3>
                    <button class="btn btn-primary" onclick="Invoicing.showCreateInvoiceModal()">
                        + Create New Invoice
                    </button>
                </div>
                <div class="card-body">
                    ${invoices.length === 0 ? `
                        <p class="text-muted text-center" style="padding: 2rem;">
                            No invoices yet. Create your first invoice to get started.
                        </p>
                    ` : `
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Invoice #</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${invoices.map(inv => `
                                        <tr>
                                            <td><strong>${inv.invoiceNumber}</strong></td>
                                            <td>${inv.customerName || 'N/A'}</td>
                                            <td>${helpers.formatDate(inv.date)}</td>
                                            <td>${helpers.formatDate(inv.dueDate)}</td>
                                            <td>${helpers.formatCurrency(inv.total)}</td>
                                            <td>${this.getStatusBadge(inv.status)}</td>
                                            <td>
                                                <button class="btn btn-sm btn-secondary" onclick="Invoicing.viewInvoice(${inv.id})">View</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    getStatusBadge(status) {
        const badges = {
            'draft': '<span class="badge badge-info">Draft</span>',
            'sent': '<span class="badge badge-warning">Sent</span>',
            'paid': '<span class="badge badge-success">Paid</span>',
            'overdue': '<span class="badge badge-danger">Overdue</span>',
            'cancelled': '<span class="badge">Cancelled</span>'
        };
        return badges[status] || status;
    },

    showCreateInvoiceModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal" style="max-width: 900px;">
                <div class="modal-header">
                    <h2 class="modal-title">Create New Invoice</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="createInvoiceForm">
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label required">Customer Name</label>
                                    <input type="text" class="form-control" name="customerName" required>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label required">Invoice Date</label>
                                    <input type="date" class="form-control" name="date" value="${helpers.formatDate(new Date(), 'iso')}" required>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label required">Due Date</label>
                                    <input type="date" class="form-control" name="dueDate" required>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label">Payment Terms</label>
                                    <select class="form-control" name="paymentTerms">
                                        <option value="30">Net 30 days</option>
                                        <option value="15">Net 15 days</option>
                                        <option value="7">Net 7 days</option>
                                        <option value="0">Due on receipt</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem;">Line Items</h4>
                        <div id="lineItemsContainer">
                            <div class="line-item-row" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto; gap: 0.5rem; margin-bottom: 0.5rem; align-items: end;">
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label">Description</label>
                                    <input type="text" class="form-control" placeholder="Item description">
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label">Quantity</label>
                                    <input type="number" class="form-control" value="1" min="1">
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label">Rate (£)</label>
                                    <input type="number" class="form-control" step="0.01" min="0">
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label">VAT Rate</label>
                                    <select class="form-control">
                                        <option value="0.20">20%</option>
                                        <option value="0.05">5%</option>
                                        <option value="0.00">0%</option>
                                    </select>
                                </div>
                                <div class="form-group" style="margin: 0;">
                                    <label class="form-label">Amount</label>
                                    <input type="text" class="form-control" readonly value="£0.00">
                                </div>
                                <button type="button" class="btn btn-sm btn-danger">×</button>
                            </div>
                        </div>
                        
                        <button type="button" class="btn btn-secondary btn-sm mt-2" onclick="Invoicing.addLineItem()">+ Add Line Item</button>

                        <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Subtotal:</span>
                                <strong id="invoiceSubtotal">£0.00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>VAT:</span>
                                <strong id="invoiceVAT">£0.00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 1.25rem; padding-top: 0.5rem; border-top: 2px solid var(--border-color);">
                                <span><strong>Total:</strong></span>
                                <strong id="invoiceTotal" style="color: var(--primary-color);">£0.00</strong>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="Invoicing.saveInvoice()">Create Invoice</button>
                </div>
            </div>
        `;
        
        document.getElementById('modalContainer').appendChild(modal);
    },

    addLineItem() {
        helpers.showNotification('Line item functionality available in full version', 'info');
    },

    async saveInvoice() {
        const form = document.getElementById('createInvoiceForm');
        const formData = new FormData(form);
        
        // Generate invoice number
        const invoices = await db.getByIndex('invoices', 'businessId', businessManager.currentBusiness.id);
        const lastNumber = invoices.length;
        const invoiceNumber = helpers.generateInvoiceNumber('INV', lastNumber);

        const invoiceData = {
            businessId: businessManager.currentBusiness.id,
            invoiceNumber: invoiceNumber,
            customerName: formData.get('customerName'),
            date: formData.get('date'),
            dueDate: formData.get('dueDate'),
            paymentTerms: formData.get('paymentTerms'),
            status: 'draft',
            lineItems: [],
            subtotal: 0,
            vatAmount: 0,
            total: 0,
            createdAt: new Date().toISOString()
        };

        try {
            await db.add('invoices', invoiceData);
            document.querySelector('.modal-overlay').remove();
            await this.render(document.getElementById('mainContent'));
            helpers.showNotification('Invoice created successfully', 'success');
        } catch (error) {
            console.error('Error creating invoice:', error);
            helpers.showNotification('Failed to create invoice', 'error');
        }
    },

    viewInvoice(id) {
        helpers.showNotification('Invoice preview coming soon', 'info');
    }
};
