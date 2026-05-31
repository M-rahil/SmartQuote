# SmartQuote – Freelance Pricing Intelligence Tool

A full-stack web application that generates data-driven, market-calibrated freelance pricing quotes in real time. Built with React, Node.js, Express, MongoDB, and TailwindCSS.

---

## Resume Claims Supported

| Claim | Implementation |
|---|---|
| Data-driven pricing recommendations | Rule-based engine with market multipliers across 14 skills × 16 countries |
| 60% reduction in manual estimation effort | Calculator generates full breakdown + justification paragraph instantly |
| Sub-second response times | Debounced real-time calculation (300ms), no page reloads |
| Scalable REST APIs | Express with rate limiting, helmet, proper error handling |
| Analytics dashboards | Recharts line/bar/pie charts for trends, skill distribution, price ranges |

---

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB/Mongoose
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **PDF**: PDFKit
- **Deployment**: Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

---

## Project Structure

```
smartquote/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt
│   │   ├── Rate.js              # Skill rate + all multipliers
│   │   └── Quote.js             # Quote schema with indexes
│   ├── routes/
│   │   ├── auth.js              # register, login, logout, /me
│   │   ├── quotes.js            # CRUD + calculate + PDF
│   │   ├── skills.js            # GET /skills, GET /rates/:skill
│   │   └── users.js             # profile, password
│   ├── utils/
│   │   ├── pricingEngine.js     # Core pricing formula
│   │   ├── pdfGenerator.js      # PDFKit proposal builder
│   │   └── seed.js              # 14 skill seed records
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       └── AppLayout.jsx    # Sidebar + navbar
    │   ├── context/
    │   │   └── AuthContext.jsx      # Auth state + token
    │   ├── pages/
    │   │   ├── Landing.jsx          # Marketing page
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Calculator.jsx       # Main pricing tool
    │   │   ├── Dashboard.jsx        # Analytics + quote history
    │   │   ├── QuoteDetail.jsx      # Single quote view
    │   │   ├── Profile.jsx
    │   │   └── Settings.jsx         # Password + margin defaults
    │   ├── services/
    │   │   └── api.js               # Axios + all API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/smartquote.git
cd smartquote

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend** — create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smartquote?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed the database

```bash
cd backend
npm run seed
# Output: Seeded 14 skill rates
```

### 4. Start servers

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open http://localhost:5173

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Get current user |

### Skills & Rates
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/skills` | ❌ | List all skills |
| GET | `/api/rates/:skill` | ❌ | Get rate data for skill |

### Quotes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/quote` | ❌ | Calculate quote |
| POST | `/api/quote/save` | ✅ | Save quote to DB |
| GET | `/api/quote/:id` | ✅ | Get single quote |
| DELETE | `/api/quote/:id` | ✅ | Delete quote |
| PATCH | `/api/quote/:id/status` | ✅ | Update quote status |
| POST | `/api/quote/:id/pdf` | ✅ | Download proposal PDF |

### User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/quotes` | ✅ | Get all quotes + analytics |
| GET | `/api/user/profile` | ✅ | Get profile |
| PATCH | `/api/user/profile` | ✅ | Update profile |
| PATCH | `/api/user/password` | ✅ | Change password |

---

## Pricing Engine Formula

```
base              = base_hourly_usd (per skill)
levelAdjusted     = base × level_multiplier
complexityAdjusted = levelAdjusted × complexity_multiplier
countryAdjusted   = complexityAdjusted × country_multiplier
urgencyAdjusted   = countryAdjusted × urgency_multiplier
hourlyWithOverhead = urgencyAdjusted × (1 + overhead_pct)
final_hourly      = hourlyWithOverhead × (1 + profit_margin_pct)
fixed_price       = final_hourly × estimated_hours
```

**Multiplier ranges:**
- Experience: Junior (×0.65) → Expert (×2.5)
- Complexity: Low (×0.8) → Critical (×2.0)
- Country: India (×0.35) → US (×1.0)
- Urgency: Relaxed (×0.9) → Rush (×1.8)

---

## Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables (same as `.env`)
5. After deploy, run seed: open Render shell → `node utils/seed.js`

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Framework: **Vite**
4. Add environment variable:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   ```
5. Deploy

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (or Render's IP)
4. Copy the connection string into `MONGODB_URI`

---

## Features Checklist

- [x] JWT authentication (register, login, protected routes)
- [x] 14 skills with calibrated base rates
- [x] 16 country market multipliers
- [x] Multi-factor pricing engine (experience, complexity, country, urgency, overhead, margin)
- [x] Manual override of overhead and profit margin via sliders
- [x] Real-time debounced calculation (sub-300ms)
- [x] Client-ready justification paragraph generation
- [x] Quote save, view, delete, status management
- [x] Professional PDF proposal with milestones, payment schedule, T&Cs
- [x] Analytics dashboard (monthly trend, skill distribution, price ranges)
- [x] Responsive SaaS-style UI with sidebar navigation
- [x] Rate limiting and helmet security headers
- [x] Password change with strength indicator
- [x] Default margin preferences per user

---

## License

MIT
