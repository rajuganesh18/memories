# E-Commerce Album Platform - Implementation Plan

## Context

Build a full-stack e-commerce website where users can browse predefined photo album templates, select a template and size, upload photos, and order custom albums. The platform includes user authentication, order tracking, and an admin panel for managing templates, orders, and pricing.

**Tech Stack**: React (Vite) + Tailwind CSS frontend | Python FastAPI + SQLAlchemy backend | PostgreSQL | Razorpay payments

---

## Project Structure

```
memories/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── database.py              # SQLAlchemy engine, session
│   │   ├── dependencies.py          # Shared dependencies (get_db, get_current_user)
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic Settings (env vars)
│   │   │   ├── security.py          # JWT token creation/verification, password hashing
│   │   │   └── razorpay.py          # Razorpay client initialization
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # User model
│   │   │   ├── template.py          # AlbumTemplate, AlbumSize, TemplateSize
│   │   │   ├── album.py             # Album, AlbumPhoto
│   │   │   ├── cart.py              # Cart, CartItem
│   │   │   ├── order.py             # Order, OrderItem
│   │   │   └── address.py           # Address
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── template.py
│   │   │   ├── album.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   ├── address.py
│   │   │   └── payment.py
│   │   ├── routers/
│   │   │   ├── auth.py              # POST /register, /login, /refresh
│   │   │   ├── templates.py         # GET /templates, /templates/{id}
│   │   │   ├── albums.py            # POST /albums, upload photos, GET preview
│   │   │   ├── cart.py              # GET/POST/DELETE /cart
│   │   │   ├── orders.py            # POST /orders, GET /orders, GET /orders/{id}
│   │   │   ├── payments.py          # POST /payments/create, /payments/verify, webhook
│   │   │   ├── addresses.py         # CRUD /addresses
│   │   │   └── admin.py             # Admin CRUD for templates, sizes, orders
│   │   └── services/
│   │       ├── auth_service.py
│   │       ├── template_service.py
│   │       ├── album_service.py
│   │       ├── cart_service.py
│   │       ├── order_service.py
│   │       └── payment_service.py
│   ├── alembic/                     # Database migrations
│   │   ├── alembic.ini
│   │   └── versions/
│   ├── uploads/                     # Local photo storage
│   ├── requirements.txt
│   ├── .env.example
│   └── tests/
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_templates.py
│       ├── test_albums.py
│       ├── test_orders.py
│       └── test_payments.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   ├── client.js            # Axios instance with interceptors
│   │   │   ├── auth.js
│   │   │   ├── templates.js
│   │   │   ├── albums.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   └── payments.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── templates/
│   │   │   │   ├── TemplateCard.jsx
│   │   │   │   └── SizeSelector.jsx
│   │   │   ├── albums/
│   │   │   │   ├── PhotoUploader.jsx
│   │   │   │   └── AlbumPreview.jsx
│   │   │   ├── cart/
│   │   │   │   └── CartItem.jsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   └── OrderStatusBadge.jsx
│   │   │   └── common/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── TemplateGallery.jsx
│   │   │   ├── TemplateDetail.jsx
│   │   │   ├── AlbumBuilder.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Addresses.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageTemplates.jsx
│   │   │       ├── ManageOrders.jsx
│   │   │       └── ManageSizes.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   └── styles/
│   │       └── index.css             # Tailwind imports
│   └── public/
└── README.md
```

---

## Database Schema

### Users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| email | VARCHAR(255) | unique, indexed |
| password_hash | VARCHAR(255) | bcrypt |
| full_name | VARCHAR(100) | |
| phone | VARCHAR(20) | |
| is_admin | BOOLEAN | default false |
| is_active | BOOLEAN | default true |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### AlbumTemplates
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| name | VARCHAR(100) | e.g., "Classic Wedding" |
| description | TEXT | |
| theme | VARCHAR(50) | e.g., "wedding", "travel", "baby" |
| cover_image_url | VARCHAR(500) | template preview image |
| pages_count | INTEGER | number of pages in this template |
| photos_per_page | INTEGER | default photos per page |
| is_active | BOOLEAN | default true |
| created_at | TIMESTAMP | |

