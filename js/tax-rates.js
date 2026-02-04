/**
 * Nigerian Tax Rates and Thresholds - NRS 2026 Act Compliant
 * 
 * This module contains all tax rates, bands, and thresholds as defined
 * in the Nigerian Revenue Service (NRS) 2026 Tax Act.
 */

const NigerianTaxRates = {
    // Personal Income Tax (PAYE) - Progressive Tax Bands
    // Based on consolidated relief allowance and graduated tax rates
    PAYE: {
        // Tax bands for individuals (in Naira)
        bands: [
            { min: 0, max: 300000, rate: 0.07, name: 'First ₦300,000' },
            { min: 300000, max: 600000, rate: 0.11, name: 'Next ₦300,000' },
            { min: 600000, max: 1100000, rate: 0.15, name: 'Next ₦500,000' },
            { min: 1100000, max: 1600000, rate: 0.19, name: 'Next ₦500,000' },
            { min: 1600000, max: 3200000, rate: 0.21, name: 'Next ₦1,600,000' },
            { min: 3200000, max: Infinity, rate: 0.24, name: 'Above ₦3,200,000' }
        ],
        
        // Consolidated Relief Allowance
        // Higher of 1% of gross income or ₦200,000 + 20% of gross income
        consolidatedReliefAllowance: {
            minimumPercentage: 0.01,
            baseAmount: 200000,
            additionalPercentage: 0.20
        },
        
        // Minimum Tax (where applicable)
        // Applied when computed tax is less than minimum tax
        minimumTax: {
            rate: 0.005, // 0.5% of gross income
            threshold: 300000 // Only applies if gross income > ₦300,000
        },
        
        // Pension contribution (deductible)
        pensionContribution: {
            employeeRate: 0.08, // 8% of monthly emoluments
            employerRate: 0.10  // 10% of monthly emoluments
        }
    },

    // Companies Income Tax (CIT)
    CIT: {
        // Standard corporate tax rate
        standardRate: 0.30, // 30% for large companies
        
        // Small and medium companies (turnover < ₦25 million)
        smallCompanyRate: 0.20, // 20% for small companies
        smallCompanyThreshold: 25000000,
        
        // Medium companies (₦25m - ₦100m turnover)
        mediumCompanyRate: 0.20,
        mediumCompanyThreshold: 100000000,
        
        // Minimum tax provisions
        minimumTax: {
            // Higher of these percentages applied to relevant base
            rates: [
                { base: 'turnover', rate: 0.005 },
                { base: 'grossProfit', rate: 0.025 },
                { base: 'netAssets', rate: 0.005 }
            ]
        },
        
        // Capital allowances (annual rates)
        capitalAllowances: {
            buildings: {
                industrial: 0.10,    // 10% per annum
                nonIndustrial: 0.10  // 10% per annum
            },
            plantAndMachinery: {
                initial: 0.50,       // 50% initial allowance
                annual: 0.25         // 25% per annum on reducing balance
            },
            motorVehicles: 0.25,     // 25% per annum on reducing balance
            furniture: 0.20,         // 20% per annum on reducing balance
            computers: 0.30          // 30% per annum on reducing balance
        },
        
        // Loss relief provisions
        lossRelief: {
            carryForwardYears: 4,    // Losses can be carried forward for 4 years
            carryBackYears: 0        // No carry back allowed
        },
        
        // Education tax
        educationTax: {
            rate: 0.02,              // 2% of assessable profit
            exemptThreshold: 0       // All companies liable
        }
    },

    // Value Added Tax (VAT)
    VAT: {
        // Standard VAT rate (increased from 7.5% to 10% in NRS 2026)
        standardRate: 0.10, // 10%
        
        // VAT registration threshold
        registrationThreshold: 25000000, // ₦25 million annual turnover
        
        // Zero-rated supplies (0% VAT but input VAT recoverable)
        zeroRatedSupplies: [
            'Exports of goods and services',
            'Goods purchased by diplomats',
            'Medical and pharmaceutical products (basic)',
            'Basic food items',
            'Books and educational materials',
            'Baby products'
        ],
        
        // Exempt supplies (no VAT, input VAT not recoverable)
        exemptSupplies: [
            'Medical services',
            'Rent on residential properties',
            'Exported services',
            'Services in free trade zones',
            'Education services (primary, secondary, tertiary)',
            'Commercial vehicles and spare parts'
        ],
        
        // VAT collection types
        collectionTypes: {
            output: 'Output VAT on sales',
            input: 'Input VAT on purchases',
            withheld: 'VAT withheld by government agencies and corporates'
        },
        
        // VAT filing requirements
        filing: {
            frequency: 'monthly', // Monthly returns required
            deadline: 21         // 21st day of following month
        }
    },

    // Withholding Tax (WHT)
    WHT: {
        // WHT rates on various payments
        rates: {
            // Dividends, interest, and rent
            dividends: {
                rate: 0.10,
                description: 'Dividends paid to individuals and corporates'
            },
            interest: {
                rate: 0.10,
                description: 'Interest on deposits, loans, etc.'
            },
            rent: {
                rate: 0.10,
                description: 'Rent on land and buildings'
            },
            
            // Professional fees and services
            professionalFees: {
                rate: 0.05,
                description: 'Fees to consultants, contractors, professionals'
            },
            technicalFees: {
                rate: 0.10,
                description: 'Technical and management fees'
            },
            
            // Construction and contracts
            constructionServices: {
                rate: 0.05,
                description: 'Construction contracts and related services'
            },
            
            // Commission and agency fees
            commission: {
                rate: 0.05,
                description: 'Commission to agents and intermediaries'
            },
            
            // Royalties
            royalties: {
                rate: 0.10,
                description: 'Royalties on intellectual property'
            },
            
            // Directors fees
            directorsFees: {
                rate: 0.10,
                description: 'Fees to company directors'
            }
        },
        
        // WHT exemption threshold
        exemptionThreshold: 5000, // Payments below ₦5,000 exempt
        
        // Filing requirements
        filing: {
            frequency: 'monthly',
            deadline: 21 // 21 days after month end
        },
        
        // Final tax provisions
        finalTax: {
            // WHT on certain income types is final tax
            applicableTypes: ['dividends', 'interest', 'rent'],
            description: 'WHT deducted is final tax (no further tax due)'
        }
    },

    // Tertiary Education Tax
    TET: {
        rate: 0.025, // 2.5% of assessable profit
        applicableEntities: 'All registered companies in Nigeria',
        exemptions: [
            'Companies with less than ₦1 million turnover',
            'Companies in their first 4 years of operation'
        ]
    },

    // National Information Technology Development Levy (NITDL)
    NITDL: {
        rate: 0.01, // 1% of profit before tax
        threshold: 100000000, // Companies with turnover > ₦100 million
        exemptions: [
            'Companies with turnover less than ₦100 million',
            'IT companies and start-ups (first 3 years)'
        ]
    },

    // Development Levy (for telecommunication companies)
    developmentLevy: {
        rate: 0.025, // 2.5% of gross income
        applicableIndustries: ['Telecommunications', 'Broadcasting']
    },

    // Police Trust Fund Levy
    policeTrustFundLevy: {
        rate: 0.005, // 0.5% of net profit
        threshold: 100000000, // Companies with net profit > ₦100 million
        effectiveDate: '2026-01-01'
    },

    // Currency
    currency: {
        code: 'NGN',
        symbol: '₦',
        name: 'Nigerian Naira'
    },

    // Tax year
    taxYear: {
        current: 2026,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        description: 'Calendar year (1 January - 31 December)'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NigerianTaxRates;
}
