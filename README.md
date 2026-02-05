# Jejakra

Jejakra is a **healthcare clinic management platform** consisting of a React web application and a Node.js/Express API with a PostgreSQL database. It provides patient management, appointment scheduling, clinical data (including BMI and vitals), dashboard statistics, activity logging, and role-based authentication for clinic staff.

## Repository Structure

```
Jejakra-/
├── README.md                 # This file — repository overview
├── Jejakra-api/              # Backend API (Node.js, Express, Prisma, PostgreSQL)
│   ├── src/
│   │   ├── index.ts          # Express app entry point
│   │   ├── config/           # Environment & database config
│   │   ├── modules/          # Auth, patients, appointments, dashboard
│   │   ├── middleware/       # JWT auth, error handler
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema (User, Patient, Appointment, etc.)
│   │   └── seed.ts           # Seed data script
│   ├── docs/                 # API and database documentation
│   ├── env.example           # Environment variables template
│   └── package.json
└── Jejakra-web/              # Frontend (React, Vite)
    ├── src/
    │   ├── components/       # Appointments, dashboard, patients, shared
    │   ├── context/          # AuthContext
    │   ├── hooks/            # useAppointments, usePatients
    │   ├── services/         # API, auth, storage
    │   └── utils/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Projects

### [Jejakra API](./Jejakra-api/)

Backend REST API for the clinic platform.

| Area | Technology |
|------|------------|
| Runtime | Node.js (LTS) |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + Argon2 |
| Language | TypeScript |

**Features:**

- JWT authentication (login, register, profile) with Argon2 password hashing
- Patient CRUD with search, filters (gender, status), pagination
- Appointment scheduling with conflict detection; types: Consultation, Follow-up, Routine checkup
- Dashboard: statistics and activity logging
- Rate limiting on auth endpoints; CORS and centralized error handling

**Documentation:** [API Documentation](./Jejakra-api/docs/API-DOCUMENTATION.md) · [Database Design](./Jejakra-api/docs/DATABASE-DESIGN.md)

---

### [Jejakra Web](./Jejakra-web/)

Web frontend for the clinic platform.

| Area | Technology |
|------|------------|
| UI | React 19 |
| Build | Vite 7 |
| Icons | Lucide React |
| Compiler | React Compiler (Babel) |

**Features:**

- BMI calculator (metric and US units)
- Patient management (list, create, view, edit, appointment history)
- Appointment scheduling with filtering and sorting
- Dashboard with statistics and quick access
- Settings and profile management
- Authentication and user context

**Documentation:** [Jejakra Web README](./Jejakra-web/README.md)

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **PostgreSQL** (for the API; required only when running the backend)

### Frontend only (Jejakra Web)

```bash
cd Jejakra-web
npm install
npm run dev
```

Open `http://localhost:5173`. The app can run with mock/optional API; set `VITE_API_URL` if pointing to a real API.

### Backend only (Jejakra API)

1. Create a PostgreSQL database and set `DATABASE_URL` in `.env`.
2. Copy env template and configure:

   ```bash
   cd Jejakra-api
   cp env.example .env
   # Edit .env: DATABASE_URL, JWT_SECRET (min 32 chars), CORS_ORIGIN (e.g. http://localhost:5173)
   ```

3. Install, generate Prisma client, push schema, and seed (optional):

   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run db:seed   # optional
   ```

4. Start the API:

   ```bash
   npm run dev
   ```

   API runs at `http://localhost:3001` (or the `PORT` in `.env`).

### Full stack (Web + API)

1. Start the API (see **Backend only** above) so it runs on `http://localhost:3001`.
2. In **Jejakra-web**, set the API base URL. For local dev you can use Vite proxy or:

   ```bash
   cd Jejakra-web
   echo "VITE_API_URL=http://localhost:3001" > .env
   npm install
   npm run dev
   ```

3. Open `http://localhost:5173` and use the app against the local API.

---

## API Scripts (Jejakra-api)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run production build (`node dist/index.js`) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB (no migrations) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Run seed script (uses `SEED_*` in `.env`) |

---

## Documentation

- **[Jejakra Web](./Jejakra-web/README.md)** — Frontend setup, scripts, troubleshooting
- **[Jejakra API](./Jejakra-api/docs/API-DOCUMENTATION.md)** — API reference, auth, deployment
- **[Database Design](./Jejakra-api/docs/DATABASE-DESIGN.md)** — Schema and DB operations

---

## Contributing

Each project has its own structure and docs. See the README and `docs/` in **Jejakra-api** and **Jejakra-web** for contribution and development details.
