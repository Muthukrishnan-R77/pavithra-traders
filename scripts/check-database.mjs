import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

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

loadEnv();

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection OK");
    process.exit(0);
  } catch (error) {
    console.error("Database connection FAILED");
    console.error("");
    if (String(error).includes("P1001") || String(error).includes("Can't reach")) {
      console.error("PostgreSQL is not running at localhost:5432.");
      console.error("");
      console.error("Fix options:");
      console.error("  1. Use free Neon cloud DB  -> see DATABASE-SETUP.md (Option A)");
      console.error("  2. Start Docker Postgres    -> docker compose up -d");
      console.error("  3. Install PostgreSQL       -> see DATABASE-SETUP.md (Option C)");
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
