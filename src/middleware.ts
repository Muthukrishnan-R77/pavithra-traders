import { auth } from "@/lib/auth";
import { getAppMode } from "@/lib/app-mode";
import { NextResponse } from "next/server";

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isAdminApiPath(pathname: string) {
  return pathname.startsWith("/api/admin");
}

function isAuthApiPath(pathname: string) {
  return pathname.startsWith("/api/auth");
}

function isPublicApiPath(pathname: string) {
  return (
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/orders") ||
    pathname.startsWith("/api/settings")
  );
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/logo.png" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const appMode = getAppMode();

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

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
      // Continue to admin auth checks below.
    } else if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    } else {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/admin/login")) {
    if (req.auth?.user?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!req.auth || req.auth.user?.role !== "ADMIN") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

const appMode = process.env.APP_MODE ?? "full";

export const config = {
  matcher:
    appMode === "customer" || appMode === "admin"
      ? ["/((?!_next/static|_next/image|favicon.ico|robots.txt|logo.png|images/).*)"]
      : ["/admin", "/admin/:path*"],
};
