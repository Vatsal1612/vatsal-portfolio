# Vatsal Chhatbar — Portfolio

Next.js 15 (App Router) portfolio site with an API route for the contact form (MongoDB) and a GitHub stats proxy.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Vercel auto-detects Next.js — no build settings needed.
4. Add these Environment Variables in the Vercel project settings (Settings → Environment Variables):
   - `MONGO_URL` — your MongoDB connection string (use MongoDB Atlas for production; `localhost` won't work on Vercel)
   - `DB_NAME` — database name, e.g. `portfolio`
   - `NEXT_PUBLIC_BASE_URL` — your production URL, e.g. `https://your-project.vercel.app` (or custom domain)
   - `CORS_ORIGINS` — `*` or a specific origin
5. Deploy.

## Notes

- The contact form posts to `/api/contact`, which is a serverless Next.js API route. If `MONGO_URL` is not set, submissions are accepted but not persisted (useful for a quick deploy without a database).
- Add your resume PDF at `public/Vatsal_Chhatbar_Resume.pdf` — the "Download Resume" buttons link there.
- `app/sitemap.js` and `app/robots.js` read `NEXT_PUBLIC_BASE_URL`, so set it correctly per environment for SEO tags to be accurate.
