# NigerianTax Pro - Tax & Accounting Application

A modern, responsive front-end prototype for a Nigerian tax and accounting application compliant with the NRS 2026 Act.

## Overview

NigerianTax Pro is designed to automate Nigerian tax compliance, providing comprehensive tools for:
- Personal Income Tax (PAYE)
- Companies Income Tax (CIT)
- Value Added Tax (VAT)
- Withholding Tax (WHT)
- Full accounting suite
- FIRS compliance reporting

## Features

### 1. Responsive Header
- Logo with Nigerian Naira (₦) symbol
- Navigation menu: Home, Features, Pricing, Contact
- Mobile-responsive hamburger menu
- Sticky header with scroll effects

### 2. Hero Section
- Engaging headline: "Automating Nigerian Tax Compliance Simplified"
- Descriptive subtitle about NRS 2026 Act compliance
- Call-to-action buttons: "Get Started" and "Learn More"
- Hero illustration placeholder

### 3. Features Section
Six comprehensive feature cards:
- **Personal Income Tax (PAYE)**: Automated calculations with Nigerian tax bands
- **Companies Income Tax (CIT)**: Corporate tax with capital allowances
- **Value Added Tax (VAT)**: FIRS-compliant VAT returns
- **Withholding Tax (WHT)**: Automated deductions
- **Full Accounting Suite**: Complete chart of accounts and financial statements
- **FIRS Compliance Reports**: Export capabilities for PDF, Excel, CSV

### 4. Footer
- Company information and branding
- Quick links navigation
- Legal links (Privacy Policy, Terms of Service, Compliance)
- Contact information (email, phone, location)
- Social media placeholders (Facebook, Twitter, LinkedIn)

## Technical Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with:
  - CSS Variables for theming
  - Flexbox and Grid layouts
  - Responsive design (mobile-first approach)
  - Smooth transitions and animations
- **JavaScript**: Interactive features including:
  - Mobile menu toggle
  - Smooth scrolling
  - Scroll-based animations
  - Active section highlighting

## File Structure

```
.
├── index.html              # Main HTML file
├── styles.css              # CSS styles (7.6KB)
├── script.js               # JavaScript functionality (4.2KB)
├── assets/
│   └── logo-placeholder.svg # Logo with Naira symbol
├── README.md               # Documentation
└── Tax/                    # Original reference files
```

## Getting Started

### View the Prototype

1. **Simple HTTP Server (Python)**
   ```bash
   python3 -m http.server 8080
   ```
   Then open http://localhost:8080 in your browser.

2. **Live Server (VS Code Extension)**
   - Install the "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

3. **Direct File Access**
   - Simply open `index.html` in your web browser

## Responsive Design

The prototype is fully responsive and tested on:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

### Mobile Features
- Hamburger menu with smooth animation
- Stacked layout for optimal mobile viewing
- Touch-friendly button sizes
- Optimized typography for smaller screens

## Browser Compatibility

Tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## NRS 2026 Act Compliance

This prototype is designed with Nigerian tax compliance in mind, specifically referencing:
- Federal Inland Revenue Service (FIRS) requirements
- Nigerian Revenue Service Act 2026
- Nigerian accounting standards
- Local currency (Nigerian Naira - ₦)

## Future Enhancements

Potential additions for the full application:
- User authentication and authorization
- Backend API integration
- Real-time tax calculations
- Database for storing user data
- Multi-user support (individuals, SMEs, corporations)
- Document upload and management
- Automated tax filing
- Analytics dashboard
- Integration with Nigerian banking systems

## Development

### Prerequisites
- Modern web browser
- Text editor or IDE
- Local web server (optional)

### Customization
1. **Colors**: Edit CSS variables in `styles.css` (`:root` section)
2. **Content**: Update text in `index.html`
3. **Logo**: Replace `assets/logo-placeholder.svg` with your logo
4. **Features**: Add/remove feature cards in the features section

## License

Copyright © 2026 NigerianTax Pro. All rights reserved.

## Contact

For questions or feedback:
- Email: info@nigeriantaxpro.com
- Phone: +234 (0) 800 TAX HELP
- Location: Lagos, Nigeria

---

**Note**: This is a prototype front-end. Backend functionality and actual tax calculation features are not implemented in this version.
