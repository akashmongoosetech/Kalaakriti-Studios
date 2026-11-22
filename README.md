# Kalaakriti Studios — Full-Stack Luxury Indian Photography Studio Website & Admin CRM

A complete, production-ready full-stack web application for **Kalaakriti Studios** (Indore, Bhopal, Ujjain & across Madhya Pradesh), featuring a luxury public portfolio & booking experience paired with a secure, JWT-authenticated Admin CRM Dashboard.

The repository maintains **strict physical and dependency separation** between the React + TypeScript frontend (`/frontend`) and the pure JavaScript Node.js + Express + MongoDB backend (`/backend`).

---

## 1. Project Overview

### Public Website (`/frontend`)
- **Luxury Editorial Branding**: Deep Burgundy (`#57252F`), Warm Ivory (`#F7F2E9`), Antique Gold (`#C5A46D`), and Charcoal (`#171615`) with Cormorant Garamond editorial typography and Lenis smooth scrolling.
- **Dynamic Content & Forms**:
  - Database-backed Portfolio Gallery (`/gallery`, `/gallery/:slug`, and Homepage featured showcase) with category filters, search, and full-screen Lightbox.
  - Database-backed Testimonials Carousel and Instagram Masonry Grid on the Homepage.
  - Contact Inquiry Form (`/contact`) persisting directly to MongoDB with generated inquiry reference IDs (`CNT-YYYY-XXXXXX`).
  - 5-Step Interactive Shoot Booking System (`/booking`) persisting directly to MongoDB with reference IDs (`KS-YYYY-XXXXXX`).
  - Newsletter Subscription component with graceful duplicate email handling.
  - Dynamic per-route SEO meta tags, Open Graph tags, and JSON-LD structured data via `react-helmet-async`.

### Studio Admin Panel (`/admin/*`)
- **Authentication**: Dedicated split-screen Signup (`/admin/signup`), Login (`/admin/login` supporting **username, email, or 10-digit mobile**), and Password Recovery (`/admin/forgot-password`).
- **Analytics Dashboard (`/admin/dashboard`)**: Real-time MongoDB aggregations for KPI cards, month-over-month deltas, 6-month booking & inquiry trends (Recharts), status breakdowns, top cities/categories, and recent activity logs.
- **Contact & Booking Management (`/admin/contacts`, `/admin/bookings`)**: Server-side pagination, search, status/city/category/date-range filters, inline status updates, edit modals, soft-delete Trash bin with one-click Restore and Permanent Delete, and CSV export.
- **Admin Profile (`/admin/profile`)**: Multipart profile picture upload (stored via Multer and served from `/uploads/avatars`), profile updates, and bcrypt-verified password changes.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router DOM 7, Framer Motion, GSAP, Lenis, React Hook Form, Zod, Zustand, Recharts, Lucide React, Sonner, React Helmet Async |
| **Backend** | Node.js, **JavaScript (CommonJS, no TypeScript)**, Express.js 4, MongoDB, Mongoose 8 |
| **Auth & Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, HttpOnly `SameSite=Lax` cookies, CSRF Origin validation, Helmet, CORS allowlist, `express-rate-limit`, Joi validation, NoSQL operator sanitization |
| **File Uploads** | Multer 2.x (disk storage, MIME + extension verification, 5 MB limit, path-confined cleanup) |

---

## 3. Folder Structure

```text
project-root/
├── frontend/                       # Independent React + Vite + TypeScript SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Curated studio photography assets
│   │   ├── components/
│   │   │   ├── admin/              # CRM sidebar, header, dialogs, protected route
│   │   │   ├── animations/         # GSAP, Framer Motion & Three.js visual effects
│   │   │   ├── common/             # Footer, BookingCTA, Testimonials, Instagram, Newsletter, SEO
│   │   │   ├── gallery/            # Gallery cards & full-screen Lightbox
│   │   │   └── layout/             # Public navbar & page layout
│   │   ├── context/                # Lenis smooth scroll context
│   │   ├── data/                   # Static studio copy, services, categories, cities, fallback media
│   │   ├── hooks/                  # Admin data hooks & reduced-motion hook
│   │   ├── pages/                  # Public pages + /admin/* pages
│   │   ├── schemas/                # Zod client-side form schemas
│   │   ├── services/
│   │   │   ├── api/                # Shared HTTP client (in-memory JWT + credentials) & public API
│   │   │   └── admin/              # Auth, Dashboard, Contacts, Bookings, Profile API services
│   │   ├── store/                  # Zustand admin auth store
│   │   └── types/                  # TypeScript interfaces
│   ├── .env.example
│   ├── index.html
│   ├── package.json                # Independent frontend dependencies
│   ├── tsconfig.json
│   └── vite.config.ts              # Proxies /api and /uploads to backend in dev
│
├── backend/                        # Independent Pure-JavaScript Express + MongoDB API
│   ├── src/
│   │   ├── config/                 # env.js, db.js, seedData.js, seed.js
│   │   ├── controllers/            # auth, profile, contact, booking, newsletter, gallery, testimonial, instagram, dashboard
│   │   ├── middleware/             # auth, validate (+ NoSQL sanitizer), upload (Multer v2), error, rateLimit
│   │   ├── models/                 # Admin, Contact, Booking, NewsletterSubscriber, GalleryItem, Testimonial, InstagramPost, ActivityLog
│   │   ├── routes/                 # Modular REST routers mounted under /api
│   │   ├── services/               # dashboard.service.js (aggregations), activity.service.js
│   │   ├── uploads/avatars/        # Uploaded admin profile photos
│   │   ├── utils/                  # apiResponse.js, formatters.js, runSeed.js
│   │   ├── validators/             # Joi schemas for every write endpoint
│   │   ├── app.js                  # Express app, Helmet, CORS, routes, static uploads, SPA fallback
│   │   └── server.js               # Database connection, initial seed, HTTP server & graceful shutdown
│   ├── .env.example
│   └── package.json                # Independent backend dependencies
│
├── scripts/
│   └── dev-orchestrator.cjs        # Starts backend (5000) & frontend (3000) together on `npm run dev`
├── package.json                    # Root workspace convenience scripts
└── README.md
```

