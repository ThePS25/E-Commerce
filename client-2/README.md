# ZooPHii — Modern Frontend (client-2)

Production-quality React 19 e-commerce frontend for the ZooPHii MERN backend. Modern indigo/violet pet-commerce design with Redux Toolkit, Vite, Bootstrap 5, Ant Design, SCSS, and Framer Motion.

## Tech Stack

- **React 19** + **Vite 6**
- **Redux Toolkit** — auth, cart, wishlist, UI state
- **React Router 7** — lazy-loaded routes
- **Axios** — API client with JWT interceptors
- **Bootstrap 5** + **Ant Design** + **SCSS**
- **Framer Motion** — page transitions & card animations
- **Braintree Drop-in** — checkout payments

## Prerequisites

- Node.js 20.12+ (20.19+ recommended)
- MongoDB + backend running on port **8080**

## Quick Start

### 1. Start the backend (from project root)

```bash
# In E-Commerce/
npm run dev
# Backend: http://localhost:8080
```

### 2. Start client-2

```bash
cd client-2
npm install
npm run dev
# Frontend: http://localhost:5173
```

Vite proxies `/api` → `http://localhost:8080` in development.

### 3. Environment

Copy `.env.example` to `.env`:

```env
VITE_API_URL=/api/v1
```

For direct backend URL (no proxy):

```env
VITE_API_URL=http://localhost:8080/api/v1
```

> **Note:** The backend uses prefix `/api/v1` on port **8080**, not port 5000.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 5173) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Features

- **Shop:** Hero, categories, filters, sort, grid/list view, pagination
- **Product details:** Image zoom, wishlist, related products
- **Cart & checkout:** Multi-step checkout with Braintree
- **Auth:** Login, signup, forgot password (social placeholders)
- **User dashboard:** Profile, orders, wishlist, addresses, settings
- **Admin dashboard:** Products, categories, orders, analytics

## Default Admin Access

Use an admin account (`role: 1`) from your MongoDB users collection. Register normally, then set `role: 1` in the database for admin access.

## Project Structure

```
client-2/
├── src/
│   ├── api/           # Axios client + API modules
│   ├── components/    # Reusable UI components
│   ├── layouts/       # MainLayout, AuthLayout
│   ├── pages/         # Route pages
│   ├── routes/        # AppRoutes with lazy loading
│   ├── store/         # Redux slices
│   ├── hooks/         # Custom hooks
│   ├── styles/        # SCSS design system
│   └── utils/         # Helpers & constants
├── public/images/     # Static assets
├── .env.example
└── MIGRATION_GUIDE.md
```

## Promo Code

Use **`PET10`** at cart for 10% off (client-side demo).

## License

MIT — Portfolio / educational use.
