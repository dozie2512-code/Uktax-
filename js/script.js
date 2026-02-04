/**
 * Nigerian Tax Pro - Main Application Script
 * Handles all frontend interactions and integrates with tax computation engine
 */

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize calculator tabs if they exist
    initializeCalculatorTabs();
    
    // Add Enter key support for all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Find the nearest button and click it
                const form = this.closest('form') || this.closest('.tab-content');
                const button = form?.querySelector('.btn:not(.btn-secondary)');
                if (button) {
                    button.click();
                }
            }
        });
    });
}

function initializeCalculatorTabs() {
    const tabButtons = document.querySelectorAll('.calculator-tab');
    const tabContents = document.querySelectorAll('.calculator-content');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * PAYE Calculator Functions
 */
function calculatePAYE() {
    try {
        // Get input values
        const grossIncome = TaxUtils.validateNumber(
            document.getElementById('payeGrossIncome').value,
            'Gross Income'
        );
        
        const pensionInput = document.getElementById('payePension').value;
        const pensionContribution = pensionInput ? TaxUtils.validateNumber(pensionInput, 'Pension Contribution') : 0;
        
        // Calculate PAYE
        const result = NigerianTaxEngine.calculatePAYE(grossIncome, pensionContribution);
        
        // Display results
        displayPAYEResults(result);
        
    } catch (error) {
        TaxUtils.showError('payeResult', error.message);
    }
}

function displayPAYEResults(result) {
    const rows = [
        { label: 'Gross Annual Income', value: TaxUtils.formatCurrency(result.grossIncome) },
        { label: 'Consolidated Relief Allowance', value: TaxUtils.formatCurrency(result.consolidatedReliefAllowance) },
        { label: 'Pension Contribution (8%)', value: TaxUtils.formatCurrency(result.pensionContribution) },
        { label: 'Taxable Income', value: TaxUtils.formatCurrency(result.taxableIncome) },
        { label: 'Annual Income Tax', value: TaxUtils.formatCurrency(result.tax), highlight: true },
        { label: 'Monthly Tax', value: TaxUtils.formatCurrency(result.tax / 12), highlight: true },
        { label: 'Net Annual Income', value: TaxUtils.formatCurrency(result.netIncome) },
        { label: 'Effective Tax Rate', value: TaxUtils.formatPercentage(result.effectiveRate) }
    ];
    
    let html = TaxUtils.createResultCard('PAYE Calculation Results', rows);
    
    // Add breakdown
    if (result.breakdown.length > 0) {
        const breakdownItems = result.breakdown.map(item => ({
            label: `${item.band}: ${TaxUtils.formatCurrency(item.income)} @ ${TaxUtils.formatPercentage(item.rate)}`,
            value: TaxUtils.formatCurrency(item.tax)
        }));
        html += TaxUtils.createBreakdown('Tax Breakdown by Band', breakdownItems);
    }
    
    // Add minimum tax info if applicable
    if (result.minimumTaxApplies) {
        html += TaxUtils.createInfoBox(
            'Minimum Tax Applied',
            '<p>Your computed tax was less than the minimum tax threshold. Minimum tax of 0.5% of gross income has been applied.</p>',
            'warning'
        );
    }
    
    document.getElementById('payeResult').innerHTML = html;
}

/**
 * CIT Calculator Functions
 */
function calculateCIT() {
    try {
        // Get input values
        const turnover = TaxUtils.validateNumber(
            document.getElementById('citTurnover').value,
            'Turnover'
        );
        
        const grossProfit = TaxUtils.validateNumber(
            document.getElementById('citGrossProfit').value,
            'Gross Profit'
        );
        
        const assessableProfit = TaxUtils.validateNumber(
            document.getElementById('citAssessableProfit').value,
            'Assessable Profit'
        );
        
        const capitalAllowances = document.getElementById('citCapitalAllowances').value ?
            TaxUtils.validateNumber(document.getElementById('citCapitalAllowances').value, 'Capital Allowances') : 0;
        
        const lossesCarriedForward = document.getElementById('citLosses').value ?
            TaxUtils.validateNumber(document.getElementById('citLosses').value, 'Losses Carried Forward') : 0;
        
        const netAssets = document.getElementById('citNetAssets').value ?
            TaxUtils.validateNumber(document.getElementById('citNetAssets').value, 'Net Assets') : 0;
        
        // Calculate CIT
        const companyData = {
            turnover,
            grossProfit,
            assessableProfit,
            capitalAllowances,
            lossesCarriedForward,
            netAssets
        };
        
        const result = NigerianTaxEngine.calculateCIT(companyData);
        
        // Display results
        displayCITResults(result);
        
    } catch (error) {
        TaxUtils.showError('citResult', error.message);
    }
}

function displayCITResults(result) {
    const rows = [
        { label: 'Annual Turnover', value: TaxUtils.formatCurrency(result.turnover) },
        { label: 'Gross Profit', value: TaxUtils.formatCurrency(result.grossProfit) },
        { label: 'Assessable Profit', value: TaxUtils.formatCurrency(result.assessableProfit) },
        { label: 'Capital Allowances', value: TaxUtils.formatCurrency(result.capitalAllowances) },
        { label: 'Losses Carried Forward', value: TaxUtils.formatCurrency(result.lossesCarriedForward) },
        { label: 'Chargeable Profit', value: TaxUtils.formatCurrency(result.chargeableProfit) },
        { label: `Tax Rate (${result.rateDescription})`, value: TaxUtils.formatPercentage(result.taxRate) },
        { label: 'Companies Income Tax', value: TaxUtils.formatCurrency(result.cit), highlight: true },
        { label: 'Education Tax (2%)', value: TaxUtils.formatCurrency(result.educationTax) },
        { label: 'Total Tax Liability', value: TaxUtils.formatCurrency(result.totalTax), highlight: true },
        { label: 'Net Profit After Tax', value: TaxUtils.formatCurrency(result.netProfit) }
    ];
    
    let html = TaxUtils.createResultCard('Companies Income Tax Calculation Results', rows);
    
    // Add minimum tax info if applicable
    if (result.minimumTaxApplies) {
        const minTaxInfo = result.minimumTaxOptions
            .map(opt => `<li>${opt.base}: ${TaxUtils.formatCurrency(opt.amount)} × ${TaxUtils.formatPercentage(opt.rate)} = ${TaxUtils.formatCurrency(opt.tax)}</li>`)
            .join('');
        
        html += TaxUtils.createInfoBox(
            'Minimum Tax Applied',
            `<p>Your computed CIT was less than the minimum tax. The highest minimum tax has been applied:</p><ul>${minTaxInfo}</ul>`,
            'warning'
        );
    }
    
    document.getElementById('citResult').innerHTML = html;
}

/**
 * VAT Calculator Functions
 */
function calculateVAT() {
    try {
        // Get input values
        const outputVATableSales = TaxUtils.validateNumber(
            document.getElementById('vatOutputSales').value,
            'VATable Sales'
        );
        
        const inputVATablePurchases = TaxUtils.validateNumber(
            document.getElementById('vatInputPurchases').value,
            'VATable Purchases'
        );
        
        const zeroRatedSales = document.getElementById('vatZeroRated').value ?
            TaxUtils.validateNumber(document.getElementById('vatZeroRated').value, 'Zero-rated Sales') : 0;
        
        const exemptSales = document.getElementById('vatExempt').value ?
            TaxUtils.validateNumber(document.getElementById('vatExempt').value, 'Exempt Sales') : 0;
        
        // Calculate VAT
        const vatData = {
            outputVATableSales,
            inputVATablePurchases,
            zeroRatedSales,
            exemptSales
        };
        
        const result = NigerianTaxEngine.calculateVAT(vatData);
        
        // Display results
        displayVATResults(result);
        
    } catch (error) {
        TaxUtils.showError('vatResult', error.message);
    }
}

function displayVATResults(result) {
    const rows = [
        { label: 'VATable Sales', value: TaxUtils.formatCurrency(result.outputVATableSales) },
        { label: 'VATable Purchases', value: TaxUtils.formatCurrency(result.inputVATablePurchases) },
        { label: 'Zero-rated Sales', value: TaxUtils.formatCurrency(result.zeroRatedSales) },
        { label: 'Exempt Sales', value: TaxUtils.formatCurrency(result.exemptSales) },
        { label: 'Total Sales', value: TaxUtils.formatCurrency(result.totalSales) },
        { label: `VAT Rate`, value: TaxUtils.formatPercentage(result.vatRate) },
        { label: 'Output VAT', value: TaxUtils.formatCurrency(result.outputVAT) },
        { label: 'Input VAT', value: TaxUtils.formatCurrency(result.inputVAT) }
    ];
    
    if (result.vatCredit > 0) {
        rows.push({ label: 'VAT Credit (Refundable)', value: TaxUtils.formatCurrency(result.vatCredit), highlight: true });
    } else {
        rows.push({ label: 'Net VAT Payable', value: TaxUtils.formatCurrency(result.netVATPayable), highlight: true });
    }
    
    let html = TaxUtils.createResultCard('VAT Calculation Results', rows);
    
    // Add registration info
    if (!result.registrationRequired) {
        html += TaxUtils.createInfoBox(
            'VAT Registration',
            `<p>Your annual turnover (${TaxUtils.formatCurrency(result.totalSales)}) is below the registration threshold of ${TaxUtils.formatCurrency(result.registrationThreshold)}. VAT registration is not mandatory but may be voluntary.</p>`,
            'info'
        );
    } else {
        html += TaxUtils.createInfoBox(
            'VAT Registration Required',
            `<p>Your annual turnover exceeds ${TaxUtils.formatCurrency(result.registrationThreshold)}. VAT registration is mandatory. File monthly returns by the 21st of each month.</p>`,
            'warning'
        );
    }
    
    document.getElementById('vatResult').innerHTML = html;
}

/**
 * WHT Calculator Functions
 */
function calculateWHT() {
    try {
        // Get input values
        const paymentType = document.getElementById('whtType').value;
        const paymentAmount = TaxUtils.validateNumber(
            document.getElementById('whtAmount').value,
            'Payment Amount'
        );
        
        // Calculate WHT
        const result = NigerianTaxEngine.calculateWHT(paymentType, paymentAmount);
        
        // Display results
        displayWHTResults(result);
        
    } catch (error) {
        TaxUtils.showError('whtResult', error.message);
    }
}

function displayWHTResults(result) {
    if (result.exempt) {
        const html = TaxUtils.createInfoBox(
            'Payment Exempt from WHT',
            `<p>This payment of ${TaxUtils.formatCurrency(result.paymentAmount)} is below the exemption threshold of ${TaxUtils.formatCurrency(result.exemptionThreshold)} and is therefore exempt from Withholding Tax.</p>`,
            'info'
        );
        document.getElementById('whtResult').innerHTML = html;
        return;
    }
    
    const rows = [
        { label: 'Payment Type', value: result.description },
        { label: 'Gross Payment Amount', value: TaxUtils.formatCurrency(result.paymentAmount) },
        { label: 'WHT Rate', value: TaxUtils.formatPercentage(result.whtRate) },
        { label: 'WHT Amount', value: TaxUtils.formatCurrency(result.whtAmount), highlight: true },
        { label: 'Net Payment to Beneficiary', value: TaxUtils.formatCurrency(result.netPayment), highlight: true }
    ];
    
    let html = TaxUtils.createResultCard('Withholding Tax Calculation Results', rows);
    
    // Add final tax info if applicable
    if (result.isFinalTax) {
        html += TaxUtils.createInfoBox(
            'Final Tax',
            '<p>The WHT deducted on this payment type is a <strong>final tax</strong>. No further tax is due from the beneficiary on this income.</p>',
            'info'
        );
    }
    
    document.getElementById('whtResult').innerHTML = html;
}

/**
 * Compliance Report Functions
 */
function generateComplianceReport() {
    try {
        // Collect all tax data from forms (if filled)
        const period = document.getElementById('reportPeriod')?.value || TaxUtils.getTaxPeriod();
        
        // Get PAYE data if available
        let payeData = null;
        const payeIncome = document.getElementById('payeGrossIncome')?.value;
        if (payeIncome) {
            const grossIncome = parseFloat(payeIncome);
            const pension = parseFloat(document.getElementById('payePension')?.value || 0);
            payeData = NigerianTaxEngine.calculatePAYE(grossIncome, pension);
        }
        
        // Get CIT data if available
        let citData = null;
        const citTurnover = document.getElementById('citTurnover')?.value;
        if (citTurnover) {
            const companyData = {
                turnover: parseFloat(citTurnover),
                grossProfit: parseFloat(document.getElementById('citGrossProfit')?.value || 0),
                assessableProfit: parseFloat(document.getElementById('citAssessableProfit')?.value || 0),
                capitalAllowances: parseFloat(document.getElementById('citCapitalAllowances')?.value || 0),
                lossesCarriedForward: parseFloat(document.getElementById('citLosses')?.value || 0),
                netAssets: parseFloat(document.getElementById('citNetAssets')?.value || 0)
            };
            citData = NigerianTaxEngine.calculateCIT(companyData);
        }
        
        // Get VAT data if available
        let vatData = null;
        const vatSales = document.getElementById('vatOutputSales')?.value;
        if (vatSales) {
            const vatInputData = {
                outputVATableSales: parseFloat(vatSales),
                inputVATablePurchases: parseFloat(document.getElementById('vatInputPurchases')?.value || 0),
                zeroRatedSales: parseFloat(document.getElementById('vatZeroRated')?.value || 0),
                exemptSales: parseFloat(document.getElementById('vatExempt')?.value || 0)
            };
            vatData = NigerianTaxEngine.calculateVAT(vatInputData);
        }
        
        // Generate report
        const report = NigerianTaxEngine.generateComplianceReport({
            period,
            payeData,
            citData,
            vatData,
            whtData: []
        });
        
        // Display report
        displayComplianceReport(report);
        
    } catch (error) {
        TaxUtils.showError('reportResult', error.message || 'Please fill in at least one tax calculator before generating a report.');
    }
}

function displayComplianceReport(report) {
    let html = '<div class="result-card">';
    html += '<h3>FIRS Compliance Report</h3>';
    html += `<p><strong>Tax Year:</strong> ${report.taxYear}</p>`;
    html += `<p><strong>Period:</strong> ${report.period}</p>`;
    html += `<p><strong>Generated:</strong> ${new Date(report.generatedDate).toLocaleString('en-NG')}</p>`;
    html += '</div>';
    
    // Summary
    const summaryRows = [
        { label: 'Personal Income Tax (PAYE)', value: TaxUtils.formatCurrency(report.summary.totalPAYE) },
        { label: 'Companies Income Tax (CIT)', value: TaxUtils.formatCurrency(report.summary.totalCIT) },
        { label: 'Value Added Tax (VAT)', value: TaxUtils.formatCurrency(report.summary.totalVAT) },
        { label: 'Withholding Tax (WHT)', value: TaxUtils.formatCurrency(report.summary.totalWHT) },
        { label: 'Total Tax Liability', value: TaxUtils.formatCurrency(report.summary.totalTaxLiability), highlight: true }
    ];
    
    html += TaxUtils.createResultCard('Tax Summary', summaryRows);
    
    // Filing requirements
    html += '<div class="info-box">';
    html += '<h4>Filing Requirements & Deadlines</h4>';
    html += '<ul>';
    html += `<li><strong>PAYE:</strong> ${report.filingRequirements.paye}</li>`;
    html += `<li><strong>CIT:</strong> ${report.filingRequirements.cit}</li>`;
    html += `<li><strong>VAT:</strong> ${report.filingRequirements.vat}</li>`;
    html += `<li><strong>WHT:</strong> ${report.filingRequirements.wht}</li>`;
    html += '</ul>';
    html += '</div>';
    
    html += '<div class="mt-3">';
    html += `<button class="btn btn-primary" onclick="TaxUtils.printReport('reportResult')">Print Report</button>`;
    html += `<button class="btn btn-secondary" onclick="exportReport()">Export to JSON</button>`;
    html += '</div>';
    
    document.getElementById('reportResult').innerHTML = html;
}

function exportReport() {
    // Get the current report data
    const period = TaxUtils.getTaxPeriod();
    const report = {
        period,
        generatedDate: new Date().toISOString(),
        taxYear: NigerianTaxRates.taxYear.current,
        // Include all computed data
    };
    
    TaxUtils.exportToJSON(report, `tax-report-${period.replace(/\s/g, '-')}.json`);
}

// Make functions globally available
window.calculatePAYE = calculatePAYE;
window.calculateCIT = calculateCIT;
window.calculateVAT = calculateVAT;
window.calculateWHT = calculateWHT;
window.generateComplianceReport = generateComplianceReport;
window.exportReport = exportReport;
