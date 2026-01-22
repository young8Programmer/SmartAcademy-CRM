# EduCore CRM & Learning Engine

Professional CRM platform for educational centers with integrated learning management, payment processing, and automation features.

## 🚀 Features

### Core Modules

- **User Management (RBAC)**: Admin, Teacher, and Student roles with proper access control
- **Wallet & Auto-Billing**: Student balance management with automatic monthly/class-based deductions
- **Paid Online Exams**: Teachers create tests, students pay from balance, platform earns commission
- **Lead Management**: Telegram bot integration for automatic lead capture and assignment
- **Group Management**: Classes, schedules, and attendance tracking
- **Attendance Alerts**: Automatic SMS/Telegram notifications to parents when students are absent

### Frontend Features

- **Professional UI/UX**: Modern, responsive design with Tailwind CSS
- **Role-based Dashboards**: Separate interfaces for Admin, Teacher, and Student
- **Real-time Updates**: React Query for efficient data fetching
- **Mobile Responsive**: Works perfectly on all devices

## 📦 Installation

### Backend

```bash
cd .
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## 🔧 Configuration

### Backend

1. Copy `.env.example` to `.env`
2. Fill in all required environment variables:
   - Database credentials
   - JWT secret
   - Payment gateway keys (Payme/Click)
   - Telegram bot token
   - SMS API credentials

### Frontend

Frontend automatically connects to backend via proxy (configured in `vite.config.ts`)

## 🗄️ Database Setup

```bash
# Generate migration
npm run migration:generate -- src/migrations/InitialMigration

# Run migrations
npm run migration:run
```

## 🚀 Running the App

### Backend

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Backend runs on `http://localhost:3000`

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3001`

## 📚 API Documentation

Once the backend is running, visit `http://localhost:3000/api` for Swagger documentation.

## 🏗️ Project Structure

```
.
├── src/                    # Backend (NestJS)
│   ├── modules/
│   │   ├── user/          # User management & RBAC
│   │   ├── finance/       # Wallet, payments, transactions
│   │   ├── exam/          # Online exams & tests
│   │   ├── group/         # Groups, schedule, attendance
│   │   ├── lead/          # Lead management
│   │   └── notification/  # SMS/Telegram notifications
│   ├── entities/          # Database entities
│   ├── common/            # Guards, decorators, strategies
│   └── config/            # Configuration files
│
└── frontend/               # Frontend (React + TypeScript)
    ├── src/
    │   ├── pages/         # Page components
    │   │   ├── admin/     # Admin dashboard pages
    │   │   ├── teacher/   # Teacher dashboard pages
    │   │   ├── student/   # Student dashboard pages
    │   │   └── auth/      # Login/Register pages
    │   ├── layouts/       # Layout components
    │   ├── contexts/      # React contexts
    │   ├── stores/        # State management
    │   └── lib/           # API client
    └── public/            # Static assets
```

## 🎨 Frontend Pages

### Admin Panel
- Dashboard with statistics
- User management
- Group management
- Exam overview
- Lead management
- Finance & transactions

### Teacher Panel
- Dashboard
- My groups
- Create & manage exams
- Attendance tracking

### Student Panel
- Dashboard
- Wallet & balance
- Available exams
- Exam results
- Schedule

## 💰 Revenue Model

- **SaaS Subscription**: Educational centers pay monthly subscription
- **Commission on Exams**: Platform takes commission from each paid exam (configurable percentage)
- **Transaction Fees**: Optional fees on payment processing

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation with class-validator
- CORS enabled
- Secure API endpoints

## 🛠️ Tech Stack

### Backend
- NestJS (Node.js framework)
- TypeORM (Database ORM)
- PostgreSQL (Database)
- JWT (Authentication)
- Swagger (API Documentation)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Axios
- Lucide Icons

## 📝 License

MIT