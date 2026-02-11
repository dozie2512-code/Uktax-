// UK Tax & Accounting System - Database Manager
// IndexedDB for local data persistence

class DatabaseManager {
    constructor() {
        this.dbName = 'UKTaxAccounting';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Businesses Store
                if (!db.objectStoreNames.contains('businesses')) {
                    const businessStore = db.createObjectStore('businesses', { keyPath: 'id', autoIncrement: true });
                    businessStore.createIndex('name', 'name', { unique: false });
                    businessStore.createIndex('type', 'type', { unique: false });
                }

                // Users Store
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('businessId', 'businessId', { unique: false });
                }

                // Invoices Store
                if (!db.objectStoreNames.contains('invoices')) {
                    const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true });
                    invoiceStore.createIndex('businessId', 'businessId', { unique: false });
                    invoiceStore.createIndex('invoiceNumber', 'invoiceNumber', { unique: false });
                    invoiceStore.createIndex('status', 'status', { unique: false });
                    invoiceStore.createIndex('customerId', 'customerId', { unique: false });
                }

                // Customers Store
                if (!db.objectStoreNames.contains('customers')) {
                    const customerStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
                    customerStore.createIndex('businessId', 'businessId', { unique: false });
                    customerStore.createIndex('name', 'name', { unique: false });
                }

                // Suppliers Store
                if (!db.objectStoreNames.contains('suppliers')) {
                    const supplierStore = db.createObjectStore('suppliers', { keyPath: 'id', autoIncrement: true });
                    supplierStore.createIndex('businessId', 'businessId', { unique: false });
                    supplierStore.createIndex('name', 'name', { unique: false });
                }

                // Transactions Store (Cashbook)
                if (!db.objectStoreNames.contains('transactions')) {
                    const transactionStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
                    transactionStore.createIndex('businessId', 'businessId', { unique: false });
                    transactionStore.createIndex('type', 'type', { unique: false }); // 'receipt' or 'payment'
                    transactionStore.createIndex('date', 'date', { unique: false });
                    transactionStore.createIndex('bankAccountId', 'bankAccountId', { unique: false });
                }

                // Bank Accounts Store
                if (!db.objectStoreNames.contains('bankAccounts')) {
                    const bankAccountStore = db.createObjectStore('bankAccounts', { keyPath: 'id', autoIncrement: true });
                    bankAccountStore.createIndex('businessId', 'businessId', { unique: false });
                    bankAccountStore.createIndex('accountName', 'accountName', { unique: false });
                }

                // Reconciliations Store
                if (!db.objectStoreNames.contains('reconciliations')) {
                    const reconciliationStore = db.createObjectStore('reconciliations', { keyPath: 'id', autoIncrement: true });
                    reconciliationStore.createIndex('businessId', 'businessId', { unique: false });
                    reconciliationStore.createIndex('bankAccountId', 'bankAccountId', { unique: false });
                    reconciliationStore.createIndex('date', 'date', { unique: false });
                }

                // Products/Services Store
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
                    productStore.createIndex('businessId', 'businessId', { unique: false });
                    productStore.createIndex('sku', 'sku', { unique: false });
                    productStore.createIndex('category', 'category', { unique: false });
                }

                // Stock Movements Store
                if (!db.objectStoreNames.contains('stockMovements')) {
                    const stockStore = db.createObjectStore('stockMovements', { keyPath: 'id', autoIncrement: true });
                    stockStore.createIndex('businessId', 'businessId', { unique: false });
                    stockStore.createIndex('productId', 'productId', { unique: false });
                    stockStore.createIndex('date', 'date', { unique: false });
                }

                // Settings Store
                if (!db.objectStoreNames.contains('settings')) {
                    const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    // Generic CRUD operations
    async add(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, id) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, id) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex(storeName, indexName, value) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clear(storeName) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Export singleton instance
const db = new DatabaseManager();
