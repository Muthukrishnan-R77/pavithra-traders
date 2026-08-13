import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { getSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const settings = await getSettings();
    return apiSuccess(settings);
  } catch (err) {
    return handleApiError(err, "Unable to load settings.");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid settings.", 400);
    }

    const existing = await prisma.settings.findFirst();
    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: parsed.data,
      });
    } else {
      await prisma.settings.create({ data: parsed.data });
    }

    return apiSuccess(await getSettings());
  } catch (err) {
    return handleApiError(err, "Unable to update settings.");
  }
}
