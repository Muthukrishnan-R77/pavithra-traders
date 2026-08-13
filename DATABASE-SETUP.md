# Database Setup — Fix P1001 Error

Error `P1001: Can't reach database server at localhost:5432` means **PostgreSQL is not running**.

Your `.env` points to:
```
postgresql://postgres:postgres@localhost:5432/pavithra_traders
```

Pick **one** option below.

---

## Option A — Neon (Recommended, free, no install)

Best if you don't have PostgreSQL installed locally.

1. Go to [https://neon.tech](https://neon.tech) and create a free account.
2. Create a new project (name it `pavithra-traders`).
3. Copy the **connection string** (looks like):
   ```
   postgresql://user:password@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Open `d:\pavi1\.env` and replace `DATABASE_URL` with your Neon string.
5. Run:
   ```powershell
   cd d:\pavi1
   $env:NODE_TLS_REJECT_UNAUTHORIZED="0"
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run dev
   ```

---

## Option B — Docker (if Docker Desktop is installed)

1. Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
2. Start Docker Desktop.
3. Run:
   ```powershell
   cd d:\pavi1
   docker compose up -d
   ```
4. Wait ~10 seconds, then:
   ```powershell
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run dev
   ```

Your `.env` already matches the Docker setup (`postgres` / `postgres` / `pavithra_traders`).

---

## Option C — Install PostgreSQL on Windows

1. Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Install with default port **5432**.
3. Set password for user `postgres` (remember it!).
4. Open **pgAdmin** or **SQL Shell (psql)** and create the database:
   ```sql
   CREATE DATABASE pavithra_traders;
   ```
5. Update `d:\pavi1\.env`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pavithra_traders?schema=public"
   ```
6. Run:
   ```powershell
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run dev
   ```

---

## Verify connection

```powershell
npm run db:check
```

If it prints `Database connection OK`, run migrate and seed.
