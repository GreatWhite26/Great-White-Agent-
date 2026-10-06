# RevenuePilot SaaS

Production-oriented customer backend for RevenuePilot Pro.

## Security model
- Stripe Checkout handles card data.
- Supabase Auth handles user identity.
- Stripe webhook is signature-verified.
- Secret keys exist only in server environment variables.
- Subscription entitlement is checked server-side.
- Generation endpoints enforce per-plan rate limits.
- Browser never receives Stripe secret, webhook secret, or Supabase service-role key.

## Deployment
1. Create a Supabase project and run `supabase.sql`.
2. Enable email magic-link auth in Supabase.
3. Create Stripe recurring prices for Starter, Pro, Agency.
4. Deploy the `saas` directory to Vercel.
5. Add all variables from `.env.example` in Vercel project settings.
6. In Stripe, create webhook endpoint: `https://YOUR-VERCEL-DOMAIN/api/stripe-webhook`.
7. Subscribe the webhook to:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
8. Set Supabase Site URL to the Vercel domain.

Never commit real secrets to GitHub.
