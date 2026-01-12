# Finance Tracker - Full Stack Application

A complete personal finance tracking application with React frontend and Node.js backend.

## 🚀 Features

- **User Authentication**: Secure JWT-based login/signup
- **Transaction Management**: Add, edit, delete income and expenses
- **Categories**: Organize transactions with custom categories
- **Financial Summaries**: Monthly and yearly financial insights
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Real-time Data**: Live updates with backend synchronization

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication
- bcryptjs for password hashing
- Express validation

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database called `finance_tracker`
3. Update the `DATABASE_URL` in `server/.env`

```bash
# Example for local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/finance_tracker"
```

#### Option B: Free Cloud Database (Recommended)
Use a free PostgreSQL service like:
- **Supabase** (recommended): https://supabase.com
- **Railway**: https://railway.app
- **Neon**: https://neon.tech

1. Create a free account
2. Create a new PostgreSQL database
3. Copy the connection string to `server/.env`

### 3. Environment Variables

Create `server/.env` file:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# JWT Secret (change this!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

### 4. Database Migration

```bash
cd server

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Optional: Open Prisma Studio to view data
npm run db:studio
```

### 5. Start the Application

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend (in project root)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Prisma Studio: http://localhost:5555 (if running)

## 📱 Usage

### 1. Create Account
- Visit http://localhost:5173
- Click "Sign Up" and create your account
- Default categories will be created automatically

### 2. Add Transactions
- Use the "Add Transaction" tab
- Select income or expense
- Choose a category
- Enter amount and description

### 3. View Reports
- Dashboard shows financial overview
- Reports tab provides detailed analytics
- Filter by date ranges and categories

## 🗄 Database Schema

### Users Table
- `id`: Unique identifier
- `email`: User email (unique)
- `name`: User's full name
- `password`: Hashed password
- `created_at`: Account creation timestamp

### Categories Table
- `id`: Unique identifier
- `name`: Category name
- `type`: INCOME or EXPENSE
- `user_id`: Foreign key to users table

### Transactions Table
- `id`: Unique identifier
- `type`: INCOME or EXPENSE
- `amount`: Transaction amount (decimal)
- `description`: Transaction description
- `date`: Transaction date
- `notes`: Optional notes
- `user_id`: Foreign key to users table
- `category_id`: Foreign key to categories table

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get financial summary

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway or Render
3. Set start command: `npm start`
4. Add environment variables
5. Connect to PostgreSQL database

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV=production
FRONTEND_URL="https://your-frontend-domain.com"
```

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm start            # Start production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## 🐛 Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check DATABASE_URL format
3. Ensure database exists
4. Run migrations: `npm run db:migrate`

### CORS Issues
1. Check FRONTEND_URL in backend .env
2. Verify frontend is running on correct port
3. Clear browser cache

### Authentication Issues
1. Check JWT_SECRET is set
2. Verify token is being sent in headers
3. Check token expiration

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the console logs
3. Ensure all environment variables are set
4. Verify database connection

---

**Happy tracking! 💰📊**