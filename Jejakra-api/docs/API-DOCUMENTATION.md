# Jejakra Backend API Documentation

**Comprehensive Backend Documentation & API Reference**  
Version 1.0 | Last Updated: February 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [API Reference](#3-api-reference)
4. [Authentication & Security](#4-authentication--security)
5. [Error Handling](#5-error-handling)
6. [Environment Configuration](#6-environment-configuration)
7. [Deployment Guide](#7-deployment-guide)
8. [Maintenance & Monitoring](#8-maintenance--monitoring)
9. [Future Enhancement Roadmap](#9-future-enhancement-roadmap)
10. [Appendices](#appendices)

---

## 1. Executive Summary

Jejakra is a modern healthcare clinic management platform consisting of a React frontend and Node.js/Express backend with PostgreSQL database. This document provides comprehensive documentation for the backend API implementation located in the `Jejakra-api` directory.

### 1.1 Key Features

- JWT-based authentication with Argon2 password hashing
- Complete patient management with clinical data
- Appointment scheduling with conflict detection
- Real-time dashboard with statistics and activity logging
- Rate limiting on authentication endpoints
- CORS configuration and comprehensive error handling
- Prisma ORM with PostgreSQL database

### 1.2 Implementation Status

The API is **fully implemented** under `Jejakra-api/` with the following structure:

| Area | Location | Status |
|------|----------|--------|
| Entry Point | `src/index.ts` | Express app, CORS, rate limit, routes mounted |
| Auth | `src/modules/auth/` | Login, register, GET me, PATCH profile, JWT + argon2 |
| Patients | `src/modules/patients/` | List (search, gender, status, pagination), get by id, create, update, delete |
| Appointments | `src/modules/appointments/` | List (date, patientId, status), get by id, get by patient, create, update, delete |
| Dashboard | `src/modules/dashboard/` | GET stats, GET activity; activity logging |
| Config | `src/config/` | Env (port, DB URL, JWT secret, CORS) and Prisma client |
| Middleware | `src/middleware/` | JWT auth, optional auth, error handler |
| Database | `prisma/` | Schema (User, Patient, PatientDetails, Appointment, ActivityLog) and seed script |

---

## 2. System Architecture

### 2.1 Technology Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js (LTS) |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + Argon2 |
| Language | TypeScript |

### 2.2 Project Structure

```
Jejakra-api/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── config/               # Environment & database config
│   ├── modules/
│   │   ├── auth/             # Authentication (login, register, profile)
│   │   ├── patients/         # Patient CRUD operations
│   │   ├── appointments/     # Appointment management
│   │   └── dashboard/        # Statistics & activity logging
│   ├── middleware/
│   │   ├── auth.ts           # JWT validation & optional auth
│   │   └── errorHandler.ts   # Global error handler
│   └── utils/
│       └── transform.ts      # API response transformers
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data script
├── docs/
│   ├── API-DOCUMENTATION.md  # This file
│   ├── DATABASE-DESIGN.md    # Schema and DB operations
│   └── README.md             # Docs index
├── .env                      # Environment variables (not committed)
└── package.json
```

### 2.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ api.js      │  │ auth.js      │  │ Components    │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (Express/Node.js)              │
│  ┌────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Auth API   │  │ Patient API │  │ Appointment API │  │
│  │ Dashboard  │  │ Middleware  │  │ Error Handler   │  │
│  └────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ Prisma ORM
                      ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                        │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────────┐    │
│  │ users   │  │ patients │  │ patient_details     │    │
│  │ appts   │  │ activity │  │ (indexes, relations) │    │
│  └─────────┘  └──────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 2.4 Data Layer

The API is backed by PostgreSQL. For table definitions, relationships, enums, and database commands (migrate, seed, Prisma Studio), see **[Database Design](./DATABASE-DESIGN.md)**.

---

## 3. API Reference

### 3.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | `{ email, password }` → `{ user, token }` |
| POST | `/auth/register` | `{ email, password, name?, role? }` → `{ user, token }` |
| GET | `/auth/me` | Current user (requires `Authorization: Bearer <token>`) |
| PATCH | `/auth/profile` | Update name/avatar (requires auth) |

### 3.2 Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List; query: `search`, `gender`, `status`, `page`, `limit` |
| GET | `/api/patients/:id` | Get one (includes details) |
| POST | `/api/patients` | Create |
| PUT | `/api/patients/:id` | Update |
| DELETE | `/api/patients/:id` | Delete (204) |

List response with pagination: `{ data, total, page, limit, totalPages }`. Without `page`/`limit`: array of patients. Each patient includes `id`, `displayId` (e.g. P-xxxxxxxx), and all table fields in frontend-friendly format.

### 3.3 Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List; query: `date`, `patientId`, `status`, `page`, `limit` |
| GET | `/api/appointments/:id` | Get one |
| GET | `/api/appointments/patient/:patientId` | List by patient |
| POST | `/api/appointments` | Create; body: `patient_id` or `patientName`, `appointmentType`, `date`, `time`, `visitType`, `sessionType?`, `reason?`, `notes?` |
| PUT | `/api/appointments/:id` | Update |
| DELETE | `/api/appointments/:id` | Delete (204) |

Time must be one of: 8:00 AM, 9:30 AM, 11:00 AM, 12:30 PM, 3:00 PM, 4:30 PM. Responses include `patientName`, `patientId`, `isToday`.

### 3.4 Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | `{ totalPatients, appointmentsToday, pendingCount, completedCount, upcomingScheduled, trends }` |
| GET | `/api/dashboard/activity` | `{ activities }`; query: `limit` (default 20) |

### 3.5 Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | `{ status: "ok", timestamp }` (no auth) |

---

## 4. Authentication & Security

- **JWT:** Issued on login/register; send as `Authorization: Bearer <token>`.
- **Passwords:** Hashed with Argon2; min length 6 on register (Zod).
- **Rate limiting:** Auth routes limited (20 requests / 15 min per IP).
- **CORS:** Origin from `CORS_ORIGIN` env (default `http://localhost:5173`).
- **Optional auth:** Patients, appointments, and dashboard routes accept requests with or without a valid token.

---

## 5. Error Handling

- **400** – Bad request / validation (Zod `details` may be included).
- **401** – Unauthorized (missing or invalid token on protected routes).
- **404** – Resource not found.
- **409** – Conflict (e.g. slot already booked, email exists).
- **429** – Rate limit exceeded.
- **500** – Internal server error.

Response shape: `{ error: "message" }`.

---

## 6. Environment Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| DATABASE_URL | PostgreSQL connection string | (required) |
| JWT_SECRET | JWT signing secret; **must be set in production** | Dev default exists (do not use in production) |
| JWT_EXPIRES_IN | Token expiry | 7d |
| CORS_ORIGIN | Allowed frontend origin | http://localhost:5173 |
| NODE_ENV | development / production | development |

---

## 7. Deployment Guide

- Set production env: `DATABASE_URL`, `JWT_SECRET` (use a strong random value), `CORS_ORIGIN`, `NODE_ENV=production`.
- Run `npx prisma generate` and `npx prisma migrate deploy` before start.
- Build: `npm run build`. Start: `npm start`.

---

## 8. Maintenance & Monitoring

- Use `GET /api/health` for liveness.
- Run `npm audit` for dependency vulnerabilities.
- Back up PostgreSQL (e.g. `pg_dump`) regularly.

---

## 9. Future Enhancement Roadmap

- Email/SMS notifications, file uploads, multi-clinic support, 2FA, patient portal, API versioning, OpenAPI/Swagger, soft deletes, refresh tokens.

---

## Appendices

### Appendix A: Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login |
| POST | `/auth/register` | No | Register |
| GET | `/auth/me` | Yes | Current user |
| PATCH | `/auth/profile` | Yes | Update profile |
| GET | `/api/patients` | Optional | List patients |
| GET | `/api/patients/:id` | Optional | Get patient |
| POST | `/api/patients` | Optional | Create patient |
| PUT | `/api/patients/:id` | Optional | Update patient |
| DELETE | `/api/patients/:id` | Optional | Delete patient |
| GET | `/api/appointments` | Optional | List appointments |
| GET | `/api/appointments/:id` | Optional | Get appointment |
| GET | `/api/appointments/patient/:patientId` | Optional | By patient |
| POST | `/api/appointments` | Optional | Create appointment |
| PUT | `/api/appointments/:id` | Optional | Update appointment |
| DELETE | `/api/appointments/:id` | Optional | Delete appointment |
| GET | `/api/dashboard/stats` | Optional | Stats |
| GET | `/api/dashboard/activity` | Optional | Activity |
| GET | `/api/health` | No | Health check |

### Appendix B: Quick Start

```bash
cd Jejakra-api
npm install
# Set DATABASE_URL in .env (never commit .env or real credentials)
npx prisma generate && npx prisma db push && npm run db:seed
npm run dev
# API: http://localhost:3001
# Seed user: set SEED_USER_EMAIL and SEED_USER_PASSWORD in .env (see env.example)
```

**Security:** Keep `.env` out of version control; do not commit real database URLs, JWT secrets, or seed passwords.

---

*End of Documentation*