---

## 4. Installation

### Install All Dependencies (Frontend & Backend)
```bash
npm run install:all
```

### Or Install Independently
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## 5. MongoDB Configuration

The backend connects via Mongoose using `MONGODB_URI` in `backend/.env`:

1. **Local MongoDB**:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/kalaakriti_studios
   ```
2. **MongoDB Atlas (Production Recommended)**:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kalaakriti_studios?retryWrites=true&w=majority
   ```
3. **Zero-Config Local Development Fallback**:
   If `MONGODB_URI` is left blank in development (`NODE_ENV=development`), `backend/src/config/db.js` automatically starts a real embedded local MongoDB server (`mongodb-memory-server`) persisted to `backend/.mongodb-data/` so all Mongoose models, indexes, and aggregations run immediately. In production (`NODE_ENV=production`), `MONGODB_URI` is strictly required.

### Initial Database Seeding
On startup (when `AUTO_SEED=true`), the backend idempotently seeds the `galleryitems`, `testimonials`, and `instagramposts` collections if empty. You can also seed manually at any time:
```bash
npm --prefix backend run seed
```

---

## 6. Environment Variables

### Backend (`backend/.env` — copy from `backend/.env.example`)
| Variable | Description | Default / Example |
|---|---|---|
| `NODE_ENV` | Runtime mode (`development` or `production`) | `development` |
| `PORT` | Express API port | `5000` |
| `MONGODB_URI` | MongoDB connection string (required in production) | `mongodb://127.0.0.1:27017/kalaakriti_studios` |
| `JWT_SECRET` | Cryptographic secret for signing JWTs (min 32 chars in production) | Ephemeral random secret in dev; **required in prod** |
| `JWT_EXPIRES_IN` | Standard session JWT lifetime | `24h` |
| `JWT_REMEMBER_EXPIRES_IN` | Extended "Remember Me" JWT lifetime | `7d` |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:3000,http://127.0.0.1:3000` |
| `MAX_UPLOAD_SIZE_MB` | Maximum avatar upload file size in MB | `5` |
| `AUTO_SEED` | Seed gallery, testimonials, and Instagram feed if empty | `true` |

