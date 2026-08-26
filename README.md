# Pahadi Haat

A local-marketplace app with three roles — Customer, Seller, Driver —
now split into two real projects:

```
pahadi-haat-backend/   Spring Boot 3 REST API (JWT auth, H2 database)
pahadi-haat-react/     React + Vite frontend, wired to that API
```

## Quick start

**1. Start the backend** (Java 17+, Maven required):

```bash
cd pahadi-haat-backend
mvn spring-boot:run
```

Runs on http://localhost:8080 and seeds a demo catalog on first boot.

**2. Start the frontend** (Node 18+):

```bash
cd pahadi-haat-react
npm install
npm run dev
```

Runs on http://localhost:5173 and talks to the backend at
`http://localhost:8080/api` by default.

**3. Open http://localhost:5173** — browse as a guest, or register as a
Customer, Seller, or Driver from the login page to try each role's
dashboard.

See each project's own README for full details (API reference,
deployment notes, environment variables, project layout).

## What's real vs. decorative

Everything you'd expect from an e-commerce app is backed by the database:
accounts (all 3 roles), shops, products & stock, orders & pricing, and
delivery assignment/status. The only static content left in the frontend
is purely visual marketing filler (deal banners, a "Local Produce"
teaser row) that was never tied to any data model.

## Note on this build

I wasn't able to run `mvn` in this environment (Maven Central isn't on
the sandbox's network allowlist), so the backend is unit-buildable but
untested end-to-end here — the frontend, however, was installed and
built successfully (`npm run build` completed with 0 errors). Double
check the backend compiles with `mvn spring-boot:run` on your machine;
if you hit anything, it's most likely a small dependency-version snag,
not a logic issue with the code itself.

## Deployment

Deploy the frontend's `pahadi-haat-react/dist/` directory to any static host.
Set `VITE_API_BASE_URL` to the public backend URL plus `/api` before running
`npm run build` (for example, `https://api.example.com/api`).

Deploy the backend with `SPRING_PROFILES_ACTIVE=prod` and PostgreSQL. The
production profile deliberately refuses to start unless these variables are
provided:

```
DATABASE_URL=jdbc:postgresql://host:5432/pahadihaat
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
APP_JWT_SECRET=at-least-32-random-characters
APP_CORS_ALLOWED_ORIGINS=https://your-frontend.example.com
```

`APP_CORS_ALLOWED_ORIGINS` may contain a comma-separated list when needed.
The production profile disables the H2 console and requires its database,
secret, and frontend origins explicitly.
