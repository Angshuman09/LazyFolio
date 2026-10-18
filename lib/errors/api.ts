import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown, context: string): NextResponse {
  if (error instanceof ApiError) {
    return apiError(error.message, error.status);
  }
  console.error(`[${context}]`, error);
  return apiError("Something went wrong.", 500);
}