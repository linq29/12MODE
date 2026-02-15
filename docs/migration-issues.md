# Potential Migration Issues

## 1. Field Name Inconsistencies
- `legacy/database.json` includes `bleesingID` (typo) instead of `blessingID`.
- Current JS and JSON use mixed naming (`spotID`, `spotHiragana`, `spotCatch`) that differs from SQL/TS conventions.
- Risk: mapping bugs and silent null fields during migration.

## 2. ID Types Are Strings in Source Data
- IDs like `spotID` and `zodiacID` are strings in JSON.
- PostgreSQL schema expects numeric IDs.
- Risk: failed inserts or duplicate-key issues if conversion is inconsistent.

## 3. Data Source Drift (`database.json` vs `databaselite.json`)
- Two JSON sources contain similar but different content quality and coverage.
- Risk: frontend and API may serve inconsistent shrine metadata if source-of-truth is not locked.

## 4. Asset Path Breakage
- Legacy pages reference paths like `images/...` and `js/...` from root.
- After moving files to `legacy/`, direct static hosting paths changed.
- Risk: old pages break unless served with adjusted base path or rewrites.

## 5. Image Format Mismatch
- Legacy JS references `.webp` in places, but many assets are `.jpg`/`.png`.
- Risk: missing image errors in migrated components.

## 6. Encoding / Typography Regression
- Japanese strings and ruby markup are core UX content.
- Risk: mojibake or line-break regressions if DB/client encoding defaults are wrong.

## 7. No Validation Layer on Input Yet
- New API validates route params, but full schema validation on persisted data is still minimal.
- Risk: malformed seed updates can poison production data.

## 8. Missing Auth / Rate Limits / Security Headers
- New API scaffold is intentionally minimal.
- Risk: unsuitable for public deployment without basic hardening.

## 9. No Automated Migration Runner Yet
- SQL migration is currently manual via `psql` command.
- Risk: environment drift between local/dev/prod.

## 10. Test Coverage Not Added Yet
- Restructure creates baseline app scaffolding only.
- Risk: regressions during feature migration from legacy behavior.
