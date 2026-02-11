// UK Tax & Accounting System - Utility Helpers

const helpers = {
    // Currency formatting
    formatCurrency(amount, decimals = 2) {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount || 0);
    },

    // Number formatting
    formatNumber(number, decimals = 2) {
        return new Intl.NumberFormat('en-GB', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number || 0);
    },

    // Percentage formatting
    formatPercentage(value, decimals = 2) {
        return (value * 100).toFixed(decimals) + '%';
    },

    // Date formatting
    formatDate(date, format = 'short') {
        if (!date) return '';
        const d = new Date(date);
        
        if (format === 'short') {
            return d.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } else if (format === 'long') {
            return d.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } else if (format === 'iso') {
            return d.toISOString().split('T')[0];
        }
        
        return d.toLocaleDateString('en-GB');
    },

    // Get current UK tax year
    getCurrentTaxYear() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // UK tax year starts on 6 April
        if (month < 3 || (month === 3 && now.getDate() < 6)) {
            return `${year - 1}-${year.toString().substr(2)}`;
        } else {
            return `${year}-${(year + 1).toString().substr(2)}`;
        }
    },

    // VAT calculation
    calculateVAT(amount, rate) {
        return amount * rate;
    },

    addVAT(amount, rate) {
        return amount * (1 + rate);
    },

    removeVAT(amount, rate) {
        return amount / (1 + rate);
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Generate invoice number
    generateInvoiceNumber(prefix = 'INV', lastNumber = 0) {
        const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
        return `${prefix}-${nextNumber}`;
    },

    // Debounce function
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

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // Validate email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate UK postcode
    isValidPostcode(postcode) {
        const re = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
        return re.test(postcode);
    },

    // Validate UK VAT number
    isValidVATNumber(vat) {
        const re = /^GB\d{9}$/;
        return re.test(vat);
    },

    // Calculate income tax (2025/26)
    calculateIncomeTax(income) {
        const bands = [
            { min: 0, max: 12570, rate: 0.00 },
            { min: 12571, max: 50270, rate: 0.20 },
            { min: 50271, max: 125140, rate: 0.40 },
            { min: 125140, max: Infinity, rate: 0.45 }
        ];

        let totalTax = 0;
        const breakdown = [];

        bands.forEach(band => {
            if (income > band.min) {
                const taxableInBand = Math.min(income, band.max) - band.min;
                const taxInBand = taxableInBand * band.rate;

                if (taxableInBand > 0) {
                    totalTax += taxInBand;
                    breakdown.push({
                        band: `£${band.min.toLocaleString()} - ${band.max === Infinity ? '∞' : '£' + band.max.toLocaleString()}`,
                        rate: band.rate,
                        taxable: taxableInBand,
                        tax: taxInBand
                    });
                }
            }
        });

        return { totalTax, breakdown };
    },

    // Calculate National Insurance
    calculateNI(income) {
        const bands = [
            { min: 0, max: 12570, rate: 0.00 },
            { min: 12571, max: 50270, rate: 0.12 },
            { min: 50271, max: Infinity, rate: 0.02 }
        ];

        let totalNI = 0;
        const breakdown = [];

        bands.forEach(band => {
            if (income > band.min) {
                const niableInBand = Math.min(income, band.max) - band.min;
                const niInBand = niableInBand * band.rate;

                if (niableInBand > 0) {
                    totalNI += niInBand;
                    breakdown.push({
                        band: `£${band.min.toLocaleString()} - ${band.max === Infinity ? '∞' : '£' + band.max.toLocaleString()}`,
                        rate: band.rate,
                        niable: niableInBand,
                        ni: niInBand
                    });
                }
            }
        });

        return { totalNI, breakdown };
    },

    // Export to CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            helpers.showNotification('No data to export', 'warning');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    let cell = row[header];
                    if (cell === null || cell === undefined) cell = '';
                    // Escape quotes and wrap in quotes if contains comma
                    if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
                        cell = '"' + cell.replace(/"/g, '""') + '"';
                    }
                    return cell;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'export.csv';
        link.click();
    }
};

// Add CSS animations
if (!document.getElementById('helpers-styles')) {
    const style = document.createElement('style');
    style.id = 'helpers-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
