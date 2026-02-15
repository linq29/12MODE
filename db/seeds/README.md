# Seed Data

- Source data: `db/seeds/databaselite.json`
- API seed script: `apps/api/src/db/seed.ts`

Run after applying `db/migrations/001_init.sql`:

```bash
npm --workspace @12mode/api run seed
```
