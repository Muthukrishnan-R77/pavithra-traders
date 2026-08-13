import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid WhatsApp number").optional().or(z.literal("")),
  houseNumber: z.string().optional(),
  street: z.string().optional(),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  additionalInstructions: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminPasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["CEMENT", "STEEL"]),
  brand: z.string().min(1),
  variant: z.string().optional(),
  price: z.number().positive(),
  unit: z.string().min(1),
  stock: z.number().int().min(0),
  minimumStock: z.number().int().min(0),
  image: z.string().optional(),
  active: z.boolean().default(true),
});

export const updatePriceSchema = z.object({
  price: z.number().positive("Price must be greater than zero"),
});

export const updateInventorySchema = z.object({
  stock: z.number().int().min(0),
  minimumStock: z.number().int().min(0).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "CONFIRMED",
    "PROCESSING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const settingsSchema = z.object({
  businessName: z.string().min(1),
  phone: z.string().min(10),
  whatsapp: z.string().min(10),
  location: z.string().min(1),
  address: z.string().optional(),
  openingHours: z.string().optional(),
  deliveryCharge: z.number().min(0),
  minimumOrderValue: z.number().min(0),
  logo: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ProductInput = z.infer<typeof productSchema>;
