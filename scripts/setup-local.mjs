import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const DB_DIR = join(process.cwd(), "data", "db");
const DB_NAME = "pavithra_traders";

const pg = new EmbeddedPostgres({
  databaseDir: DB_DIR,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

async function main() {
  console.log("Setting up local PostgreSQL...");

  if (!existsSync(DB_DIR)) {
    await pg.initialise();
  }

  await pg.start();
  console.log("PostgreSQL started on localhost:5432");

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`Created database: ${DB_NAME}`);
  } catch {
    console.log(`Database ${DB_NAME} already exists`);
  }

  const env = {
    ...process.env,
    DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/${DB_NAME}?schema=public`,
    NODE_TLS_REJECT_UNAUTHORIZED: "0",
  };

  console.log("Running migrations...");
  execSync("npx prisma migrate dev --name init", { stdio: "inherit", env });

  console.log("Seeding database...");
  execSync("npx prisma db seed", { stdio: "inherit", env });

  console.log("");
  console.log("Setup complete!");
  console.log("Keep this terminal open OR run: npm run db:start");
  console.log("Admin login: http://localhost:3000/admin/login");
  console.log("Email: admin@pavithra.com");
  console.log("Password: ChangeMe@123");
  console.log("");
  console.log("Press Ctrl+C to stop PostgreSQL");

  await new Promise(() => {});
}

main().catch(async (err) => {
  console.error(err);
  try {
    await pg.stop();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
