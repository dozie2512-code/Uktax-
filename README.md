# UK Tax & Accounting System

A comprehensive multi-user, multi-business accounting system for UK tax compliance and financial management. Built as an Innovator Visa prototype demonstration.

## 🚀 Features

### Core Accounting
- **Invoicing System**: Create and manage invoices with VAT calculation
- **Cashbook**: Record receipts and payments with automatic categorization
- **Bank Reconciliation**: Upload bank statements and match transactions
- **Inventory Management**: Track products, stock levels, and FIFO valuation

### Tax & Compliance
- **Tax Allowances Reference**: Comprehensive guide to UK tax allowances (2025/26)
- **Tax Computations**: 
  - Sole Trader income tax
  - Limited Company corporation tax
  - Director (salary & dividends)
  - Landlord/property income
- **Annual Accounts**: Companies House format (Micro-Entity, Small, Full)

### Multi-Business Support
- **Business Switcher**: Easily switch between multiple businesses
- **Taxpayer Types**: Support for all UK taxpayer categories
- **Data Separation**: Complete isolation of data per business

### User Management (Foundation)
- Role-based access control (Owner, Accountant, Bookkeeper, Viewer)
- User authentication system
- Session management

## 🎯 Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Data Storage**: IndexedDB for client-side persistence
- **Architecture**: Modular component-based design
- **Responsive**: Mobile, tablet, and desktop support

## 📁 File Structure

```
Uktax-/
├── app.html                    # Main application entry point
├── css/
│   └── styles.css             # Comprehensive styling system
├── js/
│   ├── app.js                 # Application initialization
│   ├── core/
│   │   ├── database.js        # IndexedDB manager
│   │   ├── auth.js            # Authentication
│   │   └── business.js        # Business management
│   ├── modules/
│   │   ├── dashboard.js       # Dashboard view
│   │   ├── invoicing.js       # Invoice management
│   │   ├── cashbook.js        # Receipts & payments
│   │   ├── reconciliation.js  # Bank reconciliation
│   │   ├── inventory.js       # Inventory management
│   │   ├── tax-allowances.js  # Tax allowances reference
│   │   ├── tax-computation.js # Tax computations
│   │   └── annual-accounts.js # Annual accounts
│   └── utils/
│       └── helpers.js         # Utility functions
├── index.html                 # Original landing page (preserved)
└── Tax                        # Original tax calculator (preserved)
```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `app.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Use Local Server
```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx http-server -p 8080

# Then visit: http://localhost:8080/app.html
```

## 📊 Demo Data

The system automatically creates demo businesses on first launch:
1. **Smith Consulting Ltd** (Limited Company)
   - UTR: 1234567890
   - Company Number: 12345678
   - VAT Registered

2. **John's Plumbing Services** (Sole Trader)
   - UTR: 9876543210

## 🔑 Key Features Demonstrated

### 1. Multi-Business Management
- Switch between businesses using the dropdown in the header
- Each business maintains separate:
  - Invoices and customers
  - Bank accounts and transactions
  - Products and inventory
  - Tax computations and reports

### 2. Tax Allowances (2025/26)
- Personal Allowance: £12,570
- Blind Person's Allowance: £3,130
- Marriage Allowance: £1,260
- Trading Allowance: £1,000
- Property Allowance: £1,000
- Rent-a-Room Relief: £7,500
- Mileage Allowance: 45p/25p per mile
- Capital Gains Allowance: £3,000

### 3. Tax Computations
Supports multiple taxpayer types:
- **Sole Trader**: Full income tax and NI computation
- **Limited Company**: Corporation tax computation
- **Director**: Salary and dividends optimization
- **Landlord**: Property income tax

### 4. Annual Accounts
Generates Companies House format accounts:
- **Micro-Entity**: Simplified balance sheet
- **Small Company**: Full accounts with notes
- **Medium/Large**: Comprehensive statutory accounts

## 🎨 UI/UX Features

- Clean, professional design
- Intuitive navigation
- Responsive layout (mobile-friendly)
- Real-time form validation
- Contextual notifications
- Dashboard with key metrics

## 📱 Responsive Design

The application works seamlessly across:
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (320px - 768px)

## 🔐 Security Features

- Client-side data encryption (IndexedDB)
- Input validation and sanitization
- XSS protection
- Role-based access control
- Audit logging foundation

## 🚧 Development Status

This is a prototype/MVP demonstrating core functionality. The following areas are ready for expansion:
- PDF/iXBRL export
- Real-time collaboration
- Cloud data sync
- OCR receipt scanning
- HMRC MTD integration
- Companies House API integration

## 📝 Tax Year Information

Current implementation uses 2025/26 tax rates:
- Personal Allowance: £12,570
- Basic Rate: 20% (£12,571 - £50,270)
- Higher Rate: 40% (£50,271 - £125,140)
- Additional Rate: 45% (over £125,140)
- Employee NI: 12% (£12,571 - £50,270), 2% thereafter
- Corporation Tax: 19% (up to £50,000), 25% (over £250,000)

## 🤝 Contributing

This is a demonstration project for Innovator Visa purposes. For questions or feedback, please contact the repository owner.

## 📄 License

This project is for demonstration purposes. All rights reserved.

## 🎯 Innovator Visa Compliance

This system demonstrates:
1. **Innovation**: Novel approach to UK tax compliance
2. **Scalability**: Multi-tenant architecture
3. **Viability**: Enterprise-ready foundation
4. **Market Need**: Addresses UK SME accounting challenges

## 📞 Support

For technical support or inquiries:
- Email: demo@uktaxaccounting.com
- GitHub Issues: [Repository Issues](https://github.com/dozie2512-code/Uktax-/issues)

---

**Built with ❤️ for UK Businesses**
