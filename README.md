# NigerianTax Pro - Tax Accounting Software

## Overview

NigerianTax Pro is a comprehensive tax accounting software application designed specifically for Nigerian businesses, individuals, and tax professionals. The application is fully compliant with the **Nigerian Revenue Service (NRS) 2026 Tax Act** and provides automated calculations for all major tax types in Nigeria.

## Features

### 1. Personal Income Tax (PAYE) Calculator
- **Progressive tax bands**: 7% to 24% based on income levels
- **Consolidated Relief Allowance**: Automatically calculates the higher of:
  - 1% of gross income, OR
  - ₦200,000 + 20% of gross income
- **Pension contributions**: Deductible at 8% of gross income
- **Minimum tax**: Applies 0.5% of gross income when regular tax is lower
- **Detailed breakdown**: Shows tax by each income band

### 2. Companies Income Tax (CIT) Calculator
- **Tiered tax rates**:
  - Small companies (< ₦25M turnover): 20%
  - Medium companies (₦25M - ₦100M): 20%
  - Large companies (> ₦100M): 30%
- **Capital allowances**: Support for various asset classes
- **Loss relief**: Carry forward losses up to 4 years
- **Education tax**: Automatic 2% calculation
- **Minimum tax**: Based on turnover, gross profit, or net assets

### 3. Value Added Tax (VAT) Calculator
- **Standard rate**: 10% (as per NRS 2026 Act)
- **Output and input VAT**: Calculates net VAT payable
- **Registration threshold**: ₦25 million annual turnover
- **Zero-rated supplies**: Exports, diplomatic purchases, basic food, etc.
- **Exempt supplies**: Medical services, education, residential rent, etc.
- **VAT credit**: Handles cases where input VAT exceeds output VAT

### 4. Withholding Tax (WHT) Calculator
- **Comprehensive rates**:
  - Dividends, Interest, Rent, Royalties: 10%
  - Professional Fees, Construction, Commission: 5%
  - Technical Fees, Directors Fees: 10%
- **Exemption threshold**: Payments below ₦5,000
- **Final tax indication**: Shows when WHT is final tax
- **Net payment calculation**: Automatically deducts WHT

### 5. FIRS Compliance Report Generator
- Consolidated view of all tax obligations
- Summary of PAYE, CIT, VAT, and WHT
- Filing requirements and deadlines
- Export capabilities (JSON format)
- Print-friendly format

## Tax Rules & Calculations

### PAYE (Personal Income Tax)

#### Tax Bands (NRS 2026 Act)
```
First ₦300,000:              7%
Next ₦300,000:               11%
Next ₦500,000:               15%
Next ₦500,000:               19%
Next ₦1,600,000:             21%
Above ₦3,200,000:            24%
```

#### Calculation Steps
1. Calculate Consolidated Relief Allowance (CRA)
2. Deduct pension contributions (8% of gross income)
3. Calculate taxable income = Gross income - CRA - Pension
4. Apply progressive tax bands
5. Check minimum tax (0.5% of gross income if income > ₦300,000)

#### Example
For annual income of ₦5,000,000:
- CRA = max(1% × 5M, 200K + 20% × 5M) = ₦1,200,000
- Pension (8%) = ₦400,000
- Taxable income = ₦3,400,000
- Tax calculation:
  - First ₦300,000 @ 7% = ₦21,000
  - Next ₦300,000 @ 11% = ₦33,000
  - Next ₦500,000 @ 15% = ₦75,000
  - Next ₦500,000 @ 19% = ₦95,000
  - Next ₦1,600,000 @ 21% = ₦336,000
  - Remaining ₦200,000 @ 24% = ₦48,000
- **Total Tax = ₦608,000**

### CIT (Companies Income Tax)

#### Tax Rates
- **Small companies** (turnover < ₦25M): 20%
- **Medium companies** (₦25M - ₦100M): 20%
- **Large companies** (> ₦100M): 30%

#### Additional Levies
- **Education Tax**: 2% of assessable profit
- **NITDL** (if turnover > ₦100M): 1% of PBT
- **Police Trust Fund Levy** (if profit > ₦100M): 0.5% of net profit

#### Minimum Tax
Applied when computed tax is less than minimum tax, calculated as the highest of:
- 0.5% of turnover
- 2.5% of gross profit
- 0.5% of net assets

#### Capital Allowances
- **Buildings**: 10% per annum
- **Plant & Machinery**: 50% initial + 25% annual
- **Motor Vehicles**: 25% per annum
- **Furniture**: 20% per annum
- **Computers**: 30% per annum

### VAT (Value Added Tax)

#### VAT Rate
- **Standard rate**: 10% (effective 2026)
- **Registration threshold**: ₦25 million annual turnover

#### Zero-Rated Supplies (0% VAT, input VAT recoverable)
- Exports of goods and services
- Goods purchased by diplomats
- Basic medical and pharmaceutical products
- Basic food items
- Books and educational materials
- Baby products

#### Exempt Supplies (no VAT, input VAT not recoverable)
- Medical services
- Rent on residential properties
- Exported services
- Services in free trade zones
- Education services (all levels)
- Commercial vehicles and spare parts

#### Calculation
```
Output VAT = VATable Sales × 10%
Input VAT = VATable Purchases × 10%
Net VAT Payable = Output VAT - Input VAT
```

### WHT (Withholding Tax)