### AlbumSizes
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| label | VARCHAR(50) | e.g., "8×8 inches" |
| width_inches | DECIMAL | 8.0 |
| height_inches | DECIMAL | 8.0 |
| is_active | BOOLEAN | default true |

### TemplateSizes (pricing join table)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| template_id | UUID (FK) | → AlbumTemplates |
| size_id | UUID (FK) | → AlbumSizes |
| price | DECIMAL(10,2) | price in INR |
| is_available | BOOLEAN | default true |
| **unique** | | (template_id, size_id) |

### Albums (user-created album)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK) | → Users |
| template_size_id | UUID (FK) | → TemplateSizes |
| title | VARCHAR(200) | user-given name |
| status | ENUM | draft / completed |
| created_at | TIMESTAMP | |

### AlbumPhotos
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| album_id | UUID (FK) | → Albums |
| photo_url | VARCHAR(500) | file path / URL |
| page_number | INTEGER | which page this photo is on |
| position | INTEGER | position on the page |
| uploaded_at | TIMESTAMP | |

### Addresses
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK) | → Users |
| full_name | VARCHAR(100) | |
| phone | VARCHAR(20) | |
| address_line1 | VARCHAR(255) | |
| address_line2 | VARCHAR(255) | nullable |
| city | VARCHAR(100) | |
| state | VARCHAR(100) | |
| pincode | VARCHAR(10) | |
| is_default | BOOLEAN | default false |

### Cart
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK) | → Users, unique |
| created_at | TIMESTAMP | |

### CartItems
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| cart_id | UUID (FK) | → Cart |
| album_id | UUID (FK) | → Albums |
| quantity | INTEGER | default 1 |

### Orders
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK) | → Users |
| address_id | UUID (FK) | → Addresses |
| total_amount | DECIMAL(10,2) | |
| status | ENUM | pending / paid / processing / shipped / delivered / cancelled |
| razorpay_order_id | VARCHAR(100) | |
| razorpay_payment_id | VARCHAR(100) | nullable |
| razorpay_signature | VARCHAR(255) | nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### OrderItems
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| order_id | UUID (FK) | → Orders |
| album_id | UUID (FK) | → Albums |
| quantity | INTEGER | |
| unit_price | DECIMAL(10,2) | price snapshot at order time |

---

## API Endpoints

### Auth (`/api/v1/auth`)
- `POST /register` — Create account (email, password, name, phone)
- `POST /login` — Returns access_token + refresh_token
- `POST /refresh` — Refresh access token
- `GET /me` — Get current user profile
- `PUT /me` — Update profile

### Templates (`/api/v1/templates`)
- `GET /` — List all active templates (filterable by theme)
- `GET /{id}` — Template detail with available sizes and pricing

### Albums (`/api/v1/albums`)
- `POST /` — Create album (select template_size_id, title)
- `GET /` — List user's albums
- `GET /{id}` — Album detail with photos
- `POST /{id}/photos` — Upload photos (multipart/form-data)
- `DELETE /{id}/photos/{photo_id}` — Remove a photo
- `PUT /{id}/complete` — Mark album as completed

### Cart (`/api/v1/cart`)
- `GET /` — Get cart with items
- `POST /items` — Add album to cart
- `PUT /items/{id}` — Update quantity
- `DELETE /items/{id}` — Remove item
- `DELETE /` — Clear cart

### Addresses (`/api/v1/addresses`)
- `GET /` — List user's addresses
- `POST /` — Add address
- `PUT /{id}` — Update address
- `DELETE /{id}` — Delete address

### Orders (`/api/v1/orders`)
- `POST /` — Create order from cart (address_id required)
- `GET /` — List user's orders
- `GET /{id}` — Order detail with items

### Payments (`/api/v1/payments`)
- `POST /create` — Create Razorpay order (returns razorpay_order_id + key)
- `POST /verify` — Verify payment signature after Razorpay checkout
- `POST /webhook` — Razorpay webhook handler (payment.captured, etc.)

