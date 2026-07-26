import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { AuthUser } from "@/types";

/**
 * Middleware helper to extract and verify the JWT from the Authorization header.
 * Returns the decoded user payload or a 401 response.
 */
export async function withAuth(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const authHeader = req.headers.get("authorization");
  let token = "";

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    // Fallback to checking the token cookie set by our frontend
    const cookieToken = req.cookies.get("token")?.value;
    if (cookieToken) token = cookieToken;
  }

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized – no token provided" },
      { status: 401 }
    );
  }

  try {
    const user = await verifyToken(token);
    return { user };
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized – invalid or expired token" },
      { status: 401 }
    );
  }
}

/**
 * Role guard – returns 403 if the authenticated user's role is not in the allowed list.
 */
export function requireRole(user: AuthUser, ...roles: AuthUser["role"][]): NextResponse | null {
  if (!roles.includes(user.role)) {
    return NextResponse.json(
      { success: false, error: "Forbidden – insufficient permissions" },
      { status: 403 }
    );
  }
  return null;
}
