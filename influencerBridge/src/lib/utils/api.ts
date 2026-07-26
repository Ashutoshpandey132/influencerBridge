import { ApiResponse } from "@/types";
import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200): NextResponse {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function errorResponse(message: string, status = 500): NextResponse {
  const body: ApiResponse = { success: false, error: message };
  return NextResponse.json(body, { status });
}

export function paginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
