# ZooPHii — MERN E-Commerce (Production)

Full-stack pet commerce platform: **Express API** + **React 19 (client-2)** + **MongoDB** + **Braintree** + **Pay on Delivery** + **Admin coupons**.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 6, Redux Toolkit, Bootstrap 5, Ant Design, SCSS |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Payments | Braintree Sandbox + Cash on Delivery |

## Prerequisites

- Node.js 18+ (20.19+ recommended for latest Vite)
- MongoDB Atlas cluster
- Braintree sandbox credentials

## Quick Start (Development)

```bash
git clone <repo-url>
cd E-Commerce

# 1. Backend env
cp .env.example .env
# Edit .env with your MongoDB, JWT, Braintree keys

# 2. Install all dependencies
npm install
cd client-2 && npm install && cd ..

# 3. Run API + frontend together
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| API | http://localhost:8080 |
| Health check | http://localhost:8080/api/v1/health |

Vite proxies `/api` → backend in dev. No separate frontend env needed locally.

## Production Build & Run

```bash
# Build client-2 into client-2/dist
npm run build

# Start server (serves API + static frontend from same port)
set NODE_ENV=production   # Windows
# export NODE_ENV=production  # macOS/Linux
npm start
```

Open **http://localhost:8080** — single origin for UI and API.

### Production checklist

- [ ] `NODE_ENV=production`
- [ ] Strong `JWT_SECRET` (32+ random characters)
- [ ] MongoDB Atlas IP whitelist / network access configured
- [ ] Braintree keys set (sandbox for testing, production for live)
- [ ] `npm run build` completed (`client-2/dist` exists)
- [ ] Admin user created (`role: 1` in MongoDB)

## Environment Variables

See [`.env.example`](.env.example). Required:

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `BRAINTREE_*` | Payment gateway credentials |
| `PORT` | Server port (default `8080`) |
| `NODE_ENV` | `production` in prod |

Optional:

| Variable | Description |
|----------|-------------|
| `CORS_ORIGIN` | Comma-separated origins if frontend hosted separately |
| `CLIENT_URL` | Public app URL for CORS |

## API Routes

| Prefix | Description |
|--------|-------------|
| `/api/v1/health` | Health check |
| `/api/v1/auth` | Auth, profile, orders |
| `/api/v1/category` | Categories |
| `/api/v1/product` | Products, search, Braintree, COD |
| `/api/v1/coupon` | Coupons (admin CRUD + validate) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API (nodemon) + client-2 (Vite) |
| `npm run build` | Build client-2 for production |
| `npm start` | Run production server |
| `npm run server` | Backend only with nodemon |
| `npm run client2:dev` | Frontend dev server only |

## Project Structure

```
E-Commerce/
├── client-2/          # Production frontend (React + Vite)
├── client/            # Legacy frontend (optional)
├── config/            # Database
├── controllers/       # Route handlers
├── models/            # Mongoose schemas
├── routes/            # Express routers
├── middlewares/       # Auth
├── server.js          # Entry point — API + static SPA
├── Procfile           # PaaS deploy (Render/Railway/Heroku)
└── DEPLOYMENT.md      # Platform-specific deploy guide
```

## Admin Setup

1. Register via `/auth/signup`
2. In MongoDB, set `role: 1` on your user document
3. Access `/admin` for products, categories, coupons, orders

## License

ISC — Pratyush
