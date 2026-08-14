import { prisma } from "./prisma";
import { decimalToNumber } from "./utils";

const DEFAULT_SETTINGS = {
  id: "default",
  businessName: "PAVITHRA TRADERS",
  phone: "9025644746",
  whatsapp: "9025644746",
  location: "AAA",
  address: "AAA, Tamil Nadu, India",
  openingHours: "Mon–Sat: 8:00 AM – 7:00 PM",
  deliveryCharge: 200,
  minimumOrderValue: 0,
  logo: "/logo.png",
};

export async function getSettings() {
  try {
    const dbPromise = prisma.settings.findFirst();
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 2000)
    );

    const settings = await Promise.race([dbPromise, timeoutPromise]);
    if (settings) {
      return {
        ...settings,
        deliveryCharge: decimalToNumber(settings.deliveryCharge),
        minimumOrderValue: decimalToNumber(settings.minimumOrderValue),
      };
    }
  } catch {
    // Fallback to default
  }

  return DEFAULT_SETTINGS;
}

export function serializeProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: "CEMENT" | "STEEL";
  brand: string;
  variant: string | null;
  price: { toNumber(): number } | number;
  unit: string;
  stock: number;
  minimumStock: number;
  image: string | null;
  active: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  return {
    ...product,
    price: typeof product.price === "number" ? product.price : decimalToNumber(product.price),
    createdAt: product.createdAt ? String(product.createdAt) : undefined,
    updatedAt: product.updatedAt ? String(product.updatedAt) : undefined,
  };
}

export function serializeOrder(order: {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  whatsapp: string | null;
  deliveryAddress: string;
  houseNumber: string | null;
  street: string | null;
  area: string | null;
  city: string;
  district: string | null;
  state: string;
  pincode: string;
  additionalInstructions: string | null;
  subtotal: { toNumber(): number };
  deliveryCharge: { toNumber(): number };
  total: { toNumber(): number };
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items?: Array<{
    id: string;
    productId: string;
    productName: string;
    brand: string;
    variant: string | null;
    quantity: number;
    unit: string;
    unitPrice: { toNumber(): number };
    total: { toNumber(): number };
  }>;
}) {
  return {
    ...order,
    subtotal: decimalToNumber(order.subtotal),
    deliveryCharge: decimalToNumber(order.deliveryCharge),
    total: decimalToNumber(order.total),
    items: order.items?.map((item) => ({
      ...item,
      unitPrice: decimalToNumber(item.unitPrice),
      total: decimalToNumber(item.total),
    })),
  };
}
