# Memories - Album E-Commerce Platform

An e-commerce platform where users can browse predefined photo album templates, select a template and size, upload photos, and order custom albums. Built with React + Tailwind CSS frontend and Python FastAPI + PostgreSQL backend, with Razorpay payment integration.

## Prerequisites

- **Python** 3.11+
- **Node.js** 18+
- **Docker & Docker Compose** (for PostgreSQL)

## Project Structure

```
memories/
├── backend/          # FastAPI + SQLAlchemy API
│   ├── app/
│   │   ├── main.py           # App entry point
│   │   ├── database.py       # DB engine & session
│   │   ├── core/             # Config, security, Razorpay client
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API route handlers
│   │   └── services/         # Business logic
│   ├── alembic/              # Database migrations
│   ├── uploads/              # Local photo storage
│   ├── tests/                # Pytest test suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/         # React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/              # Axios API clients
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── context/          # Auth & Cart context providers
│   │   └── hooks/            # Custom React hooks
│   └── package.json
└── docker-compose.yml
```

## Local Setup

### 1. Start PostgreSQL

```bash
docker compose up -d
```

This starts PostgreSQL 16 on `localhost:5432` with:
- Database: `memories_db`
- User: `memories_user`
- Password: `memories_pass`

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

The default `.env` values work with the Docker Compose PostgreSQL setup. Edit `.env` to configure Razorpay keys or other settings:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://memories_user:memories_pass@localhost:5432/memories_db` | PostgreSQL connection string |
| `SECRET_KEY` | `your-secret-key-change-in-production` | JWT signing key |
| `RAZORPAY_KEY_ID` | `your-razorpay-key-id` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | `your-razorpay-key-secret` | Razorpay API secret |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed CORS origins |
| `UPLOAD_DIR` | `uploads` | Photo upload directory |

### 3. Run Database Migrations

```bash
cd backend

# Generate the initial migration
alembic revision --autogenerate -m "initial"

# Apply migrations to create all tables
alembic upgrade head
```

> **Note:** You must run migrations before starting the backend. Without this step, API requests will fail with `relation "users" does not exist`.

### 4. Start the Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The API is now available at `http://localhost:8000`.

- Health check: `GET http://localhost:8000/api/v1/health`
- API docs (Swagger): `http://localhost:8000/docs`

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend runs at `http://localhost:5173` with API requests proxied to the backend.

## Running Tests

```bash
cd backend
pytest
```

Tests use an in-memory SQLite database, so no external database is needed.

## API Endpoints

| Group | Base Path | Key Endpoints |
|-------|-----------|---------------|
| Auth | `/api/v1/auth` | `POST /register`, `POST /login`, `POST /refresh`, `GET /me` |
| Templates | `/api/v1/templates` | `GET /`, `GET /{id}` |
| Albums | `/api/v1/albums` | `POST /`, `GET /`, `POST /{id}/photos` |
| Cart | `/api/v1/cart` | `GET /`, `POST /items`, `DELETE /items/{id}` |
| Addresses | `/api/v1/addresses` | `GET /`, `POST /`, `PUT /{id}`, `DELETE /{id}` |
| Orders | `/api/v1/orders` | `POST /`, `GET /`, `GET /{id}` |
| Payments | `/api/v1/payments` | `POST /create`, `POST /verify`, `POST /webhook` |
| Admin | `/api/v1/admin` | Template/size/order management (requires admin role) |

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router, Axios
- **Backend:** FastAPI, SQLAlchemy 2, Alembic, Pydantic 2
- **Database:** PostgreSQL 16
- **Payments:** Razorpay
- **Image Processing:** Pillow
