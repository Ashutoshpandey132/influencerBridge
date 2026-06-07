import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

// Routes that don't need authentication
const PUBLIC_PATHS = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/influencers",   // read-only discovery is public
  "/api/campaigns",     // browse campaigns is public
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // Protect /api/* routes
  if (pathname.startsWith("/api/")) {
    let token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      token = req.cookies.get("token")?.value;
    }
    
    if (!token) {
      console.log(`[API PROXY] Blocked request to ${pathname} - No token found`);
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch (err: any) {
      console.error(`[API PROXY] Token verification failed for ${pathname}:`, err?.message || err);
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
  }

  // Protect dashboard pages
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log(`[PAGE PROXY] Redirecting to /login from ${pathname} - No token found`);
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch (err: any) {
      console.error(`[PAGE PROXY] Token verification failed for ${pathname}:`, err?.message || err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
