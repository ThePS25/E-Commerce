# Migration Guide — client → client-2

This document explains the new ZooPHii frontend (`client-2/`) and how it integrates with the existing backend without modifying API contracts.

---

## Overview

| Aspect | `client/` (original) | `client-2/` (new) |
|--------|---------------------|-------------------|
| Build tool | Create React App | Vite 6 |
| React | 18 | 19 |
| State | Context API | Redux Toolkit |
| Styling | Bootstrap CDN + CSS | Bootstrap + SCSS design tokens |
| Theme | Brown earth tones | Indigo/violet modern |
| Routing | Direct imports | Lazy-loaded code splitting |
| Auth storage | `localStorage` key `auth` | `localStorage` key `zoophii_auth` |

Both frontends can run independently against the same backend.

---

## Folder Structure

```
client-2/src/
├── api/
│   ├── axiosClient.js    # Base axios instance + interceptors
│   ├── authApi.js        # /api/v1/auth/*
│   ├── productApi.js     # /api/v1/product/*
│   ├── categoryApi.js    # /api/v1/category/*
│   ├── orderApi.js       # Orders + Braintree payment
│   └── userApi.js        # Profile + session verify
├── components/
│   ├── Navbar.jsx        # Sticky header, search, cart badge
│   ├── Footer.jsx
│   ├── ProductCard.jsx   # Memoized card with wishlist
│   ├── ProductGrid.jsx   # Grid/list layout
│   ├── CategoryCard.jsx
│   ├── SearchBar.jsx
│   ├── FilterPanel.jsx   # Ant Design checkbox/radio filters
│   ├── EmptyState.jsx
│   ├── LoadingSkeleton.jsx
│   ├── HeroBanner.jsx
│   ├── SectionHeader.jsx
│   ├── StatCard.jsx
│   ├── DashboardLayout.jsx  # Sidebar for user/admin
│   ├── ModalWrapper.jsx
│   ├── ToastProvider.jsx
│   ├── PageTransition.jsx   # Framer Motion wrapper
│   └── ProtectedRoute.jsx
├── layouts/
│   ├── MainLayout.jsx    # Navbar + Outlet + Footer
│   └── AuthLayout.jsx    # Split-screen auth pages
├── pages/
│   ├── Home.jsx
│   ├── ProductListing.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx      # Multi-step + Braintree
│   ├── SearchResults.jsx
│   ├── auth/             # Login, Signup, ForgotPassword
│   ├── user/             # Dashboard, Orders, Wishlist, etc.
│   └── admin/            # Admin CRUD + analytics
├── routes/
│   └── AppRoutes.jsx     # All routes with lazy()
├── store/
│   ├── index.js
│   ├── authSlice.js
│   ├── cartSlice.js
│   ├── wishlistSlice.js  # New — localStorage only
│   └── uiSlice.js
├── hooks/
│   ├── useAppDispatch.js
│   └── useAuth.js
├── styles/
│   ├── variables.scss    # Design tokens (no hardcoded colors in components)
│   ├── theme.scss        # Bootstrap + CSS custom properties
│   ├── mixins.scss
│   └── globals.scss
└── utils/
    ├── constants.js      # Price ranges, sort options, testimonials
    ├── formatters.js
    ├── storage.js
    └── menuItems.js
```

---

## Design System

All colors live in `src/styles/variables.scss`:

| Token | Value | Usage |
|-------|-------|-------|
| `$color-primary` | `#4F46E5` | Buttons, links, accents |
| `$color-secondary` | `#8B5CF6` | Gradients, highlights |
| `$color-accent` | `#06B6D4` | Badges, info |
| `$color-bg` | `#F8FAFC` | Page background |
| `$color-surface` | `#FFFFFF` | Cards, panels |
| `$color-text` | `#0F172A` | Body text |
| `$color-success` | `#10B981` | Success states |
| `$color-error` | `#EF4444` | Errors |

Components import SCSS partials — never hardcode hex values in JSX.

---

## API Integrations

### Authentication

```javascript
// Header format (matches existing backend)
Authorization: <raw-jwt-token>   // NO "Bearer" prefix
```

