# Cloudflare migration

Production NextSet runs directly on Cloudflare Workers in the SiahBorj account.

- Worker: `nextset`
- Custom Domain: `nextset.siahverse.cc`
- Worker URL: `nextset.siahborj.workers.dev`
- Dedicated D1: `nextset` (`1d89bdbd-2d7d-4d0a-98d2-eb4cdad51ac0`)
- Authentication: existing Siahverse email accounts, verified by Supabase
- Configuration: `wrangler.jsonc`; generated deployment configuration: `dist/server/wrangler.json`

The four existing application tables were migrated and verified against the source. The initial migration contained one training profile and no workout or custom-program rows. A private source snapshot is stored locally in the ignored `.migration-backup` folder, never in Git. The four existing schema migrations are recorded in D1's migration ledger.

Direct requests no longer accept Sites identity headers. The legacy account import endpoint returns 410 and its controls were removed. Sites tooling and connector wrapping are absent from the current production build. The old Sites deployment remains a recovery copy, with its project metadata recorded in `docs/sites-backup.json`; do not deploy there.

Verification: production build, TypeScript, program and analytics regression tests, verified-email authentication tests, matching live asset hashes, anonymous/forged-header private API rejection, and Cloudflare Custom Domain/D1 binding checks. Password-reset email delivery and actual iPhone Safari testing are separate from this migration.