### Admin (`/api/v1/admin`) — requires is_admin=true
- `GET/POST /templates` — List/Create templates
- `PUT/DELETE /templates/{id}` — Update/Delete template
- `GET/POST /sizes` — List/Create sizes
- `POST /template-sizes` — Set price for template+size combo
- `GET /orders` — List all orders (filterable by status)
- `PUT /orders/{id}/status` — Update order status

---

## Key Technical Decisions

### Authentication
- JWT access tokens (30min expiry) + refresh tokens (7-day expiry)
- Passwords hashed with bcrypt via `passlib`
- Refresh tokens stored in DB for revocation support
- Admin routes protected by `is_admin` check dependency

### Image Storage
- **Phase 1**: Local file storage in `backend/uploads/` directory, served via FastAPI static files
- **Future**: Migrate to cloud storage (AWS S3 / Cloudinary) by swapping the upload service
- Photos resized/compressed on upload using `Pillow` (max 2048px, JPEG quality 85)

### Razorpay Payment Flow
1. User clicks "Pay" → Frontend calls `POST /payments/create` with order_id
2. Backend creates Razorpay order via `razorpay.order.create()`, saves razorpay_order_id to Order
3. Frontend opens Razorpay checkout modal with the order_id and key
4. On success, Razorpay returns payment_id + signature to frontend
5. Frontend calls `POST /payments/verify` with payment_id, order_id, signature
6. Backend verifies signature using `razorpay.utility.verify_payment_signature()`
7. On verification success → order status set to "paid"
8. Razorpay webhook (`POST /payments/webhook`) as backup confirmation

### Order Status Workflow
```
pending → paid → processing → shipped → delivered
                                      ↘ cancelled (from pending/paid/processing)
```

### State Management (Frontend)
- **AuthContext** — user session, login/logout, token refresh
- **CartContext** — cart items, add/remove/update
- **React Router v6** — routing with protected routes
- **No Redux needed** — Context + local state is sufficient for this scope

---

## Implementation Phases

### Phase 1: Project Setup + Auth
**Files to create:**
- `backend/`: main.py, database.py, config, security, User model, auth router
- `frontend/`: Vite + Tailwind setup, Layout, Login/Register pages, AuthContext
- Alembic setup + initial migration
- Docker Compose for PostgreSQL (dev)

**Key deliverables:**
- User registration and login working end-to-end
- JWT auth with protected routes
- Basic app shell with Navbar, Footer, routing

### Phase 2: Template Management
**Files to create:**
- AlbumTemplate, AlbumSize, TemplateSize models + migration
- templates router + service
- admin router (template CRUD)
- TemplateGallery, TemplateDetail pages, TemplateCard component

**Key deliverables:**
- Admin can create/edit templates with sizes and pricing
- Users can browse templates, filter by theme, view details with sizes/prices

### Phase 3: Album Creation + Photo Upload
**Files to create:**
- Album, AlbumPhoto models + migration
- albums router + service
- AlbumBuilder page, PhotoUploader, AlbumPreview components

**Key deliverables:**
- User selects template+size, creates album, uploads photos
- Photos mapped to template pages with preview
- Photo compression via Pillow

### Phase 4: Cart + Checkout + Razorpay
**Files to create:**
- Cart, CartItem models + migration
- cart router + service
- payments router + service + razorpay.py config
- Cart, Checkout pages, CartContext

**Key deliverables:**
- Add albums to cart, manage quantities
- Razorpay checkout integration working in test mode
- Payment verification and webhook handling

### Phase 5: Orders + User Dashboard
**Files to create:**
- Order, OrderItem models + migration
- orders router + service, addresses router
- Dashboard pages (Orders, Addresses, Profile)

**Key deliverables:**
- Order creation from cart, order history
- Address management (CRUD, default address)
- Order status tracking

### Phase 6: Admin Dashboard + Polish
**Files to create:**
- Admin Dashboard, ManageTemplates, ManageOrders, ManageSizes pages

**Key deliverables:**
- Admin can manage all templates, sizes, pricing
- Admin can view/update order statuses
- Responsive design polish, error handling, loading states
- Input validation, edge cases

---

## Verification Plan

