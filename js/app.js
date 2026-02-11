// UK Tax & Accounting System - Main Application

class App {
    constructor() {
        this.currentView = 'dashboard';
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Show loading screen
            document.getElementById('loading-screen').style.display = 'flex';

            // Initialize database
            await db.init();
            console.log('Database initialized');

            // Initialize authentication
            await auth.init();
            console.log('User authenticated:', auth.currentUser);

            // Initialize business
            await businessManager.init();
            console.log('Business initialized:', businessManager.currentBusiness);

            // Setup UI
            await this.setupUI();

            // Load initial view
            await this.loadView('dashboard');

            // Hide loading screen
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('main-container').style.display = 'grid';

            this.initialized = true;
            helpers.showNotification('System initialized successfully', 'success');
        } catch (error) {
            console.error('Initialization error:', error);
            helpers.showNotification('Failed to initialize system', 'error');
        }
    }

    async setupUI() {
        // Set user name
        if (auth.currentUser) {
            document.getElementById('userName').textContent = auth.currentUser.name;
        }

        // Populate business selector
        await this.populateBusinessSelector();

        // Populate tax year selector
        const currentTaxYear = helpers.getCurrentTaxYear();
        document.getElementById('taxYearSelect').value = currentTaxYear;

        // Set taxpayer type
        if (businessManager.currentBusiness) {
            const taxpayerType = businessManager.currentBusiness.taxpayerType || 'sole-trader';
            document.getElementById('taxpayerTypeSelect').value = taxpayerType;
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    async populateBusinessSelector() {
        const businesses = await businessManager.getAllBusinesses();
        const select = document.getElementById('businessSelect');
        
        select.innerHTML = '<option value="">Select Business</option>';
        
        businesses.forEach(business => {
            const option = document.createElement('option');
            option.value = business.id;
            option.textContent = business.name;
            if (businessManager.currentBusiness && business.id === businessManager.currentBusiness.id) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        // Business switcher
        document.getElementById('businessSelect').addEventListener('change', async (e) => {
            const businessId = parseInt(e.target.value);
            if (businessId) {
                await businessManager.switchBusiness(businessId);
                // Update taxpayer type
                document.getElementById('taxpayerTypeSelect').value = 
                    businessManager.currentBusiness.taxpayerType || 'sole-trader';
                // Reload current view
                await this.loadView(this.currentView);
                helpers.showNotification(`Switched to ${businessManager.currentBusiness.name}`, 'success');
            }
        });

        // Add business button
        document.getElementById('addBusinessBtn').addEventListener('click', () => {
            this.showAddBusinessModal();
        });

        // Taxpayer type selector
        document.getElementById('taxpayerTypeSelect').addEventListener('change', async (e) => {
            if (businessManager.currentBusiness) {
                businessManager.currentBusiness.taxpayerType = e.target.value;
                await businessManager.updateBusiness(
                    businessManager.currentBusiness.id,
                    businessManager.currentBusiness
                );
                helpers.showNotification('Taxpayer type updated', 'success');
            }
        });

        // Tax year selector
        document.getElementById('taxYearSelect').addEventListener('change', (e) => {
            if (businessManager.currentBusiness) {
                businessManager.currentBusiness.taxYear = e.target.value;
                businessManager.updateBusiness(
                    businessManager.currentBusiness.id,
                    businessManager.currentBusiness
                );
            }
        });

        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                if (view) {
                    await this.loadView(view);
                    
                    // Update active state
                    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });

        // User menu
        document.getElementById('userMenuBtn').addEventListener('click', () => {
            helpers.showNotification('User menu coming soon', 'info');
        });

        // Notifications
        document.getElementById('notificationsBtn').addEventListener('click', () => {
            helpers.showNotification('Notifications coming soon', 'info');
        });

        // Listen for business changes
        window.addEventListener('businessChanged', async () => {
            await this.populateBusinessSelector();
        });
    }

    async loadView(viewName) {
        this.currentView = viewName;
        const mainContent = document.getElementById('mainContent');
        
        // Check if business is selected
        if (!businessManager.currentBusiness && viewName !== 'dashboard') {
            mainContent.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">No Business Selected</h1>
                    <p class="page-subtitle">Please select or create a business to continue</p>
                </div>
            `;
            return;
        }

        // Load the appropriate view
        try {
            switch (viewName) {
                case 'dashboard':
                    await Dashboard.render(mainContent);
                    break;
                case 'invoicing':
                    await Invoicing.render(mainContent);
                    break;
                case 'cashbook':
                    await Cashbook.render(mainContent);
                    break;
                case 'reconciliation':
                    await BankReconciliation.render(mainContent);
                    break;
                case 'inventory':
                    await Inventory.render(mainContent);
                    break;
                case 'tax-allowances':
                    await TaxAllowances.render(mainContent);
                    break;
                case 'tax-computation':
                    await TaxComputation.render(mainContent);
                    break;
                case 'annual-accounts':
                    await AnnualAccounts.render(mainContent);
                    break;
                default:
                    mainContent.innerHTML = `
                        <div class="page-header">
                            <h1 class="page-title">Coming Soon</h1>
                            <p class="page-subtitle">This feature is under development</p>
                        </div>
                    `;
            }
        } catch (error) {
            console.error('Error loading view:', error);
            mainContent.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> Failed to load ${viewName}
                </div>
            `;
        }
    }

    showAddBusinessModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Add New Business</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <form id="addBusinessForm">
                        <div class="form-group">
                            <label class="form-label required">Business Name</label>
                            <input type="text" class="form-control" name="name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label required">Business Type</label>
                            <select class="form-control" name="type" required>
                                <option value="">Select Type</option>
                                <option value="sole-trader">Sole Trader</option>
                                <option value="partnership">Partnership</option>
                                <option value="limited-company">Limited Company</option>
                                <option value="llp">LLP</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">UTR Number</label>
                            <input type="text" class="form-control" name="utr">
                        </div>
                        <div class="form-group">
                            <label class="form-label">VAT Number</label>
                            <input type="text" class="form-control" name="vat" placeholder="GB123456789">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="app.saveBusiness()">Add Business</button>
                </div>
            </div>
        `;
        
        document.getElementById('modalContainer').appendChild(modal);
    }

    async saveBusiness() {
        const form = document.getElementById('addBusinessForm');
        const formData = new FormData(form);
        
        const businessData = {
            name: formData.get('name'),
            type: formData.get('type'),
            taxpayerType: formData.get('type'),
            registrationNumbers: {
                utr: formData.get('utr') || '',
                vatNumber: formData.get('vat') || ''
            },
            taxYear: helpers.getCurrentTaxYear(),
            createdAt: new Date().toISOString()
        };

        try {
            const newBusiness = await businessManager.createBusiness(businessData);
            await businessManager.switchBusiness(newBusiness.id);
            await this.populateBusinessSelector();
            
            document.querySelector('.modal-overlay').remove();
            helpers.showNotification('Business added successfully', 'success');
        } catch (error) {
            console.error('Error adding business:', error);
            helpers.showNotification('Failed to add business', 'error');
        }
    }
}

// Initialize app when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
