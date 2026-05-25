import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/pemetaan-diri",
  "/coaching",
  "/portfolio",
  "/admin",
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/", "/register"];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If the user is NOT authenticated and tries to access a protected route,
  // redirect them to the login page (now root /).
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    // Preserve the original URL so we can redirect back after login
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // If the user IS authenticated and tries to access an auth route,
  // redirect them to the dashboard.
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets (images, svgs, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
