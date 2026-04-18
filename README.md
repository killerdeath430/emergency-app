# 🚑 EmergencyConnect

A full-stack emergency response web application that connects users to the nearest hospital during critical situations. Users can send ambulance requests instantly, share live locations, and hospitals can accept and manage those requests efficiently.

## Tech Stack

**Backend**
- Node.js & Express.js — RESTful API
- TypeScript — type-safe codebase
- PostgreSQL (Neon) — serverless database
- Prisma ORM (v7) — database access
- JWT + bcrypt — authentication & security

**Frontend**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

## Features

- 🔐 JWT-based auth with role support (User / Hospital)
- 📍 Nearest hospital finder using Haversine formula
- 🚨 Ambulance request system with status lifecycle
- 🏥 Hospital dashboard to accept/reject requests
- 📡 Live location sharing

## Project Structure

emergency-app/
├── Backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── index.ts
│   └── prisma.config.ts
└── Frontend/
└── src/
├── pages/
├── components/
├── api/
└── context/

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register user or hospital | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/requests` | Send ambulance request | ✅ User |
| GET | `/api/requests/my` | Get my requests | ✅ User |
| GET | `/api/hospital/requests` | Get hospital requests | ✅ Hospital |
| PATCH | `/api/hospital/requests/:id` | Accept/Reject request | ✅ Hospital |
| POST | `/api/location` | Update live location | ✅ User |
| GET | `/api/location/:userId` | Get user location | ✅ Any |

## Setup

```bash
git clone https://github.com/killerdeath430/emergency-app.git

# Backend
cd emergency-app/Backend
npm install
# Add .env with DATABASE_URL and JWT_SECRET
npx prisma generate
npx prisma db push
npm run dev

# Frontend
cd ../Frontend
npm install
npm run dev
```

*Built by [Rudra Narayan Chaturvedi](https://github.com/killerdeath430)*