1. **Backend tests**: Run `pytest` in `backend/tests/` — test auth flow, template CRUD, album creation, payment verification
2. **Manual E2E flow**:
   - Register → Login → Browse templates → Select template+size → Create album → Upload photos → Add to cart → Checkout → Pay with Razorpay test card → View order in dashboard
3. **Admin flow**: Login as admin → Create template → Set sizes+pricing → View orders → Update order status
4. **Run backend**: `cd backend && uvicorn app.main:app --reload`
5. **Run frontend**: `cd frontend && npm run dev`
6. **Database**: `docker compose up -d` for PostgreSQL, then `alembic upgrade head`

---

## Dependencies

### Backend (`requirements.txt`)
- fastapi, uvicorn[standard]
- sqlalchemy>=2.0, alembic, asyncpg (or psycopg2-binary for sync)
- pydantic>=2.0, pydantic-settings
- python-jose[cryptography] (JWT)
- passlib[bcrypt] (password hashing)
- python-multipart (file uploads)
- razorpay (Razorpay Python SDK)
- pillow (image processing)
- pytest, httpx (testing)

### Frontend (`package.json`)
- react, react-dom, react-router-dom
- axios
- tailwindcss, @tailwindcss/vite
- react-icons
- react-hot-toast (notifications)

---

## Deployment Plan

### Platform Recommendation: AWS (Best Overall for Indian E-Commerce)

After evaluating AWS, Azure, and GCP based on pricing, ecosystem, and Razorpay compatibility:

| Criteria | AWS | GCP | Azure |
|----------|-----|-----|-------|
| **Cheapest on-demand VMs** | $0.083/hr (t3.small) | $0.062/hr (e2-small) — 25% cheaper | $0.067/hr |
| **Managed PostgreSQL** | RDS Free Tier (12 months) | No always-free DB; $300 trial credit | No always-free DB |
| **Object Storage** | S3: $0.023/GB/mo | GCS: $0.020/GB/mo | Blob: $0.018/GB/mo |
| **Data Egress** | $0.09/GB | $0.12/GB (33% more expensive) | $0.087/GB |
| **India Region (Mumbai)** | ap-south-1 (mature) | asia-south1 (good) | Central India (good) |
| **Free Tier** | 12 months generous | $300 credit, 90-day trial | 12 months limited |
| **Ecosystem Maturity** | Best (S3, CloudFront, SES) | Good | Good |

**Recommendation: AWS** — Best choice for an Indian e-commerce app because:
1. **Mumbai region (ap-south-1)** is mature with lowest latency for Indian users
2. **12-month free tier** includes EC2 (t2.micro), RDS PostgreSQL (db.t2.micro), 5GB S3 — enough to launch MVP at near-zero cost
3. **S3 + CloudFront** is the gold standard for serving album images fast across India
4. **SES** (Simple Email Service) for order confirmation emails at $0.10/1000 emails
5. **Razorpay** works seamlessly with any backend — no platform lock-in

### Budget Alternative: Hybrid Approach (Cheapest Possible)

For absolute minimum cost, use specialized services:

| Component | Provider | Cost |
|-----------|----------|------|
| FastAPI Backend | **Render** (free tier or $7/mo) | $0–7/mo |
| React Frontend | **Vercel** or **Cloudflare Pages** | Free |
| PostgreSQL | **Neon** (serverless, free tier: 3GB) | Free |
| Photo Storage | **Cloudflare R2** (zero egress fees) | Free (first 10GB) then $0.015/GB |
| **Total (MVP)** | | **$0–7/mo** |

### Production AWS Architecture

```
                    ┌─────────────────┐
                    │   CloudFront    │ ← CDN for static assets + images
                    │   (CDN)         │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──────┐  ┌───▼────┐  ┌──────▼──────┐
     │ S3 Bucket     │  │  ALB   │  │ S3 Bucket   │
     │ (React SPA)   │  │        │  │ (Photos)    │
     └───────────────┘  └───┬────┘  └─────────────┘
                            │
                   ┌────────▼────────┐
                   │   ECS Fargate   │ ← FastAPI containers (auto-scaling)
                   │   or EC2        │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   RDS Postgres  │ ← Managed PostgreSQL (Multi-AZ for prod)
                   └─────────────────┘
```

