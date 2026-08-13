import { prisma } from "./prisma";
import { decimalToNumber } from "./utils";

export async function getSettings() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  return {
    ...settings,
    deliveryCharge: decimalToNumber(settings.deliveryCharge),
    minimumOrderValue: decimalToNumber(settings.minimumOrderValue),
  };
}

export function serializeProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: "CEMENT" | "STEEL";
  brand: string;
  variant: string | null;
  price: { toNumber(): number };
  unit: string;
  stock: number;
  minimumStock: number;
  image: string | null;
  active: boolean;
}) {
  return {
    ...product,
    price: decimalToNumber(product.price),
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
