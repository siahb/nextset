# Email accounts

Email/password accounts use Supabase Auth. Workout logs remain in the existing D1 database, scoped by `email:<verified Supabase user ID>`. Every email-account API request verifies identity through Supabase's Auth server; unverified emails cannot read or write training records. No service-role key is used.

Existing ChatGPT logs are preserved. Import requires both identities to have the same verified email and never replaces existing email-account records. Email accounts are shared with the existing Siahverse authentication project; NurseDoku data and redirects are preserved.

## Configuration and validation

- Resend sending domain verification succeeded September 30, 2026.
- Exact confirmation/recovery redirects are saved for https://nextset.siahverse.cc/account and https://next-set-siah.siahborj.chatgpt.site/account.
- Anonymous, forged-token, unverified-email and verified-identity checks passed; API rejects invalid tokens and cross-origin writes. TypeScript and production builds pass.
- Browser signup confirmation, password recovery delivery, and two-user live save/restore still need a user-authorized test mailbox. No test emails are sent to invented recipients.

The Site is being published with its program and tools accessible publicly. Private workout APIs still require authenticated identity. Registration keeps email confirmation enabled; delivery errors remain visible and can be retried.

To deploy a fork, supply your own Supabase URL/publishable key and D1 binding. Never commit administrator credentials or database exports.
