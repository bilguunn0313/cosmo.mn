import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ACCESS_TOKEN_COOKIE } from "./lib/auth-cookie";

const LOGIN_PATH = "/admin/login";

const handleLocaleRouting = createMiddleware(routing);

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function protectAdmin(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;
  const hasToken = request.cookies.has(ACCESS_TOKEN_COOKIE);

  if (isLoginPage || hasToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  if (isAdminPath(request.nextUrl.pathname)) {
    return protectAdmin(request);
  }

  return handleLocaleRouting(request);
}

export const config = {
  matcher: ["/((?!api|uploads|_next|_vercel|.*\\..*).*)"],
};
