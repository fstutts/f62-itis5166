# F62 - Nanobody Research Platform

A full-stack web application for visualizing and analyzing nanobody research data, specifically focused on snake bite research in Sub-Saharan Africa. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Frontend**: React 18 with React Router for routing
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Responsive Design**: Mobile-first responsive UI
- **Modern Styling**: Clean, professional design with CSS3

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client

# Or install all at once
npm run install-all
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/f62
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# For Linux
sudo systemctl start mongod

# For Windows
net start MongoDB
```

### 4. Run the Application

```bash
# Development mode (runs both client and server)
npm run dev

# Run server only
npm run server

# Run client only
npm run client

# Production build
npm run build
npm start
```

The application will be available at:
- **Client**: http://localhost:3000
- **Server**: http://localhost:5000

## 🏗️ Project Structure

```
F62/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (AuthContext)
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── middleware/         # Custom middleware
│   ├── index.js            # Server entry point
│   ├── .env               # Environment variables
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔗 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Routes
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### General Routes
- `GET /` - API status
- `GET /health` - Health check

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users register/login with email and password
2. Server returns a JWT token
3. Client stores token in localStorage
4. Token is included in Authorization header for protected routes
5. Server verifies token using middleware

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **React Router**: Client-side routing for SPA experience
- **Context API**: State management for authentication
- **Modern UI**: Clean, professional interface
- **Form Validation**: Client-side and server-side validation

## 🔧 Backend Features

- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Validation**: express-validator for input validation
- **CORS**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling middleware

## 🧪 Testing

```bash
# Run server tests
cd server && npm test

# Run client tests
cd client && npm test
```

## 🚀 Deployment

### Environment Variables for Production

Update your production `.env` file:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_production_jwt_secret
CLIENT_URL=your_production_client_url
```

### Build for Production

```bash
# Build the client
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you have any questions or need help with setup, please create an issue in the repository.

---

**Happy coding! 🎉**
