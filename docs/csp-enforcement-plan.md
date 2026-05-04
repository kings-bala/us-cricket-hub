# CSP Enforcement Plan (QA-002)

## Current State

- **Header**: `Content-Security-Policy-Report-Only` (not blocking)
- **Reporting**: Active → `https://zig9f1eaqf.execute-api.us-east-1.amazonaws.com/v1/csp-report`
- **Deployed**: PR #161 (2026-05-03)
- **7-day window ends**: 2026-05-10

## Policy (already tightened)

```
default-src 'self'
script-src 'self' 'nonce-{dynamic}' 'strict-dynamic' https://accounts.google.com https://apis.google.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob: https:
media-src 'self' blob:
connect-src 'self' https://*.execute-api.us-east-1.amazonaws.com https://*.amazoncognito.com https://cognito-idp.us-east-1.amazonaws.com https://generativelanguage.googleapis.com https://accounts.google.com https://storage.googleapis.com https://cdn.jsdelivr.net https://api.stripe.com
frame-src https://accounts.google.com https://js.stripe.com
frame-ancestors 'none'
object-src 'none'
base-uri 'self'
form-action 'self' https://accounts.google.com
worker-src 'self' blob: https://cdn.jsdelivr.net
report-uri {endpoint}
report-to csp-endpoint
```

### Security features already in place:
- `'unsafe-eval'` NOT present in script-src
- `'unsafe-inline'` NOT present in script-src (nonces used instead)
- `object-src 'none'` blocks Flash/Java plugins
- `frame-ancestors 'none'` prevents clickjacking
- `'strict-dynamic'` allows nonce-gated scripts to load children
- `'unsafe-inline'` in style-src only (required by Tailwind/inline styles)

## Enforcement Checklist

### Before flipping (7-day window):

- [ ] Check CloudWatch logs for `/v1/csp-report` — confirm reports being collected
- [ ] Triage top 10 violated directives
- [ ] Triage top 10 blocked sources
- [ ] Per-route breakdown (homepage, /auth, /pricing, /analyze, /dashboard)
- [ ] Fix any legitimate violations found
- [ ] Confirm zero violations on critical user paths

### To flip to enforcing:

Set environment variable in Vercel (or `.env`):
```
NEXT_PUBLIC_CSP_ENFORCE=true
```

This activates `Content-Security-Policy` header (blocks violations) while
keeping `Content-Security-Policy-Report-Only` in parallel for continued monitoring.

### Post-enforcement monitoring (4-6 hours):

- [ ] No console errors on: /, /auth, /pricing, /analyze, /dashboard, /players
- [ ] Google Sign-In works
- [ ] Video upload + analysis works
- [ ] Stripe checkout works
- [ ] All JS features functional (no blank pages)
- [ ] Report-uri still receiving reports (now from the Report-Only copy)

### Rollback (instant):

Unset `NEXT_PUBLIC_CSP_ENFORCE` or set to `false` → redeploy.
CSP reverts to Report-Only mode immediately.

## Deploy timing

- Deploy at lowest-traffic time (early morning EST or late night)
- Have at least one person monitoring production for 4-6 hours post-flip
- Keep rollback ready (env var change, ~30s redeploy)
