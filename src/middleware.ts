import { auth } from "@/lib/auth";
import { getAppMode } from "@/lib/app-mode";
import { NextRequest, NextResponse } from "next/server";

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isAdminApiPath(pathname: string) {
  return pathname.startsWith("/api/admin");
}

function isAuthApiPath(pathname: string) {
  return pathname.startsWith("/api/auth");
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/logo.png" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

// NextAuth wrapper for admin-only paths
const authMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const appMode = getAppMode();

  if (appMode === "customer") {
    if (isAdminPath(pathname)) {
      const adminUrl = process.env.ADMIN_URL;
      if (adminUrl) {
        return NextResponse.redirect(adminUrl);
      }
      return NextResponse.json({ error: "Admin panel is hosted separately." }, { status: 404 });
    }
    return NextResponse.next();
  }

  if (appMode === "admin") {
    if (isAdminPath(pathname) || isAdminApiPath(pathname) || isAuthApiPath(pathname)) {
      // Continue to admin auth checks below
    } else if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    } else {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (!isAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    if (req.auth?.user?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!req.auth || req.auth.user?.role !== "ADMIN") {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Instant pass-through for static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const appMode = getAppMode();

  // 2. Instant pass-through for all customer public routes (Zero NextAuth overhead)
  if (!isAdminPath(pathname) && !isAdminApiPath(pathname) && !isAuthApiPath(pathname)) {
    if (appMode === "admin") {
      // In standalone admin mode, non-admin routes redirect to /admin/login
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // 3. Admin routes require NextAuth processing
  // @ts-expect-error NextAuth auth middleware signature
  return authMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo.png|images/).*)"],
};
