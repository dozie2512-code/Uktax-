/**
 * Nigerian Tax Utilities
 * 
 * Helper functions for tax calculations, validations, and formatting
 */

const TaxUtils = {
    
    /**
     * Validate input as a valid number
     */
    validateNumber(value, fieldName = 'Value') {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            throw new Error(`${fieldName} must be a valid positive number`);
        }
        return num;
    },
    
    /**
     * Format currency in Nigerian Naira
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    },
    
    /**
     * Format percentage
     */
    formatPercentage(rate, decimals = 2) {
        return (rate * 100).toFixed(decimals) + '%';
    },
    
    /**
     * Format large numbers with comma separators
     */
    formatNumber(num) {
        return new Intl.NumberFormat('en-NG').format(num);
    },
    
    /**
     * Show error message
     */
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="error">${message}</div>`;
        }
    },
    
    /**
     * Show success message
     */
    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="success">${message}</div>`;
        }
    },
    
    /**
     * Clear result display
     */
    clearResult(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '';
        }
    },
    
    /**
     * Create result card HTML
     */
    createResultCard(title, rows, className = '') {
        let html = `<div class="result-card ${className}">`;
        html += `<h3>${title}</h3>`;
        
        rows.forEach(row => {
            const cssClass = row.highlight ? 'result-row total' : 'result-row';
            html += `
                <div class="${cssClass}">
                    <span>${row.label}:</span>
                    <strong>${row.value}</strong>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    },
    
    /**
     * Create breakdown section HTML
     */
    createBreakdown(title, items) {
        let html = `<div class="breakdown">`;
        html += `<h4>${title}</h4>`;
        
        items.forEach(item => {
            html += `
                <div class="breakdown-item">
                    <span>${item.label}</span>
                    <strong>${item.value}</strong>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    },
    
    /**
     * Create info box HTML
     */
    createInfoBox(title, content, type = 'info') {
        return `
            <div class="info-box ${type}">
                <h4>${title}</h4>
                ${content}
            </div>
        `;
    },
    
    /**
     * Get current tax year
     */
    getCurrentTaxYear() {
        return NigerianTaxRates.taxYear.current;
    },
    
    /**
     * Get WHT rate for payment type
     */
    getWHTRate(paymentType) {
        const rates = NigerianTaxRates.WHT.rates;
        if (rates[paymentType]) {
            return rates[paymentType].rate;
        }
        return 0;
    },
    
    /**
     * Get VAT rate
     */
    getVATRate() {
        return NigerianTaxRates.VAT.standardRate;
    },
    
    /**
     * Export data to JSON
     */
    exportToJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
    },
    
    /**
     * Print report
     */
    printReport(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Tax Report</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1, h2, h3 { color: #333; }
                .result-card { border: 1px solid #ddd; padding: 20px; margin: 20px 0; }
                .result-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .total { font-weight: bold; font-size: 1.2em; color: #10b981; }
            `);
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<h1>Nigerian Tax Report</h1>');
            printWindow.document.write(element.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    },
    
    /**
     * Validate email address
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Validate phone number (Nigerian format)
     */
    validatePhone(phone) {
        // Nigerian phone numbers: +234XXXXXXXXXX or 0XXXXXXXXXXX
        const re = /^(\+234|0)[7-9][0-1]\d{8}$/;
        return re.test(phone.replace(/\s/g, ''));
    },
    
    /**
     * Validate TIN (Tax Identification Number)
     */
    validateTIN(tin) {
        // Nigerian TIN format: XXXXXXXXX-XXXX
        const re = /^\d{9}-\d{4}$/;
        return re.test(tin);
    },
    
    /**
     * Parse date string to Date object
     */
    parseDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        return date;
    },
    
    /**
     * Format date to Nigerian format
     */
    formatDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    /**
     * Calculate period (month/year) for tax returns
     */
    getTaxPeriod(date = new Date()) {
        const year = date.getFullYear();
        const month = date.toLocaleString('en-NG', { month: 'long' });
        return `${month} ${year}`;
    },
    
    /**
     * Debounce function for input handlers
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Round to specified decimal places
     */
    round(num, decimals = 2) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    
    /**
     * Generate unique ID
     */
    generateId() {
        return 'tax_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaxUtils;
}
