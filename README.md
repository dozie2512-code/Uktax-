# UK Tax Accounting Application

A comprehensive, user-centric accounting application designed for UK businesses, inspired by Uber's scalable architecture.

## Features

### Core Functionality
- **Multi-User Authentication**: Secure JWT-based authentication system
- **Multi-Business Support**: Manage multiple businesses from a single account
- **Real-Time Tax Calculations**: Automatic UK tax calculations including:
  - VAT (Value Added Tax) - 20%, 5%, 0% rates
  - Income Tax with UK tax bands
  - National Insurance contributions
  - Corporation Tax
- **Transaction Management**: Record and track income and expenses
- **Invoice Generation**: Create and manage invoices
- **Dashboard Analytics**: Real-time financial overview

### UK Accounting Standards
- Compliant with UK GAAP (Generally Accepted Accounting Practice)
- HMRC tax rates and calculations
- Automated Making Tax Digital (MTD) compliance ready

## Architecture

### Backend
- **Framework**: Node.js with Express
- **Authentication**: JWT (JSON Web Tokens)
- **Data Storage**: In-memory (production-ready for database integration)
- **API**: RESTful architecture

### Frontend
- **Framework**: React
- **State Management**: React Hooks
- **Styling**: Modern CSS with responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/dozie2512-code/Uktax-.git
cd Uktax-
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm start
```

3. Access the application at `http://localhost:3000`

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Business Management
- `GET /api/businesses` - Get all businesses for user
- `POST /api/businesses` - Create new business
- `GET /api/businesses/:id` - Get specific business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Transactions
- `GET /api/businesses/:businessId/transactions` - Get all transactions
- `POST /api/businesses/:businessId/transactions` - Create transaction
- `GET /api/businesses/:businessId/transactions/:id` - Get specific transaction
- `PUT /api/businesses/:businessId/transactions/:id` - Update transaction
- `DELETE /api/businesses/:businessId/transactions/:id` - Delete transaction

### Tax Calculations
- `POST /api/tax/calculate` - Calculate taxes for a transaction
- `GET /api/businesses/:businessId/tax-summary` - Get tax summary for business

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Project Structure

```
uktax-accounting/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── client/          # React frontend
│   ├── public/      # Static files
│   └── src/         # React components
├── tests/           # Test files
├── server.js        # Entry point
└── package.json     # Dependencies
```

## UK Tax Rates (2024/25)

### VAT Rates
- Standard Rate: 20%
- Reduced Rate: 5%
- Zero Rate: 0%

### Income Tax Bands
- Personal Allowance: £12,570 (0%)
- Basic Rate: £12,571 - £50,270 (20%)
- Higher Rate: £50,271 - £125,140 (40%)
- Additional Rate: Over £125,140 (45%)

### National Insurance (Employee)
- £12,570 - £50,270: 12%
- Over £50,270: 2%

### Corporation Tax
- Main Rate: 25% (for profits over £250,000)
- Small Profits Rate: 19% (for profits up to £50,000)
- Marginal Relief: Available for profits between £50,000 and £250,000

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
