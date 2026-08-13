import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function handleApiError(err: unknown, fallback = "Something went wrong. Please try again.") {
  console.error(err);
  return apiError(fallback, 500);
}
