// Inventory Module

const Inventory = {
    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Inventory Management</h1>
                <p class="page-subtitle">Manage products, services, and stock levels</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Products & Services</h3>
                    <button class="btn btn-primary" onclick="Inventory.showAddProductModal()">
                        + Add Product/Service
                    </button>
                </div>
                <div class="card-body">
                    <p class="text-muted text-center" style="padding: 2rem;">
                        No products or services yet. Add your first item to get started.
                    </p>
                </div>
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Stock Alerts</h3>
                        </div>
                        <div class="card-body">
                            <p class="text-muted text-center" style="padding: 2rem;">
                                No stock alerts
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Recent Stock Movements</h3>
                        </div>
                        <div class="card-body">
                            <p class="text-muted text-center" style="padding: 2rem;">
                                No recent stock movements
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    showAddProductModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Add Product/Service</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="addProductForm">
                        <div class="form-group">
                            <label class="form-label required">Name</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">SKU/Product Code</label>
                            <input type="text" class="form-control" name="sku">
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label">Unit Cost (£)</label>
                                    <input type="number" class="form-control" name="unitCost" step="0.01" min="0">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label">Selling Price (£)</label>
                                    <input type="number" class="form-control" name="sellingPrice" step="0.01" min="0">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label">Current Stock</label>
                                    <input type="number" class="form-control" name="currentStock" value="0" min="0">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label">Reorder Level</label>
                                    <input type="number" class="form-control" name="reorderLevel" value="0" min="0">
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">VAT Rate</label>
                            <select class="form-control" name="vatRate">
                                <option value="0.20">Standard (20%)</option>
                                <option value="0.05">Reduced (5%)</option>
                                <option value="0.00">Zero (0%)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" name="description" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="Inventory.saveProduct()">Add Product</button>
                </div>
            </div>
        `;
        
        document.getElementById('modalContainer').appendChild(modal);
    },

    async saveProduct() {
        helpers.showNotification('Product saved successfully', 'success');
        document.querySelector('.modal-overlay').remove();
    }
};
