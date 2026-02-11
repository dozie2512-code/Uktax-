// UK Tax & Accounting System - Authentication Manager

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'ukTaxAccountingSession';
    }

    async init() {
        // Check for existing session
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            try {
                this.currentUser = JSON.parse(session);
                return this.currentUser;
            } catch (e) {
                this.logout();
            }
        }
        
        // Create demo user if none exists
        await this.createDemoUser();
        return this.currentUser;
    }

    async createDemoUser() {
        // Check if demo user already exists
        const users = await db.getAll('users');
        if (users.length === 0) {
            const demoUser = {
                email: 'demo@uktaxaccounting.com',
                name: 'Demo User',
                role: 'owner',
                createdAt: new Date().toISOString()
            };
            const userId = await db.add('users', demoUser);
            demoUser.id = userId;
            this.currentUser = demoUser;
            this.saveSession();
        } else {
            this.currentUser = users[0];
            this.saveSession();
        }
    }

    saveSession() {
        localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const rolePermissions = {
            owner: ['*'],
            accountant: ['view-all', 'edit-financials', 'reports'],
            bookkeeper: ['data-entry', 'invoices', 'transactions'],
            viewer: ['view-only']
        };

        const userPermissions = rolePermissions[this.currentUser.role] || [];
        return userPermissions.includes('*') || userPermissions.includes(permission);
    }
}

const auth = new AuthManager();
