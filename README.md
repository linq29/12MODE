# 12MODE (Restructured)

This repository has been restructured from a static HTML/CSS/JS site into a TypeScript-first full-stack layout:

- Frontend: React + TypeScript (`apps/web`)
- Backend: Express + TypeScript (`apps/api`)
- Database: PostgreSQL (`db/migrations` + seed script)
- Shared types: (`packages/shared`)
- Legacy static site preserved in: `legacy/`

## Project Structure

```txt
.
├─ apps/
│  ├─ web/        # React + Vite + TypeScript frontend
│  └─ api/        # Express + TypeScript API + PG access
├─ packages/
│  └─ shared/     # Shared TS types
├─ db/
│  ├─ migrations/ # SQL schema
│  └─ seeds/      # JSON seed source
└─ legacy/        # Original static site files (preserved)
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Create PostgreSQL database and apply migration:

```bash
psql "$DATABASE_URL" -f db/migrations/001_init.sql
```

4. Seed shrine data:

```bash
npm --workspace @12mode/api run seed
```

5. Run API and web in separate terminals:

```bash
npm run dev:api
npm run dev:web
```

## API Endpoints

- `GET /api/health`
- `GET /api/shrines`
- `GET /api/shrines/:spotId`

## Migration Notes

See `docs/migration-issues.md` for known risks and cleanup items discovered during restructure.
