# akshfinserv.com

Marketing site for Aksh Finserv, Powai. Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui, Framer Motion. Content is Markdown in `/content`; there is no CMS or database. Deploys to Vercel.

Content editors: see [EDITING.md](EDITING.md).

## Run locally

```bash
cp .env.example .env.local   # fill in what you have; everything is optional locally
npm install
npm run dev                  # http://localhost:3000
```

Without Resend or Turnstile keys, the forms still work locally: email sending and the captcha are skipped and submissions are logged to `data/*.jsonl`. In production, missing keys make the forms fail rather than silently drop leads.

## Where things live

| Path | What |
|---|---|
| `content/` | Insights, team, testimonials, offerings, fund manager interviews (Markdown + YAML frontmatter) |
| `lib/content/` | Zod schemas and typed loaders. Invalid frontmatter, a slug that does not match its file name, or a broken author/related reference fails the build |
| `app/page.tsx` | Home page |
| `app/(site)/` | Inner pages, sharing one header/footer layout |
| `app/api/lead`, `app/api/newsletter` | Form endpoints: Zod validation, honeypot, per-IP rate limit, Turnstile (lead only), Resend |
| `lib/calc.ts` | Calculator maths, including the equity tax constants to update after each Budget |
| `app/globals.css` | Design tokens (colours, radii, fonts) and shared component styles |

Testimonials with `consentGiven: false` render in development only, never in a production build.

## Deploy (Vercel)

1. Import the repository in Vercel. Framework preset: Next.js.
2. Add the environment variables from `.env.example`. `NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.
3. `npm run build` runs `next-sitemap` afterwards, writing `public/sitemap.xml` and `public/robots.txt`.

Notes:

- `data/*.jsonl` backup logs do not persist on Vercel (read-only filesystem). Resend email is the record of each lead.
- The form rate limit is in memory per server instance. Move it to Vercel KV or Upstash if traffic grows.
- GA4 and the Meta Pixel load only when their IDs are set. There is no cookie consent banner yet.
