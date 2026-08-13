# PAVITHRA TRADERS — Full-Stack E-Commerce

Production-ready construction materials e-commerce platform for **PAVITHRA TRADERS** (Cement & Steel).

## Architecture

```
Customer Website → Next.js API → Prisma → PostgreSQL → Admin Dashboard
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth (Credentials) with bcryptjs
- **Validation:** Zod

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud — e.g. Neon, Supabase, Railway)

## Installation

```bash
npm install
```

## Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pavithra_traders?schema=public"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@pavithra.com"
ADMIN_PASSWORD="ChangeMe@123"
ADMIN_NAME="Shop Owner"
```

Generate a secret:

```bash
openssl rand -base64 32
```

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## Development

```bash
npm run dev
```

- **Customer site:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login

## Admin Account

The seed script creates an admin user from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

**Change the password immediately after first login in production.**

Only users with `role = ADMIN` can access `/admin/*` routes.

## How Orders Work

1. Customer adds products to cart (prices fetched from database)
2. Customer completes checkout → `POST /api/orders`
3. Server validates input, fetches current prices, calculates totals
4. Order + OrderItems saved to PostgreSQL with price snapshots
5. Admin dashboard polls every 10s and shows new orders automatically

## How Prices Work

1. Admin updates price at `/admin/prices`
2. Price saved to PostgreSQL + PriceHistory record created
3. Customer website, ticker, and cart reflect new prices immediately
4. Old orders retain their original `unitPrice` values

## Production Build

```bash
npm run build
npm start
```

## Deployment

Works on Vercel, Railway, Render, or any Node.js host with PostgreSQL.

1. Set all environment variables on your hosting platform
2. Run `npx prisma migrate deploy` against production database
3. Run `npx prisma db seed` once for initial products and admin
4. Set `NEXTAUTH_URL` to your production domain

### Recommended: Neon or Supabase for PostgreSQL

Both offer free tiers suitable for this project.

## API Routes

| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/[id]` | Public |
| POST | `/api/orders` | Public |
| GET | `/api/settings` | Public |
| GET/PATCH | `/api/admin/*` | Admin only |

## License

Private — PAVITHRA TRADERS
