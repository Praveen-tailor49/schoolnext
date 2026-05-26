import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const path = request.nextUrl.pathname;

  // Define public authentication routes
  const isAuthPage =
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  const isPublicPage = path === "/" || isAuthPage;

  // If the user is logged in and tries to access an auth page (like /login),
  // instantly redirect them to the dashboard.
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is NOT logged in and tries to access a protected route,
  // instantly redirect them to the login page.
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
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
