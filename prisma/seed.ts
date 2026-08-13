import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CEMENT_BRANDS = [
  { brand: "UltraTech", price: 450, stock: 250 },
  { brand: "Dalmia", price: 440, stock: 200 },
  { brand: "Ramco", price: 430, stock: 180 },
  { brand: "Maha", price: 420, stock: 150 },
  { brand: "Penna", price: 435, stock: 160 },
];

const STEEL_BRANDS = ["Tata Tiscon", "JSW Neosteel", "Agni Steels", "SSI TMT"];
const STEEL_VARIANTS = [
  { variant: "8mm", price: 58 },
  { variant: "10mm", price: 59 },
  { variant: "12mm", price: 60 },
  { variant: "16mm", price: 62 },
  { variant: "20mm", price: 64 },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@pavithra.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe@123";
  const adminName = process.env.ADMIN_NAME ?? "Shop Owner";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      phone: "9025644746",
    },
  });

  console.log(`Admin account: ${adminEmail}`);

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "PAVITHRA TRADERS",
      phone: "9025644746",
      whatsapp: "9025644746",
      location: "AAA",
      address: "AAA, Tamil Nadu, India",
      openingHours: "Mon–Sat: 8:00 AM – 7:00 PM",
      deliveryCharge: 200,
      minimumOrderValue: 0,
    },
  });

  for (const cement of CEMENT_BRANDS) {
    const name = `${cement.brand} Cement`;
    const slug = slugify(name);
    const imageFile = `/images/cement/${slugify(cement.brand)}.jpg`;
    await prisma.product.upsert({
      where: { slug },
      update: { image: imageFile },
      create: {
        name,
        slug,
        description: `Premium ${cement.brand} cement for strong and durable construction. Ideal for residential and commercial projects.`,
        category: "CEMENT",
        brand: cement.brand,
        price: cement.price,
        unit: "Bag",
        stock: cement.stock,
        minimumStock: 50,
        image: imageFile,
        active: true,
      },
    });
  }

  for (const brand of STEEL_BRANDS) {
    const brandImage = `/images/steel/${slugify(brand)}.jpg`;
    for (const v of STEEL_VARIANTS) {
      const name = `${brand} ${v.variant}`;
      const slug = slugify(name);
      await prisma.product.upsert({
        where: { slug },
        update: { image: brandImage },
        create: {
          name,
          slug,
          description: `${brand} TMT steel bars ${v.variant} — high strength, corrosion resistant, ISI certified.`,
          category: "STEEL",
          brand,
          variant: v.variant,
          price: v.price,
          unit: "Kg",
          stock: 5000,
          minimumStock: 500,
          image: brandImage,
          active: true,
        },
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
