# Airtime Wallet App Backend

A robust and secure Node.js backend API for an airtime wallet application. This system allows users to manage digital wallets, purchase airtime, add funds, and track transaction history with comprehensive authentication and authorization.

## 🚀 Features

### Core Functionality

- **User Authentication & Authorization** - JWT-based secure authentication
- **Digital Wallet Management** - Virtual wallet with balance tracking
- **Airtime Purchase** - Buy airtime for various mobile networks
- **Fund Management** - Add funds to wallet balance
- **Transaction History** - Complete audit trail of all transactions
- **Balance Tracking** - Real-time wallet balance updates

### Security Features

- **Password Hashing** - bcrypt with salt rounds for secure password storage
- **JWT Tokens** - Secure token-based authentication with expiration
- **Input Validation** - Comprehensive request validation
- **Protected Routes** - Middleware-based route protection
- **Error Handling** - Detailed error responses with proper HTTP status codes

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Environment Management:** dotenv
- **Development:** nodemon for hot reloading
- **CORS:** Enabled for cross-origin requests

## 📁 Project Structure

```
airtime-wallet-app-backend/
│
├── src/
│   ├── config/
│   │   └── db.config.js          # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── purchaseController.js # Wallet & purchase operations
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── user.model.js        # User schema with embedded wallet
│   │   ├── wallet.model.js      # Wallet schema definition
│   │   └── transaction.model.js # Transaction schema definition
│   └── routes/
│       ├── auth.js              # Authentication routes
│       └── purchase.js          # Wallet & purchase routes
│
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
├── .env                        # Environment variables (not in repo)
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd airtime-wallet-app-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/airtime-wallet

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the application**

   **Development mode:**

   ```bash
   npm run dev
   ```

   **Production mode:**

   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /auth/currentUser
Authorization: Bearer <jwt-token>
```

### Wallet & Purchase Endpoints

#### Purchase Airtime

```http
POST /purchase/airtime
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "phoneNumber": "08012345678",
  "amount": 1000,
  "network": "MTN"
}
```

#### Add Funds to Wallet

```http
POST /purchase/add-funds
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "amount": 5000
}
```

#### Get Transaction History

```http
GET /purchase/transactions
Authorization: Bearer <jwt-token>
```

#### Get Wallet Balance

```http
GET /purchase/wallet
Authorization: Bearer <jwt-token>
```

## 🗃️ Database Schema

### User Model

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  wallet: {
    balance: Number (default: 5000),
    transactions: [Transaction]
  },
  createdAt: Date
}
```

### Transaction Model

```javascript
{
  type: String ("credit" | "debit"),
  amount: Number (required),
  description: String (required),
  balanceAfter: Number (required),
  createdAt: Date
}
```

## 🔒 Security Features

### Authentication Flow

1. User registers/logs in with email and password
2. Server validates credentials and generates JWT token
3. Client includes token in Authorization header for protected routes
4. Middleware validates token on each protected request

### Password Security

- Passwords are hashed using bcrypt with 12 salt rounds
- Plain text passwords are never stored in the database
- Password comparison uses bcrypt's secure compare function

### Input Validation

- Email format validation using regex patterns
- Password length requirements (minimum 6 characters)
- Phone number format validation for airtime purchases
- Amount validation (positive numbers only)

## 📊 Business Logic

### Wallet Operations

- **New User Bonus:** Every new user receives ₦5,000 welcome bonus
- **Transaction Tracking:** All wallet operations are recorded with timestamps
- **Balance Validation:** Insufficient balance checks prevent overdrafts
- **Atomic Operations:** Balance and transaction updates happen atomically

### Airtime Purchase Flow

1. Validate user authentication
2. Validate purchase amount and phone number
3. Check sufficient wallet balance
4. Deduct amount from wallet
5. Record transaction with details
6. Return updated balance and transaction info

## 🚀 Deployment

### Production Considerations

- Set `NODE_ENV=production` in environment variables
- Use a secure, random JWT secret
- Configure proper CORS origins
- Enable HTTPS in production
- Use a production MongoDB instance
- Implement proper logging and monitoring

### Environment Variables

```env
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<secure-random-string>
NODE_ENV=production
PORT=5000
```

## 🧪 Testing

### Manual Testing with Postman/Thunder Client

1. Import the API endpoints
2. Register a new user
3. Login to get JWT token
4. Test protected routes with the token
5. Verify wallet operations and transaction history

### Test User Flow

```bash
# 1. Register
POST /auth/register {"email": "test@test.com", "password": "test123"}

# 2. Login
POST /auth/login {"email": "test@test.com", "password": "test123"}

# 3. Check wallet (should have ₦5,000 welcome bonus)
GET /purchase/wallet

# 4. Purchase airtime
POST /purchase/airtime {"phoneNumber": "08012345678", "amount": 1000, "network": "MTN"}

# 5. Add funds
POST /purchase/add-funds {"amount": 2000}

# 6. Check transaction history
GET /purchase/transactions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues & Limitations

- Currently supports basic airtime purchase simulation
- No integration with actual mobile network APIs
- Simple transaction history (no pagination)
- Basic error logging (consider adding proper logging service)

## 🔮 Future Enhancements

- [ ] Integration with real mobile network APIs
- [ ] Transaction pagination and filtering
- [ ] Admin dashboard and user management
- [ ] Email notifications for transactions
- [ ] Two-factor authentication
- [ ] Transaction limits and KYC verification
- [ ] Multiple wallet support (different currencies)
- [ ] Refund and dispute management
- [ ] Analytics and reporting features

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Built with ❤️ for seamless airtime wallet management**