#### Rates by Payment Type
| Payment Type | Rate |
|-------------|------|
| Dividends | 10% |
| Interest | 10% |
| Rent | 10% |
| Royalties | 10% |
| Technical/Management Fees | 10% |
| Directors Fees | 10% |
| Professional Fees | 5% |
| Construction Services | 5% |
| Commission | 5% |

#### Filing Requirements
- Monthly returns due by 21st of following month
- Remittance to FIRS within 21 days
- Use of WHT certificates for deductees

## Technical Architecture

### Modular Design
The application follows a modular architecture for maintainability and scalability:

```
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Styling
├── js/
│   ├── tax-rates.js        # Tax rates and thresholds (NRS 2026)
│   ├── tax-engine.js       # Core tax computation logic
│   ├── tax-utils.js        # Utility functions
│   └── script.js           # Frontend interactions
└── README.md               # Documentation
```

### Key Components

#### 1. tax-rates.js
Contains all tax rates, bands, and thresholds from the NRS 2026 Act:
- PAYE bands and rates
- CIT rates and thresholds
- VAT rates and exemptions
- WHT rates by payment type
- Other levies and taxes

#### 2. tax-engine.js
Core computation engine with methods:
- `calculatePAYE()` - Personal income tax calculations
- `calculateCIT()` - Corporate income tax calculations
- `calculateVAT()` - VAT calculations
- `calculateWHT()` - Withholding tax calculations
- `generateComplianceReport()` - Comprehensive tax report

#### 3. tax-utils.js
Helper functions for:
- Input validation
- Currency formatting
- Number formatting
- Error handling
- Export functionality
- Print functionality

#### 4. script.js
Frontend integration:
- Form handling
- Result display
- Tab navigation
- Event listeners
- Report generation

## Usage Instructions

### For Individuals (PAYE)
1. Navigate to the PAYE Calculator tab
2. Enter your annual gross income
3. Optionally enter pension contribution (or leave blank for auto-calculation)
4. Click "Calculate PAYE"
5. View detailed breakdown of your tax liability

### For Companies (CIT)
1. Navigate to the CIT Calculator tab
2. Enter annual turnover, gross profit, and assessable profit
3. Optionally add capital allowances, losses, and net assets
4. Click "Calculate CIT"
5. Review tax liability including education tax

### For VAT
1. Navigate to the VAT Calculator tab
2. Enter VATable sales and purchases
3. Optionally add zero-rated and exempt sales
4. Click "Calculate VAT"
5. See net VAT payable or credit

### For WHT
1. Navigate to the WHT Calculator tab
2. Select payment type from dropdown
3. Enter payment amount
4. Click "Calculate WHT"
5. View WHT amount and net payment

### For Compliance Reports
1. Fill in one or more tax calculators
2. Navigate to Compliance Report tab
3. Enter reporting period
4. Click "Generate Compliance Report"
5. Export or print the report

## Installation & Deployment

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - pure HTML, CSS, JavaScript

### Web Deployment
1. Upload all files to web server
2. Ensure correct directory structure is maintained
3. No server-side processing required
4. Works with any static web hosting (GitHub Pages, Netlify, Vercel, etc.)

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy & Security
- **No data storage**: All calculations performed client-side
- **No data transmission**: No data sent to servers
- **No cookies**: No tracking or user data collection
- **Open source**: Transparent calculation logic

## Assumptions & Limitations

### Assumptions
1. All amounts are in Nigerian Naira (₦)
2. Tax year is calendar year (Jan 1 - Dec 31)
3. Companies are Nigerian-resident for tax purposes
4. Standard tax rules apply (no special regimes)
5. All income/transactions are within Nigeria

### Limitations
1. Does not handle:
   - Tax treaties and foreign tax credits
   - Pioneer status and special incentives
   - Petroleum profits tax
   - Capital gains tax
   - Stamp duties
   - Personal income tax for special categories (e.g., entertainment)
2. Not a substitute for professional tax advice
3. Users responsible for accuracy of input data

## Compliance Notes

### NRS 2026 Act Compliance
All calculations strictly follow the NRS 2026 Tax Act provisions:
- Updated tax rates as of 2026
- Current relief allowances and thresholds
- Latest filing requirements
- Current levy provisions

### Regular Updates
Tax laws change regularly. This application reflects the NRS 2026 Act as understood at the time of development. Users should:
- Verify current rates with FIRS
- Consult tax professionals for complex situations
- Check for application updates regularly

## Support & Contribution

### Getting Help
- Review this documentation
- Check the info boxes in each calculator
- Contact: info@nigeriantaxpro.com

### Reporting Issues
If you find calculation errors or bugs:
1. Document the inputs used
2. Note the expected vs actual result
3. Include any error messages
4. Submit via GitHub issues or email

## License
This software is provided for educational and professional use. Please consult the LICENSE file for full terms.

## Disclaimer
This application provides tax calculation estimates based on NRS 2026 Act provisions. While we strive for accuracy:
- Tax situations can be complex and unique
- Results should be verified by tax professionals
- The developers are not liable for any tax miscalculations
- Users are responsible for their tax compliance
- This is not professional tax advice

Always consult with a qualified tax professional or the Federal Inland Revenue Service (FIRS) for official tax guidance.

## Version
**Version**: 1.0.0  
**Last Updated**: February 2026  
**Tax Year**: 2026  
**Compliant With**: NRS 2026 Nigerian Tax Act

---

**NigerianTax Pro** - Simplifying Nigerian Tax Compliance
