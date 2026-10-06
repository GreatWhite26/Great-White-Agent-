# RevenuePilot Security

RevenuePilot's public customer demo is intentionally designed with a small attack surface.

## Current public demo
- No Stripe secret keys in browser code.
- No ElevenLabs or other private AI keys in browser code.
- No passwords or private customer files collected.
- No remote API calls from the demo workspace.
- Customer demo is isolated from the owner RevenuePilot workflow.
- Content Security Policy blocks unexpected remote connections and framing.

## Required before paid SaaS launch
1. Use Stripe Checkout / Payment Links for card collection. Never collect raw card data in RevenuePilot.
2. Add server-side authentication and authorization.
3. Store all API keys and service credentials only in server-side environment variables.
4. Verify Stripe webhooks server-side before activating or extending paid access.
5. Enforce per-user and per-plan rate limits on all AI/render/publish endpoints.
6. Use least-privilege API scopes and rotate compromised keys immediately.
7. Validate and sanitize all server inputs; reject unexpected file types and oversized payloads.
8. Add audit logging for sign-in, billing, entitlement, API-use, and admin events.
9. Add dependency scanning and periodic security review before releases.
10. Keep the owner build and customer production data separated.

## Security note
No internet-facing application can be guaranteed unhackable. The design goal is defense in depth, minimal exposed secrets, strong account isolation, trusted payment handling, and rapid detection/recovery.
