/**
 * Nigerian Tax Computation Engine - NRS 2026 Act Compliant
 * 
 * This module contains the core tax calculation logic for all Nigerian tax types.
 * All computations are based on the NRS 2026 Tax Act provisions.
 */

class NigerianTaxEngine {
    
    /**
     * Calculate Personal Income Tax (PAYE)
     * 
     * @param {number} grossIncome - Annual gross income
     * @param {number} pensionContribution - Annual pension contribution (optional)
     * @returns {Object} Tax computation details
     */
    static calculatePAYE(grossIncome, pensionContribution = 0) {
        const rates = NigerianTaxRates.PAYE;
        
        // Calculate Consolidated Relief Allowance (CRA)
        // Higher of: 1% of gross income OR (₦200,000 + 20% of gross income)
        const option1 = grossIncome * rates.consolidatedReliefAllowance.minimumPercentage;
        const option2 = rates.consolidatedReliefAllowance.baseAmount + 
                       (grossIncome * rates.consolidatedReliefAllowance.additionalPercentage);
        const cra = Math.max(option1, option2);
        
        // If pension contribution not provided, calculate default (8% of gross income)
        if (pensionContribution === 0) {
            pensionContribution = grossIncome * rates.pensionContribution.employeeRate;
        }
        
        // Calculate taxable income
        const taxableIncome = Math.max(0, grossIncome - cra - pensionContribution);
        
        // Calculate tax using progressive bands
        let tax = 0;
        let breakdown = [];
        let cumulativeIncome = 0;
        
        for (let band of rates.bands) {
            if (cumulativeIncome >= taxableIncome) break;
            
            const bandStart = cumulativeIncome;
            const bandEnd = Math.min(band.max, taxableIncome);
            const incomeInBand = Math.max(0, bandEnd - bandStart);
            
            if (incomeInBand > 0) {
                const taxInBand = incomeInBand * band.rate;
                tax += taxInBand;
                
                breakdown.push({
                    band: band.name,
                    income: incomeInBand,
                    rate: band.rate,
                    tax: taxInBand
                });
                
                cumulativeIncome += incomeInBand;
            }
        }
        
        // Check minimum tax (0.5% of gross income if > ₦300,000)
        let minimumTax = 0;
        let minimumTaxApplies = false;
        
        if (grossIncome > rates.minimumTax.threshold) {
            minimumTax = grossIncome * rates.minimumTax.rate;
            if (minimumTax > tax) {
                minimumTaxApplies = true;
                tax = minimumTax;
            }
        }
        
        const netIncome = grossIncome - tax;
        const effectiveRate = grossIncome > 0 ? (tax / grossIncome) : 0;
        
        return {
            grossIncome,
            consolidatedReliefAllowance: cra,
            pensionContribution,
            taxableIncome,
            tax,
            minimumTax,
            minimumTaxApplies,
            netIncome,
            effectiveRate,
            breakdown
        };
    }
    
    /**
     * Calculate Companies Income Tax (CIT)
     * 
     * @param {Object} companyData - Company financial data
     * @returns {Object} Tax computation details
     */
    static calculateCIT(companyData) {
        const {
            turnover,
            grossProfit,
            assessableProfit,
            capitalAllowances = 0,
            lossesCarriedForward = 0,
            netAssets = 0
        } = companyData;
        
        const rates = NigerianTaxRates.CIT;
        
        // Determine applicable tax rate based on turnover
        let taxRate;
        let rateDescription;
        
        if (turnover < rates.smallCompanyThreshold) {
            taxRate = rates.smallCompanyRate;
            rateDescription = 'Small Company Rate (20%)';
        } else if (turnover < rates.mediumCompanyThreshold) {
            taxRate = rates.mediumCompanyRate;
            rateDescription = 'Medium Company Rate (20%)';
        } else {
            taxRate = rates.standardRate;
            rateDescription = 'Standard Rate (30%)';
        }
        
        // Calculate chargeable profit
        let chargeableProfit = assessableProfit - capitalAllowances - lossesCarriedForward;
        chargeableProfit = Math.max(0, chargeableProfit);
        
        // Calculate normal CIT
        let cit = chargeableProfit * taxRate;
        
        // Calculate minimum tax (higher of the rates applied to different bases)
        const minimumTaxOptions = rates.minimumTax.rates.map(option => {
            let base = 0;
            switch(option.base) {
                case 'turnover':
                    base = turnover;
                    break;
                case 'grossProfit':
                    base = grossProfit;
                    break;
                case 'netAssets':
                    base = netAssets;
                    break;
            }
            return {
                base: option.base,
                amount: base,
                rate: option.rate,
                tax: base * option.rate
            };
        });
        
        const highestMinimumTax = Math.max(...minimumTaxOptions.map(opt => opt.tax));
        const minimumTaxApplies = highestMinimumTax > cit;
        
        if (minimumTaxApplies) {
            cit = highestMinimumTax;
        }
        
        // Calculate Education Tax (2% of assessable profit)
        const educationTax = assessableProfit * rates.educationTax.rate;
        
        // Calculate total tax liability
        const totalTax = cit + educationTax;
        
        return {
            turnover,
            grossProfit,
            assessableProfit,
            capitalAllowances,
            lossesCarriedForward,
            chargeableProfit,
            taxRate,
            rateDescription,
            cit,
            minimumTaxApplies,
            minimumTaxOptions,
            educationTax,
            totalTax,
            netProfit: assessableProfit - totalTax
        };
    }
    
