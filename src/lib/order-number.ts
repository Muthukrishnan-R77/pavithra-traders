import { prisma } from "./prisma";

export async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = `PT-${dateStr}`;

  const lastOrder = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
  });

  let sequence = 1;
  if (lastOrder) {
    const parts = lastOrder.orderNumber.split("-");
    const lastSeq = parseInt(parts[2] ?? "0", 10);
    sequence = lastSeq + 1;
  }

  return `${prefix}-${String(sequence).padStart(4, "0")}`;
}
