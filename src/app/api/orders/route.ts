import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { createOrderSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/order-number";
import { getSettings } from "@/lib/settings";
import { decimalToNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? "Invalid order data.";
      return apiError(message, 400);
    }

    const data = parsed.data;
    const settings = await getSettings();

    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== productIds.length) {
      return apiError("One or more products are unavailable.", 400);
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    const orderItems: Array<{
      productId: string;
      productName: string;
      brand: string;
      variant: string | null;
      quantity: number;
      unit: string;
      unitPrice: number;
      total: number;
    }> = [];

    let subtotal = 0;

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return apiError("Product not found.", 400);
      }

      if (item.quantity > product.stock) {
        return apiError(
          `Only ${product.stock} ${product.unit}(s) of ${product.name} are currently available.`,
          400
        );
      }

      const unitPrice = decimalToNumber(product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        variant: product.variant,
        quantity: item.quantity,
        unit: product.unit,
        unitPrice,
        total: lineTotal,
      });
    }

    const deliveryCharge = 0;
    const total = subtotal;

    if (total < settings.minimumOrderValue) {
      return apiError(
        `Minimum order value is ₹${settings.minimumOrderValue}.`,
        400
      );
    }

    const orderNumber = await generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          phone: data.phone,
          whatsapp: data.whatsapp || data.phone,
          deliveryAddress: data.deliveryAddress,
          houseNumber: data.houseNumber,
          street: data.street,
          area: data.area,
          city: data.city,
          district: data.district,
          state: data.state,
          pincode: data.pincode,
          additionalInstructions: data.additionalInstructions,
          subtotal,
          deliveryCharge,
          total,
          status: "NEW",
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              brand: item.brand,
              variant: item.variant,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return apiSuccess({
      orderId: order.id,
      orderNumber: order.orderNumber,
      subtotal,
      deliveryCharge,
      total,
      items: orderItems,
    });
  } catch (err) {
    return handleApiError(err, "Unable to place your order right now. Please try again.");
  }
}
