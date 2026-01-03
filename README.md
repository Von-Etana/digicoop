# DigiCoop Platform

A full-stack digital cooperative platform built with React Native Expo (mobile) and Node.js/Express (backend).

## 📁 Project Structure

```
digicoop/
├── apps/
│   ├── mobile/          # React Native Expo app (iOS, Android, Web)
│   ├── admin/           # Web Admin Dashboard (React + Vite)
│   └── web-prototype/   # Original web prototype
│
├── packages/
│   ├── api/             # Node.js/Express Backend API
│   ├── database/        # Prisma ORM & Database Schema
│   └── shared/          # Shared TypeScript types
│
└── package.json         # Root workspace config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Expo Go app (for mobile testing)

### Installation

```bash
# Install all dependencies
npm install

# Generate Prisma client
cd packages/database
npx prisma generate
```

### Environment Setup

Create a `.env` file in `packages/api/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/digicoop"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=3001

# Flutterwave
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-..."
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-..."

# Smile Identity (KYC)
SMILE_PARTNER_ID="your-partner-id"
SMILE_API_KEY="your-api-key"

# Termii (SMS/OTP)
TERMII_API_KEY="your-termii-api-key"
TERMII_SENDER_ID="DigiCoop"
```

### Running the Apps

**Option 1: Docker (Easiest - Recommended)**

```bash
# Quick start with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

Access: http://localhost (Admin) and http://localhost:3001 (API)

👉 **See [DOCKER_README.md](DOCKER_README.md) for complete Docker setup**

**Option 2: Local Development**

```bash
# Start Backend API
npm run api

# Start Mobile App
npm run mobile

# Start Admin Dashboard
npm run admin
```

## 📱 Mobile App Features

### Main Screens (Tab Navigation)

| Screen | Features |
|--------|----------|
| **Dashboard** | Wallet balance, deposit/withdraw, quick actions, recent transactions |
| **Savings** | Create goals, progress tracking, top-up/withdraw for unlocked savings |
| **Group Buy** | Browse bulk items, progress bars, join purchases, order tracking |
| **Invest** | Investment projects, ROI badges, investor count, portfolio view |
| **Menu** | Navigation hub to all features |

### Additional Screens

| Screen | Features |
|--------|----------|
| **Wallet** | Full transaction history, filters, deposit/withdraw actions |
| **Loans** | Eligibility calculator, loan application, duration selector |
| **Governance** | Active polls with voting, events with RSVP, notices, financial reports |
| **Profile** | User info, membership ID, savings stats, KYC status |
| **Notifications** | Read/unread states, mark as read, delete, type-based icons |
| **Settings** | Push/email/SMS notifications, biometrics, dark mode, privacy |
| **Help & Support** | FAQs, live chat, phone, email, feedback form |
| **KYC Verification** | BVN entry, name verification |
| **Login** | Email/password authentication |

## 🖥️ Admin Dashboard

Built with React + Vite + TypeScript:

| Page | Features |
|------|----------|
| **Dashboard** | Stats overview (members, savings, loans, approvals), quick actions |
| **Members** | Member list with KYC status, wallet balances |
| **Loans** | Pending applications, approve/reject workflow |
| **Group Buy** | Create/manage bulk purchase items |
| **Investments** | Create/manage investment projects |
| **Governance** | Create polls, events, publish notices |
| **Settings** | Admin configuration |

## 🔧 Backend API

### Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | POST /auth/register, POST /auth/login |
| **KYC** | POST /kyc/verify-bvn |
| **Wallet** | GET /wallet/balance, GET /wallet/transactions |
| **Payments** | POST /payments/initiate-deposit, POST /payments/webhook |
| **Savings** | GET, POST /, POST /:id/topup, POST /:id/withdraw |
| **Loans** | GET, GET /eligibility, POST /apply, POST /:id/approve, POST /:id/repay |
| **Group Buy** | GET, GET /:id, POST /:id/order, POST / (admin) |
| **Investments** | GET, GET /:id, POST /:id/invest, GET /my/portfolio |
| **Governance** | GET /polls, POST /polls/:id/vote, GET /polls/:id/results, GET /events, POST /events/:id/rsvp |
| **Notifications** | POST /send-otp, POST /verify-otp |

## 🔐 Integrations

- **Flutterwave**: Payment processing (deposits, withdrawals)
- **Smile Identity**: BVN/NIN verification (KYC)
- **Termii**: SMS notifications and OTP

## 🛡️ Security Features

- JWT-based authentication with middleware
- Role-based access control (Member, Admin, Vendor)
- Password hashing with bcrypt
- Input validation with Zod
- Protected routes

## 📊 Database Schema

### Models

| Category | Models |
|----------|--------|
| **Users** | User, Wallet, Transaction |
| **Savings** | SavingsGoal |
| **Loans** | Loan |
| **Commerce** | GroupBuyItem, GroupBuyOrder |
| **Investments** | InvestmentProject, Investment |
| **Governance** | Poll, PollOption, Vote, Event, EventRsvp |
| **Notifications** | Notification |

### Key Enums

- **Role**: MEMBER, ADMIN, VENDOR
- **KycStatus**: PENDING, VERIFIED, FAILED
- **TransactionType**: DEPOSIT, WITHDRAWAL, SAVINGS_CONTRIBUTION, etc.
- **LoanStatus**: PENDING, APPROVED, REJECTED, ACTIVE, PAID, DEFAULTED
- **SavingsType**: COMPULSORY, VOLUNTARY, GOAL

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native Expo, Expo Router |
| Admin | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt |
| State | Zustand |
| API Client | Axios |
| Icons | lucide-react-native, lucide-react |

## 📝 License

Private - All rights reserved

---

Built with ❤️ for Nigerian cooperatives
