/**
 * API Documentation
 * Comprehensive API endpoint documentation for UK Tax Accounting Application
 */

# UK Tax Accounting API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Smith"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith"
  },
  "token": "jwt_token"
}
```

### Get Current User
**GET** `/auth/me`

Get current authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Business Management Endpoints

### Create Business
**POST** `/businesses`

Create a new business entity.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Business Ltd",
  "type": "limited_company",
  "registrationNumber": "12345678",
  "vatRegistered": true,
  "vatNumber": "GB123456789",
  "address": {
    "street": "123 High Street",
    "city": "London",
    "postcode": "SW1A 1AA"
  }
}
```

**Response (201):**
```json
{
  "message": "Business created successfully",
  "business": {
    "id": "uuid",
    "userId": "uuid",
    "name": "My Business Ltd",
    "type": "limited_company",
    "vatRegistered": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Businesses
**GET** `/businesses`

Get all businesses owned by the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "count": 2,
  "businesses": [
    {
      "id": "uuid",
      "name": "My Business Ltd",
      "type": "limited_company"
    }
  ]
}
```

### Get Business by ID
**GET** `/businesses/:id`

Get specific business details.

**Headers:** `Authorization: Bearer <token>`

### Update Business
**PUT** `/businesses/:id`

Update business information.

**Headers:** `Authorization: Bearer <token>`

### Delete Business
**DELETE** `/businesses/:id`

Delete a business.

**Headers:** `Authorization: Bearer <token>`

---

## Transaction Endpoints

### Create Transaction
**POST** `/transactions/:businessId/transactions`

Create a new transaction for a business.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "income",
  "category": "sales",
  "amount": 1000,
  "vatRate": "standard",
  "description": "Product sale",
  "date": "2024-01-15T00:00:00.000Z",
  "reference": "INV-001"
}
```

**Response (201):**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "uuid",
    "businessId": "uuid",
    "type": "income",
    "amount": 1000,
    "vatAmount": 200,
    "netAmount": 1000,
    "grossAmount": 1200
  },
  "taxCalculation": {
    "vatRate": 0.20,
    "vatAmount": 200
  }
}
```

### Get All Transactions
**GET** `/transactions/:businessId/transactions`

Get all transactions for a business.

**Headers:** `Authorization: Bearer <token>`

### Get Transaction Summary
**GET** `/transactions/:businessId/transactions/summary`

Get financial summary for a business.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "businessId": "uuid",
  "summary": {
    "income": 10000,
    "expenses": 5000,
    "profit": 5000,
    "vatCollected": 2000,
    "vatPaid": 1000,
    "vatLiability": 1000,
    "transactionCount": 25
  }
}
```

---

## Tax Calculation Endpoints

### Calculate VAT
**POST** `/tax/calculate/vat`

Calculate VAT for an amount.

**Request Body:**
```json
{
  "amount": 1000,
  "vatRate": "standard"
}
```

**Response (200):**
```json
{
  "calculation": {
    "netAmount": 1000,
    "vatRate": 0.20,
    "vatRatePercentage": "20.00%",
    "vatAmount": 200,
    "grossAmount": 1200
  }
}
```

### Calculate Income Tax
**POST** `/tax/calculate/income-tax`

Calculate UK income tax.

**Request Body:**
```json
{
  "income": 50000
}
```

**Response (200):**
```json
{
  "calculation": {
    "grossIncome": 50000,
    "totalTax": 7486,
    "netIncome": 42514,
    "effectiveRate": "14.97%",
    "breakdown": [
      {
        "band": "Basic Rate",
        "taxableAmount": 37429,
        "rate": "20.00%",
        "tax": 7485.80
      }
    ]
  }
}
```

### Calculate National Insurance
**POST** `/tax/calculate/national-insurance`

Calculate UK National Insurance contributions.

**Request Body:**
```json
{
  "income": 50000
}
```

### Calculate Corporation Tax
**POST** `/tax/calculate/corporation-tax`

Calculate UK Corporation Tax.

**Request Body:**
```json
{
  "profit": 100000
}
```

### Get Tax Rates
**GET** `/tax/rates`

Get current UK tax rates.

**Response (200):**
```json
{
  "taxYear": "2024/25",
  "rates": {
    "vat": {
      "standard": 0.20,
      "reduced": 0.05,
      "zero": 0.00
    },
    "incomeTax": { ... },
    "nationalInsurance": { ... },
    "corporationTax": { ... }
  }
}
```

### Get Business Tax Summary
**GET** `/tax/business/:businessId/summary`

Get comprehensive tax summary for a business.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "businessId": "uuid",
  "businessName": "My Business Ltd",
  "businessType": "limited_company",
  "taxSummary": {
    "financialSummary": {
      "income": 100000,
      "expenses": 50000,
      "profit": 50000
    },
    "vat": {
      "collected": 20000,
      "paid": 10000,
      "liability": 10000
    },
    "taxCalculation": {
      "profit": 50000,
      "tax": 9500,
      "netProfit": 40500,
      "rate": "19.00%"
    }
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "error": "Error message describing what went wrong"
}
```

**401 Unauthorized:**
```json
{
  "error": "No token provided. Authentication required."
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error"
}
```

---

## Business Types

Valid business types:
- `sole_trader` - Sole trader/self-employed
- `partnership` - Business partnership
- `limited_company` - Limited company

## VAT Rates

Valid VAT rate identifiers:
- `standard` - 20% (default)
- `reduced` - 5%
- `zero` - 0%

## Transaction Types

Valid transaction types:
- `income` - Money received
- `expense` - Money spent