    /**
     * Calculate Value Added Tax (VAT)
     * 
     * @param {Object} vatData - VAT calculation data
     * @returns {Object} VAT computation details
     */
    static calculateVAT(vatData) {
        const {
            outputVATableSales = 0,
            inputVATablePurchases = 0,
            zeroRatedSales = 0,
            exemptSales = 0
        } = vatData;
        
        const rates = NigerianTaxRates.VAT;
        const vatRate = rates.standardRate;
        
        // Calculate output VAT (VAT on sales)
        const outputVAT = outputVATableSales * vatRate;
        
        // Calculate input VAT (VAT on purchases)
        const inputVAT = inputVATablePurchases * vatRate;
        
        // Calculate net VAT payable
        let netVATPayable = outputVAT - inputVAT;
        
        // If negative, company has VAT credit
        const vatCredit = netVATPayable < 0 ? Math.abs(netVATPayable) : 0;
        netVATPayable = Math.max(0, netVATPayable);
        
        // Calculate total sales
        const totalSales = outputVATableSales + zeroRatedSales + exemptSales;
        
        // Check if registration is required
        const registrationRequired = totalSales >= rates.registrationThreshold;
        
        return {
            outputVATableSales,
            inputVATablePurchases,
            zeroRatedSales,
            exemptSales,
            totalSales,
            vatRate,
            outputVAT,
            inputVAT,
            netVATPayable,
            vatCredit,
            registrationRequired,
            registrationThreshold: rates.registrationThreshold
        };
    }
    
    /**
     * Calculate Withholding Tax (WHT)
     * 
     * @param {string} paymentType - Type of payment (e.g., 'dividends', 'interest', 'professionalFees')
     * @param {number} paymentAmount - Payment amount
     * @returns {Object} WHT computation details
     */
    static calculateWHT(paymentType, paymentAmount) {
        const rates = NigerianTaxRates.WHT;
        
        // Check if payment is below exemption threshold
        if (paymentAmount <= rates.exemptionThreshold) {
            return {
                paymentType,
                paymentAmount,
                whtRate: 0,
                whtAmount: 0,
                netPayment: paymentAmount,
                exempt: true,
                exemptionThreshold: rates.exemptionThreshold,
                isFinalTax: false
            };
        }
        
        // Get WHT rate for payment type
        const rateInfo = rates.rates[paymentType];
        
        if (!rateInfo) {
            throw new Error(`Invalid payment type: ${paymentType}`);
        }
        
        const whtRate = rateInfo.rate;
        const whtAmount = paymentAmount * whtRate;
        const netPayment = paymentAmount - whtAmount;
        
        // Check if WHT is final tax
        const isFinalTax = rates.finalTax.applicableTypes.includes(paymentType);
        
        return {
            paymentType,
            paymentAmount,
            whtRate,
            whtAmount,
            netPayment,
            exempt: false,
            description: rateInfo.description,
            isFinalTax
        };
    }
    
    /**
     * Generate FIRS Compliance Report
     * 
     * @param {Object} taxData - All tax computation data
     * @returns {Object} Compliance report
     */
    static generateComplianceReport(taxData) {
        const {
            payeData,
            citData,
            vatData,
            whtData,
            period
        } = taxData;
        
        const report = {
            period,
            generatedDate: new Date().toISOString(),
            taxYear: NigerianTaxRates.taxYear.current,
            
            summary: {
                totalPAYE: payeData ? payeData.tax : 0,
                totalCIT: citData ? citData.totalTax : 0,
                totalVAT: vatData ? vatData.netVATPayable : 0,
                totalWHT: whtData ? whtData.reduce((sum, wht) => sum + wht.whtAmount, 0) : 0
            },
            
            details: {
                paye: payeData,
                cit: citData,
                vat: vatData,
                wht: whtData
            },
            
            filingRequirements: {
                paye: 'Monthly remittance by 10th of following month',
                cit: 'Annual return within 6 months of year end',
                vat: 'Monthly return by 21st of following month',
                wht: 'Monthly return by 21st of following month'
            },
            
            complianceStatus: 'Review required - ensure all returns are filed on time'
        };
        
        // Calculate total tax liability
        report.summary.totalTaxLiability = 
            report.summary.totalPAYE + 
            report.summary.totalCIT + 
            report.summary.totalVAT + 
            report.summary.totalWHT;
        
        return report;
    }
    
    /**
     * Format currency in Nigerian Naira
     */
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: NigerianTaxRates.currency.code,
            minimumFractionDigits: 2
        }).format(amount);
    }
    
    /**
     * Format percentage
     */
    static formatPercentage(rate) {
        return (rate * 100).toFixed(2) + '%';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NigerianTaxEngine;
}