### Frontend (`frontend/.env` — copy from `frontend/.env.example`)
| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (leave empty in dev to use Vite's `/api` proxy) | `` (empty) or `https://api.yourdomain.com` |
| `VITE_BACKEND_PROXY_TARGET` | Local Vite dev proxy target for `/api` and `/uploads` | `http://127.0.0.1:5000` |

---

## 7. Complete REST API Reference

All endpoints return a consistent JSON envelope:
```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": {}
}
```

### Health & Public Content
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | API & MongoDB connection health status |
| `GET` | `/api/gallery` | Public | List published gallery items (`?category`, `?categorySlug`, `?type`, `?search`, `?limit`) |
| `GET` | `/api/gallery/:slug` | Public | Retrieve single portfolio story + 4 related stories |
| `GET` | `/api/testimonials` | Public | List published couple testimonials |
| `GET` | `/api/instagram` | Public | List studio Instagram grid posts (`?limit`) |

### Public Form Submissions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contacts` | Public | Submit contact inquiry (Joi validated, generates `CNT-YYYY-XXXXXX`) |
| `POST` | `/api/bookings` | Public | Submit 5-step shoot booking (Joi validated, generates `KS-YYYY-XXXXXX`) |
| `POST` | `/api/newsletter/subscribe` | Public | Subscribe email to studio journal (handles duplicates cleanly) |

### Admin Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/auth/signup` | Public | Register admin account (`multipart/form-data` supporting optional `profilePicture` upload) |
| `POST` | `/api/admin/auth/login` | Public | Authenticate via `username`, `email`, or `mobile` + password; sets HttpOnly cookie & returns JWT |
| `GET` | `/api/admin/auth/me` | JWT / Cookie | Restore & verify current admin session |
| `POST` | `/api/admin/auth/logout` | Public | Clear session cookie |
| `POST` | `/api/admin/auth/forgot-password` | Public | Non-enumerating password recovery request |

### Admin Dashboard & Profile (Protected)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin | Live MongoDB aggregations (KPIs, MoM deltas, 6-month charts, status & city breakdowns, recent activity) |
| `GET` | `/api/admin/profile` | Admin | Fetch authenticated admin profile |
| `PUT` | `/api/admin/profile` | Admin | Update profile fields & optional `profilePicture` upload (`multipart/form-data`) |
| `PUT` | `/api/admin/profile/password` | Admin | Verify current bcrypt password and update to new hashed password |

### Admin Contacts CRUD (Protected)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/contacts` | Admin | Paginated list (`?view=active\|trash`, `?search`, `?status`, `?city`, `?eventType`, `?dateFrom`, `?dateTo`, `?sortBy`, `?sortOrder`, `?page`, `?limit`) |
| `GET` | `/api/admin/contacts/:id` | Admin | Fetch single contact inquiry |
| `PUT` | `/api/admin/contacts/:id` | Admin | Update inquiry details & status |
| `PATCH` | `/api/admin/contacts/:id/status` | Admin | Quick status update (`New`, `Contacted`, `In Progress`, `Converted`, `Closed`, `Spam`) |
| `DELETE` | `/api/admin/contacts/:id` | Admin | Soft-delete inquiry (moves to Trash) |
| `PATCH` | `/api/admin/contacts/:id/restore` | Admin | Restore inquiry from Trash |
| `DELETE` | `/api/admin/contacts/:id/permanent` | Admin | Permanently remove inquiry from MongoDB |

### Admin Bookings CRUD (Protected)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/bookings` | Admin | Paginated list (`?view=active\|trash`, `?search`, `?status`, `?category`, `?city`, `?dateFrom`, `?dateTo`, `?sortBy`, `?sortOrder`, `?page`, `?limit`) |
| `GET` | `/api/admin/bookings/:id` | Admin | Fetch single booking record |
| `PUT` | `/api/admin/bookings/:id` | Admin | Update booking details, add-ons & status |
| `PATCH` | `/api/admin/bookings/:id/status` | Admin | Quick status update (`Pending`, `Confirmed`, `Completed`, `Cancelled`) |
| `DELETE` | `/api/admin/bookings/:id` | Admin | Soft-delete booking (moves to Trash) |
| `PATCH` | `/api/admin/bookings/:id/restore` | Admin | Restore booking from Trash |
| `DELETE` | `/api/admin/bookings/:id/permanent` | Admin | Permanently remove booking from MongoDB |

### Admin Content & Newsletter Management (Protected)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/newsletter` | Admin | List newsletter subscribers |
| `POST` / `PUT` / `DELETE` | `/api/admin/gallery[/:id]` | Admin | Manage portfolio gallery stories |
| `POST` / `DELETE` | `/api/admin/testimonials[/:id]` | Admin | Manage client testimonials |

---

## 8. Authentication Guide

1. Navigate to `/admin/signup` to create your first Studio Admin account (optionally uploading a JPG, PNG, or WebP avatar up to 5 MB).
2. Sign in at `/admin/login` using your **auto-generated username**, **email address**, or **10-digit mobile number**.
3. The backend hashes passwords with `bcryptjs` (cost factor 12), issues a signed JWT, and sets an `HttpOnly` `SameSite=Lax` cookie. The frontend holds the Bearer token strictly in JavaScript memory (never in `localStorage`) and automatically restores active sessions via `GET /api/admin/auth/me`.

---

## 9. Running Frontend & Backend

### Run Both Servers Together (Recommended for Development)
```bash
npm run dev
```
- **Frontend (Vite)**: `http://localhost:3000` (proxies `/api` and `/uploads` to port `5000`)
- **Backend (Express)**: `http://localhost:5000`

### Run Independently
```bash
# Terminal 1 — Backend API (port 5000)
npm run dev:backend

# Terminal 2 — Frontend SPA (port 3000)
npm run dev:frontend
```

---

## 10. Production Build & Deployment

### Build Frontend Bundle
```bash
npm run build
```
This runs `vite build` inside `/frontend` and outputs the optimized static bundle to `frontend/dist/`.

### TypeScript Type Check
```bash
npm run lint
```

### Start Production Server
Set `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET` (at least 32 random characters), and `CORS_ORIGINS` in `backend/.env` or your host's environment settings, then run:
```bash
npm start
```
In production mode, Express serves both the `/api/*` REST API, `/uploads/*` uploaded media, and the built `frontend/dist` single-page application cleanly from one Node.js server (or deploy `/frontend/dist` to a static CDN like Vercel/Netlify with `VITE_API_BASE_URL` pointing to your Express backend on Render, Railway, or a VPS).
