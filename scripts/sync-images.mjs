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

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const products = await prisma.product.findMany();

  for (const product of products) {
    let imagePath;

    if (product.category === "CEMENT") {
      imagePath = `/images/cement/${slugify(product.brand)}.jpg`;
    } else {
      imagePath = `/images/steel/${slugify(product.brand)}.jpg`;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { image: imagePath },
    });

    console.log(`Updated ${product.name} -> ${imagePath}`);
  }

  console.log("All product images synced to local files.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
