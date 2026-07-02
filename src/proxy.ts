import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { UserRole } from "./types/auth";

const authRoutes = ["/", "/register", "/login"];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const userRole = user?.user_metadata?.role as UserRole | undefined;

  if (isAuthRoute) {
    if (user) {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return response;
  }

  // Paths that do not require authentication
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static")
  ) {
    return response;
  }

  // If no user, redirect to login for all protected routes
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Protect Admin routes
  if (pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect Coach routes
  if (
    pathname === "/coach" ||
    pathname.startsWith("/coach/") ||
    pathname.startsWith("/coaching/create")
  ) {
    if (userRole !== "coach" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect Karyawan routes
  if (pathname.startsWith("/karyawan")) {
    if (userRole !== "karyawan") {
      return NextResponse.redirect(new URL("/", request.url));
    }
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
