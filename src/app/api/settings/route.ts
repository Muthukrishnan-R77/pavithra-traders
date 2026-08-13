import { apiSuccess, handleApiError } from "@/lib/api-response";
import { getSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSettings();
    return apiSuccess(settings);
  } catch (err) {
    return handleApiError(err, "Unable to load settings.");
  }
}
