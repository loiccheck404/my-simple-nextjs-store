// middleware.ts - Place this in your project root

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//import { jwtVerify } from "jose";

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile", "/orders", "/admin"];

// Define auth routes (redirect to dashboard if already logged in)
const authRoutes = ["/login", "/register", "/account"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from either Authorization header or cookie
  const authHeader = request.headers.get("authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const tokenFromCookie = request.cookies.get("auth_token")?.value;
  const token = tokenFromHeader || tokenFromCookie;

  // Verify token if present
  let isAuthenticated = false;
  let user = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      isAuthenticated = true;
      user = payload;
    } catch (error) {
      // Token is invalid
      console.error("Invalid token:", error);
    }
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL("/account", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle auth routes (redirect if already logged in)
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // Redirect to dashboard or return URL
      const returnUrl = request.nextUrl.searchParams.get("returnUrl");
      const redirectUrl =
        returnUrl && returnUrl.startsWith("/")
          ? new URL(returnUrl, request.url)
          : new URL("/dashboard", request.url);

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Add user info to headers for API routes
  if (isAuthenticated && user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.userId as string);
    requestHeaders.set("x-user-email", user.email as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
// omo i be naija oh
