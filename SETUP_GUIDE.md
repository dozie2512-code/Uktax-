# UK Tax Accounting Application - Setup Guide

## Quick Start

### 1. Install Dependencies

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd client
npm install
cd ..
```

### 2. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` if you want to customize:
```
PORT=5000
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

### 3. Run the Application

#### Option A: Development Mode (Recommended)

Terminal 1 - Start backend server:
```bash
npm run dev
```

Terminal 2 - Start frontend:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Option B: Production Mode

Build and run:
```bash
npm run build
npm start
```

## Testing

Run backend tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Application Features

### For Users
1. **Register/Login**: Create an account or login
2. **Dashboard**: View overview of all businesses
3. **Business Management**: Create multiple businesses (sole trader, partnership, limited company)
4. **Transactions**: Record income and expenses with automatic VAT calculation
5. **Tax Calculator**: Calculate UK taxes without login

### For Developers
- RESTful API with comprehensive endpoints
- JWT-based authentication
- Modular code structure
- Unit tests for tax calculations
- Complete API documentation

## Project Structure

```
Uktax-/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Express middleware
├── models/             # Data models
├── routes/             # API routes
├── services/           # Business logic (tax calculations)
├── utils/              # Utility functions
├── tests/              # Test files
├── client/             # React frontend
│   ├── public/         # Static files
│   └── src/            # React components and services
├── server.js           # Server entry point
├── package.json        # Backend dependencies
└── README.md           # Documentation
```

## API Endpoints

See `API_DOCUMENTATION.md` for complete API documentation.

Key endpoints:
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/businesses` - List businesses
- `POST /api/businesses` - Create business
- `POST /api/transactions/:businessId/transactions` - Add transaction
- `POST /api/tax/calculate/vat` - Calculate VAT
- `GET /api/tax/rates` - Get UK tax rates

## UK Tax Rates (2024/25)

### VAT
- Standard: 20%
- Reduced: 5%
- Zero: 0%

### Income Tax
- Personal Allowance: £12,570 (0%)
- Basic Rate: £12,571 - £50,270 (20%)
- Higher Rate: £50,271 - £125,140 (40%)
- Additional Rate: Over £125,140 (45%)

### National Insurance
- £12,570 - £50,270: 12%
- Over £50,270: 2%

### Corporation Tax
- Small Profits (up to £50,000): 19%
- Main Rate (over £250,000): 25%
- Marginal Relief: £50,000 - £250,000

## Troubleshooting

### Port already in use
If port 5000 or 3000 is in use, change it in `.env` (backend) or update the proxy in `client/package.json` (frontend).

### Dependencies not installing
Make sure you have Node.js v14 or higher installed:
```bash
node --version
```

### Frontend can't connect to backend
Check that:
1. Backend is running on port 5000
2. Frontend proxy is configured in `client/package.json`
3. CORS is enabled (already configured)

## Development Tips

### Adding New Features
1. Create model in `models/`
2. Add business logic in `services/`
3. Create controller in `controllers/`
4. Define routes in `routes/`
5. Add tests in `tests/`
6. Update API documentation

### Database Integration
The application currently uses in-memory storage. To add a database:
1. Install database driver (e.g., `pg` for PostgreSQL, `mysql2` for MySQL)
2. Update models to use database queries
3. Add database configuration in `config/`
4. Update connection in `server.js`

### Security Best Practices
- Always use HTTPS in production
- Change JWT_SECRET to a strong random value
- Implement rate limiting for API endpoints
- Add input sanitization
- Enable helmet.js for security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