| Endpoint | Used in |
|----------|---------|
| `POST /auth/login` | Login page |
| `POST /auth/signup` | Signup page |
| `POST /auth/forgot-password` | Forgot password |
| `GET /auth/user-auth` | Session verify on app load |
| `PUT /auth/profile` | Profile page |
| `GET /auth/orders` | User orders |
| `GET /auth/all-orders` | Admin orders |
| `PUT /auth/order-status/:id` | Admin order status |

### Products

| Endpoint | Used in |
|----------|---------|
| `GET /product/get-product` | Home, admin products |
| `GET /product/get-product/:slug` | Product details |
| `GET /product/product-list/:page` | Shop pagination (6/page) |
| `GET /product/product-count` | Pagination total |
| `POST /product/product-filters` | Filter panel |
| `GET /product/search/:keyword` | Search results |
| `GET /product/related-product/:pid/:cid` | Related products |
| `GET /product/product-category/:slug` | Category filter |
| `GET /product/product-photo/:pid` | All product images |
| `POST /product/create-product` | Admin create (multipart) |
| `PUT /product/update-product/:pid` | Admin update (multipart) |
| `DELETE /product/delete-product/:pid` | Admin delete |

### Categories

| Endpoint | Used in |
|----------|---------|
| `GET /category/get-category` | Navbar, filters, home |
| `POST /category/create-category` | Admin |
| `PUT /category/update-category/:id` | Admin |
| `DELETE /category/delete-category/:id` | Admin |

### Payments (Braintree)

1. `GET /product/braintree/token` → `clientToken`
2. Braintree Drop-in UI collects payment method
3. `POST /product/braintree/payment` with `{ nonce, cart }` (auth required)

---

## Setup Instructions

### Development

```bash
# Terminal 1 — Backend
cd E-Commerce
npm run dev

# Terminal 2 — New frontend
cd client-2
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

### Production Build

```bash
cd client-2
npm run build
# Output: client-2/dist/
```

Serve `dist/` with any static host. Set:

```env
VITE_API_URL=https://your-api.com/api/v1
```

### Switching from old client

The backend serves `client/build` as SPA fallback. To use client-2 in production:

1. Build client-2: `npm run build`
2. Point server static files to `client-2/dist` OR deploy separately (recommended)

No backend code changes required.

---

## Route Map

| Path | Page | Auth |
|------|------|------|
| `/` | Home | Public |
| `/products` | Product listing | Public |
| `/products/:slug` | Product details | Public |
| `/cart` | Cart | Public |
| `/checkout` | Multi-step checkout | User |
| `/search?q=` | Search results | Public |
| `/auth/login` | Login | Public |
| `/auth/signup` | Signup | Public |
| `/dashboard/*` | User dashboard | User |
| `/admin/*` | Admin panel | Admin (role=1) |

---

## New Features (not in old client)

- **Wishlist** — Redux + localStorage (no backend API)
- **Grid/List view toggle** on product listing
- **Promo codes** — client-side demo (`PET10`)
- **Multi-step checkout** with address + review steps
- **Skeleton loading** on all data pages
- **Empty states** with CTAs
- **Social login placeholders** (disabled, UI ready)
- **Revenue analytics chart** on admin dashboard (illustrative)

---

## Future Improvements

1. **Reviews API** — Backend endpoint for product reviews/ratings
2. **User management API** — Admin user listing (placeholder exists)
3. **Real promo codes** — Server-side validation
4. **OAuth** — Google/Facebook social login
5. **Image optimization** — WebP conversion, blur placeholders
6. **SSR/SSG** — Next.js migration for SEO
7. **E2E tests** — Playwright/Cypress for checkout flow
8. **PWA** — Service worker for offline cart
9. **Unified cart** — Backend cart sync instead of localStorage-only
10. **Chart library** — Recharts for real admin analytics

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 401 on all requests | Check JWT in localStorage; re-login |
| Images not loading | Ensure backend is running; check `VITE_API_URL` |
| CORS errors | Use Vite proxy in dev (`/api/v1`) |
| Braintree fails | Set `BRAINTREE_*` env vars on backend |
| Admin pages 403 | Set user `role: 1` in MongoDB |
| Build fails on Node 20.12 | Use Vite 6 (already configured) |

---

## Contact

Built as a portfolio-grade frontend for the ZooPHii MERN e-commerce backend. See `README.md` for quick start.