### AWS Deployment — Service Breakdown

| Service | Purpose | Dev/MVP Cost | Production Cost |
|---------|---------|-------------|-----------------|
| **EC2** (t3.small) or **ECS Fargate** | FastAPI backend | Free tier (t2.micro) | ~$15–30/mo |
| **RDS PostgreSQL** (db.t3.micro) | Database | Free tier (12 months) | ~$15–25/mo |
| **S3** | Photo storage + React build | Free (5GB) | ~$5–10/mo (for ~50GB photos) |
| **CloudFront** | CDN for frontend + images | Free (1TB/mo) | ~$5–10/mo |
| **SES** | Order confirmation emails | Free (62K emails/mo from EC2) | ~$1/mo |
| **Route 53** | DNS + domain | $0.50/mo per zone | $0.50/mo |
| **ACM** | SSL certificates | Free | Free |
| **Total** | | **$0–1/mo (free tier)** | **~$40–75/mo** |

### Deployment Strategy by Phase

#### Phase 1: Development (Local)
- Docker Compose: PostgreSQL + FastAPI + React dev servers
- All local, no cloud costs

#### Phase 2: MVP Launch (Free Tier / Minimal Cost)
**Option A — AWS Free Tier:**
- EC2 t2.micro (free 12 months) — run FastAPI via Gunicorn + Uvicorn
- RDS db.t2.micro (free 12 months) — PostgreSQL
- S3 (5GB free) — photo storage
- Deploy React build to S3 + CloudFront

**Option B — Hybrid (cheapest):**
- Backend on Render free tier
- Frontend on Vercel
- DB on Neon free tier
- Photos on Cloudflare R2

#### Phase 3: Production Scale
- Migrate to ECS Fargate for container auto-scaling
- RDS Multi-AZ for database high availability
- CloudFront for global CDN
- S3 lifecycle policies (move old photos to S3 Infrequent Access after 90 days)
- GitHub Actions CI/CD pipeline

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
# Triggers on push to main branch
# Steps:
#   1. Run backend tests (pytest)
#   2. Run frontend build (npm run build)
#   3. Build Docker image for FastAPI
#   4. Push to ECR (AWS container registry)
#   5. Deploy to ECS Fargate / EC2
#   6. Sync React build to S3
#   7. Invalidate CloudFront cache
```

### Environment Configuration

```
# Production .env (stored in AWS Secrets Manager)
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/memories
SECRET_KEY=<generated-secret>
RAZORPAY_KEY_ID=<live-key>
RAZORPAY_KEY_SECRET=<live-secret>
AWS_S3_BUCKET=memories-photos
AWS_REGION=ap-south-1
CORS_ORIGINS=https://yourdomain.com
```

### Domain & SSL
- Register domain via Route 53 or external registrar
- ACM (AWS Certificate Manager) provides free SSL certificates
- CloudFront serves both frontend and API under the same domain:
  - `yourdomain.com` → S3 (React SPA)
  - `yourdomain.com/api/*` → ALB → FastAPI

### Monitoring & Logging
- **CloudWatch** — API logs, error alerts, performance metrics
- **CloudWatch Alarms** — CPU > 80%, 5xx error spike, payment failures
- **S3 access logs** — track photo download patterns

---

## Pricing Summary & Recommendation

| Stage | Recommended Platform | Monthly Cost |
|-------|---------------------|-------------|
| **Development** | Local (Docker Compose) | $0 |
| **MVP / Early Launch** | AWS Free Tier | $0–5/mo |
| **Growing (100–500 orders/mo)** | AWS (t3.small + RDS) | $40–75/mo |
| **Scale (1000+ orders/mo)** | AWS (ECS Fargate + RDS Multi-AZ) | $100–200/mo |

**Final Verdict: Start with AWS Free Tier for MVP**, which gives you 12 months of near-zero cost hosting. The Mumbai region ensures low latency for Indian users, S3+CloudFront handles photo delivery efficiently, and the ecosystem (SES, CloudWatch, ACM) covers all ancillary needs without additional vendors. When you outgrow free tier, production costs are competitive at ~$40–75/mo for a small-to-medium e-commerce workload.
