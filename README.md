# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. Manage your sales leads efficiently with role-based access, advanced filtering, CSV export, and a clean responsive UI.

---

## ✨ Features

- 🔐 JWT-based Authentication (Register / Login)
- 👥 Role-Based Access Control (Admin & Sales)
- 📋 Full Lead CRUD (Create, Read, Update, Delete)
- 🔍 Advanced Filtering — by Status, Source, Search (debounced)
- 📄 Backend Pagination (10 per page)
- 📊 Dashboard with lead stats & visual breakdowns
- 📥 CSV Export with active filters applied
- 🌙 Dark Mode support
- 🐳 Docker support for one-command setup

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI library |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| React Router v6 | Client-side routing |
| TanStack Query | Server state & caching |
| Zustand | Global state (auth, theme) |
| React Hook Form | Form handling & validation |
| Axios | HTTP client |
| React Hot Toast | Notifications |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| json2csv | CSV export |
| Helmet + CORS | Security |
| express-rate-limit | Rate limiting |

---

## 📁 Project Structure

```
smart-leads/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts        # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts  # Register, Login, GetMe
│   │   │   └── leadController.ts  # CRUD, Export, Stats
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT verify + role guard
│   │   │   ├── errorHandler.ts    # Centralized error handling
│   │   │   └── validation.ts      # Request validation rules
│   │   ├── models/
│   │   │   ├── User.ts            # User schema
│   │   │   └── Lead.ts            # Lead schema
│   │   ├── routes/
│   │   │   ├── auth.ts            # /api/auth routes
│   │   │   └── leads.ts           # /api/leads routes
│   │   ├── types/
│   │   │   └── index.ts           # Shared TS interfaces
│   │   └── index.ts               # Express app entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Layout.tsx     # Sidebar + topbar shell
│   │   │   ├── leads/
│   │   │   │   ├── LeadForm.tsx   # Create/Edit form
│   │   │   │   ├── LeadFilters.tsx# Filter bar
│   │   │   │   └── LeadTable.tsx  # Table + pagination
│   │   │   └── ui/
│   │   │       └── index.tsx      # Badge, Modal, Spinner etc.
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts     # 400ms debounce
│   │   │   └── useLeads.ts        # React Query hooks
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LeadsPage.tsx
│   │   │   └── LeadDetailPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts             # Axios instance + interceptors
│   │   │   ├── authService.ts     # Auth API calls
│   │   │   └── leadService.ts     # Lead API calls
│   │   ├── store/
│   │   │   ├── authStore.ts       # Zustand auth state
│   │   │   └── themeStore.ts      # Zustand theme state
│   │   ├── types/
│   │   │   └── index.ts           # Shared TS interfaces
│   │   ├── App.tsx                # Routes
│   │   └── main.tsx               # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn
- Docker + Docker Compose (optional)

---

### Option A — Run Locally

#### 1. Clone the repo
```bash
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard
```

#### 2. Setup Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

```bash
npm install
npm run dev
```
Backend runs on → http://localhost:5000

#### 3. Setup Frontend
```bash
cd ../frontend
cp .env.example .env
```

`.env` content:
```env
VITE_API_URL=/api
```

```bash
npm install
npm run dev
```
Frontend runs on → http://localhost:5173

---

### Option B — Run with Docker

```bash
# From the root of the project
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

To stop:
```bash
docker-compose down
```

To stop and remove volumes (clears DB):
```bash
docker-compose down -v
```

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | Secret key for JWT signing | `change_this_in_production` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

### Frontend `.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL for API calls | `/api` |

---

## 👤 Default Roles

| Role | Permissions |
|---|---|
| **Admin** | View/Edit/Delete all leads, View all users |
| **Sales** | View/Edit/Delete own leads only |

When registering, you can select your role. In production, role assignment should be admin-only.

---

## 📜 Scripts

### Backend
```bash
npm run dev      # Development with hot reload (ts-node-dev)
npm run build    # Compile TypeScript to dist/
npm run start    # Run compiled production build
npm run lint     # Run ESLint
```

### Frontend
```bash
npm run dev      # Development server (Vite)
npm run build    # Production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## 🙋 Author

**Your Name**
- GitHub: [@chetanmalviya18](https://github.com/chetanmalviya18)
- Email: chetanmalviya.182@gmail.com

---


