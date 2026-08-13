import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const DB_DIR = join(process.cwd(), "data", "db");
const DB_NAME = "pavithra_traders";

function loadEnv() {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] ??= value;
  }
}

async function isDatabaseRunning() {
  loadEnv();
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    return true;
  } catch {
    try {
      await prisma.$disconnect();
    } catch {
      /* ignore */
    }
    return false;
  }
}

const pg = new EmbeddedPostgres({
  databaseDir: DB_DIR,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

async function main() {
  if (await isDatabaseRunning()) {
    console.log("PostgreSQL is already running at localhost:5432");
    console.log("No need to start again.");
    console.log("");
    console.log("Run in another terminal: npm run dev");
    console.log("Customer site: http://localhost:3000");
    console.log("Admin login:   http://localhost:3000/admin/login");
    return;
  }

  console.log("Starting local PostgreSQL...");

  if (!existsSync(DB_DIR)) {
    await pg.initialise();
  }

  await pg.start();
  console.log("PostgreSQL running at localhost:5432");

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`Created database: ${DB_NAME}`);
  } catch {
    console.log(`Database ${DB_NAME} already exists`);
  }

  console.log("");
  console.log("Next steps (new terminal):");
  console.log("  npm run dev");
  console.log("");
  console.log("Customer site: http://localhost:3000");
  console.log("Admin login:   http://localhost:3000/admin/login");
  console.log("");
  console.log("Press Ctrl+C to stop the database");

  await new Promise(() => {});
}

main().catch((err) => {
  if (String(err).includes("postmaster.pid")) {
    console.log("PostgreSQL may already be running in another terminal.");
    console.log("Try: npm run db:check");
    console.log("If OK, just run: npm run dev");
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
