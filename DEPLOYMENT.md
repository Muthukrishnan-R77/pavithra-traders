# Deploy PAVITHRA TRADERS

## Important: how this project works

This is **one Next.js app**. The customer website, admin dashboard, and API routes (`/api/*`) are all in the same codebase.

| What you might call… | In this project |
|----------------------|-----------------|
| Frontend | Next.js pages (`/`, `/cart`, `/admin`, …) |
| Backend | Next.js API routes (`/api/products`, `/api/orders`, …) |
| Database | PostgreSQL (Prisma) |

You **cannot** put only the frontend on Vercel and only the API on Render without rewriting the whole project.

### Recommended setup (best for you)

| Service | Host | Purpose |
|---------|------|---------|
| **App** (frontend + API) | **Vercel** | Customer site + admin + APIs |
| **Database** | **Neon** (free) or **Render PostgreSQL** | Store products, orders, admin user |

### Your two links (same app, different paths)

After deploy, you get:

| | URL |
|---|---|
| **Customer website** | `https://YOUR-APP.vercel.app` |
| **Admin dashboard** | `https://YOUR-APP.vercel.app/admin/login` |

Example:
- Customer: `https://pavithra-traders.vercel.app`
- Admin: `https://pavithra-traders.vercel.app/admin/login`

**Admin password:** value you set in `ADMIN_PASSWORD` (default seed: `ChangeMe@123`)

---

## Step 1 — Push code to GitHub

1. Create a repo on GitHub (e.g. `pavithra-traders`)
2. Push this project:

```powershell
cd d:\pavi1
git init
git add .
git commit -m "Prepare for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pavithra-traders.git
git push -u origin main
```

Do **not** commit `.env` (secrets). It should stay local only.

---

## Step 2 — Create PostgreSQL database

### Option A: Neon (recommended, free)

1. Go to [https://neon.tech](https://neon.tech) → Sign up
2. **New Project** → name: `pavithra-traders`
3. Copy the connection string (looks like):
   ```
   postgresql://user:pass@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Save it — you need it for Vercel

### Option B: Render PostgreSQL (free)

1. Go to [https://render.com](https://render.com) → Sign up
2. **New +** → **PostgreSQL**
3. Name: `pavithra-db`, plan: **Free**
4. After creation, copy **Internal Database URL** or **External Database URL**

---

## Step 3 — Deploy app on Vercel

1. Go to [https://vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New…** → **Project** → import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Add **Environment Variables**:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Your Neon/Render PostgreSQL URL |
| `NEXTAUTH_SECRET` | Random string — run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` (update after first deploy if URL differs) |
| `ADMIN_EMAIL` | `admin@pavithra.com` |
| `ADMIN_PASSWORD` | Your strong admin password |
| `ADMIN_NAME` | `Shop Owner` |

5. Click **Deploy**

Vercel runs: `prisma generate` → `prisma migrate deploy` → `next build`

---

## Step 4 — Seed production database (once)

After the first successful deploy, run seed **once** to create products and admin user:

**From your PC** (with production `DATABASE_URL`):

```powershell
cd d:\pavi1
$env:DATABASE_URL="postgresql://YOUR_PRODUCTION_DB_URL"
$env:ADMIN_EMAIL="admin@pavithra.com"
$env:ADMIN_PASSWORD="YourStrongPassword123"
npx prisma db seed
```

Or use Neon SQL editor / Render shell with the same commands.

---

## Step 5 — Update NEXTAUTH_URL

1. Vercel → your project → **Settings** → **Environment Variables**
2. Set `NEXTAUTH_URL` to your exact live URL, e.g. `https://pavithra-traders.vercel.app`
3. **Redeploy** (Deployments → … → Redeploy)

Admin login will not work correctly if `NEXTAUTH_URL` is wrong.

---

## Step 6 — Test both links

| Check | URL |
|-------|-----|
| Customer home | `https://YOUR-APP.vercel.app` |
| Products | `https://YOUR-APP.vercel.app/products` |
| Admin login | `https://YOUR-APP.vercel.app/admin/login` |

Log in to admin with your `ADMIN_PASSWORD`.

---

## Alternative: everything on Render

If you prefer Render instead of Vercel:

1. Push repo to GitHub
2. Render → **New Blueprint** → connect repo → use `render.yaml`
3. Set `NEXTAUTH_URL` to your Render URL (e.g. `https://pavithra-traders.onrender.com`)
4. Set `ADMIN_PASSWORD` in Render dashboard
5. After deploy, run seed once (Render shell or local with production `DATABASE_URL`)

Links:
- Customer: `https://pavithra-traders.onrender.com`
- Admin: `https://pavithra-traders.onrender.com/admin/login`

Note: Render free tier sleeps after inactivity (slow first load).

---

## Custom domain (optional)

On Vercel → **Settings** → **Domains**:

| Domain | Use for |
|--------|---------|
| `pavithratraders.com` | Customer site |
| `admin.pavithratraders.com` | Admin (same project — both domains point to Vercel) |

Update `NEXTAUTH_URL` to your primary domain and redeploy.

---

## Environment variables checklist

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=random-32-char-string
NEXTAUTH_URL=https://your-live-domain.com
ADMIN_EMAIL=admin@pavithra.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Shop Owner
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Prisma | Check `DATABASE_URL` is set in Vercel and DB is reachable |
| Admin login fails | Fix `NEXTAUTH_URL` to match live URL exactly |
| No products | Run `npx prisma db seed` on production DB |
| Images missing | Product images in `public/images/` are deployed with the app — ensure they are committed to Git |

---

## Summary

```
GitHub repo
    ↓
Vercel (Next.js app — customer + admin + APIs)
    ↓
Neon or Render (PostgreSQL database)
```

**Customer link:** `https://YOUR-APP.vercel.app`  
**Admin link:** `https://YOUR-APP.vercel.app/admin/login`
