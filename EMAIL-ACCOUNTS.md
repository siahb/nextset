# Email account transition

Email/password account UI and server-verified Supabase identities are implemented. Workout logs remain in the existing D1 database, scoped by `email:<verified Supabase user ID>`. Existing ChatGPT logs are preserved. Import requires both identities to have the same verified email and does not replace existing email-account records.

Production still uses the previous private publication. Keep registration disabled until:
- Supabase allows https://nextset.siahverse.cc/account and the generated Site origin /account as email redirect URLs, preserving NurseDoku redirects.
- Signup confirmation, sign-in and password recovery have been checked with user-authorized accounts.
- Authenticated users cannot access another user's logs and anonymous requests are denied.

Resend sending domain verification succeeded September 30, 2026. The Supabase dashboard needs owner sign-in to configure redirects. Its connected database tools cannot edit Auth configuration.

After those checks: enable registration in lib/email-config.ts, build/publish this Site, then change Site access to public. The public program and tools can be viewed without an account; private workout data still requires server-verified identity. Do not remove the original auth helper until old logs have been imported.
