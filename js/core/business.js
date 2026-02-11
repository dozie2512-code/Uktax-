// UK Tax & Accounting System - Business Manager

class BusinessManager {
    constructor() {
        this.currentBusiness = null;
        this.businessKey = 'ukTaxCurrentBusiness';
    }

    async init() {
        // Check for existing business selection
        const businessId = localStorage.getItem(this.businessKey);
        if (businessId) {
            this.currentBusiness = await db.get('businesses', parseInt(businessId));
            if (this.currentBusiness) {
                return this.currentBusiness;
            }
        }

        // Create demo business if none exists
        await this.createDemoBusinesses();
        return this.currentBusiness;
    }

    async createDemoBusinesses() {
        const businesses = await db.getAll('businesses');
        
        if (businesses.length === 0) {
            // Create demo sole trader business
            const demoBusiness1 = {
                name: 'Smith Consulting Ltd',
                type: 'limited-company',
                taxpayerType: 'limited-company',
                registrationNumbers: {
                    utr: '1234567890',
                    companyNumber: '12345678',
                    vatNumber: 'GB123456789',
                    payeReference: '123/AB12345'
                },
                address: {
                    line1: '123 Business Street',
                    city: 'London',
                    postcode: 'SW1A 1AA',
                    country: 'United Kingdom'
                },
                contact: {
                    email: 'info@smithconsulting.co.uk',
                    phone: '020 1234 5678',
                    website: 'www.smithconsulting.co.uk'
                },
                taxYear: '2025-26',
                taxYearEnd: '2026-04-05',
                accountingYearEnd: '2025-12-31',
                sicCode: '62020',
                createdAt: new Date().toISOString()
            };

            const businessId1 = await db.add('businesses', demoBusiness1);
            demoBusiness1.id = businessId1;

            // Create demo sole trader business
            const demoBusiness2 = {
                name: 'John\'s Plumbing Services',
                type: 'sole-trader',
                taxpayerType: 'sole-trader',
                registrationNumbers: {
                    utr: '9876543210',
                    vatNumber: ''
                },
                address: {
                    line1: '45 High Street',
                    city: 'Manchester',
                    postcode: 'M1 1AA',
                    country: 'United Kingdom'
                },
                contact: {
                    email: 'john@plumbing.co.uk',
                    phone: '0161 234 5678'
                },
                taxYear: '2025-26',
                taxYearEnd: '2026-04-05',
                createdAt: new Date().toISOString()
            };

            await db.add('businesses', demoBusiness2);

            // Set first business as current
            this.currentBusiness = demoBusiness1;
            this.saveCurrentBusiness(businessId1);

            // Create demo bank accounts for the first business
            await this.createDemoBankAccounts(businessId1);
        } else {
            this.currentBusiness = businesses[0];
            this.saveCurrentBusiness(businesses[0].id);
        }
    }

    async createDemoBankAccounts(businessId) {
        const demoAccount = {
            businessId: businessId,
            accountName: 'Business Current Account',
            bankName: 'Barclays Bank',
            accountNumber: '12345678',
            sortCode: '20-00-00',
            balance: 15000.00,
            currency: 'GBP',
            createdAt: new Date().toISOString()
        };

        await db.add('bankAccounts', demoAccount);
    }

    saveCurrentBusiness(businessId) {
        localStorage.setItem(this.businessKey, businessId.toString());
    }

    async switchBusiness(businessId) {
        this.currentBusiness = await db.get('businesses', businessId);
        this.saveCurrentBusiness(businessId);
        
        // Trigger business change event
        window.dispatchEvent(new CustomEvent('businessChanged', { 
            detail: { business: this.currentBusiness } 
        }));
        
        return this.currentBusiness;
    }

    async getAllBusinesses() {
        return await db.getAll('businesses');
    }

    async createBusiness(businessData) {
        const businessId = await db.add('businesses', businessData);
        businessData.id = businessId;
        return businessData;
    }

    async updateBusiness(businessId, businessData) {
        businessData.id = businessId;
        await db.update('businesses', businessData);
        
        if (this.currentBusiness && this.currentBusiness.id === businessId) {
            this.currentBusiness = businessData;
        }
        
        return businessData;
    }
}

const businessManager = new BusinessManager();
