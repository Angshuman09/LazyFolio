import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESERVED_PATHS = new Set([
  "api",
  "auth",
  "dashboard",
  "privacy",
  "stats",
  "templates",
  "terms",
]);

const RESERVED_SUBDOMAINS = new Set(["www", "api", "app", "admin", "stats"]);
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
const PRODUCTION_ROOT_HOSTNAME = "lazyfolio.in";

function getRootHostname() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lazyfolio.in";
    return new URL(siteUrl).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "lazyfolio.in";
  }
}

function getRequestHostname(request: NextRequest) {
  const host = request.headers.get("host") || request.headers.get("x-forwarded-host") || "";
  return host.split(":")[0]?.toLowerCase() || "";
}

function getSubdomain(hostname: string, rootHostname: string) {
  if (hostname === rootHostname || hostname === `www.${rootHostname}`) return null;
  if (hostname.endsWith(`.${rootHostname}`)) {
    return hostname.slice(0, -(rootHostname.length + 1));
  }
  if (hostname.endsWith(`.${PRODUCTION_ROOT_HOSTNAME}`)) {
    return hostname.slice(0, -(PRODUCTION_ROOT_HOSTNAME.length + 1));
  }
  if (hostname.endsWith(".localhost")) {
    return hostname.slice(0, -".localhost".length);
  }
  return null;
}

function getFirstPathSegment(pathname: string) {
  return pathname.split("/").filter(Boolean)[0] || "";
}

function isReservedPath(pathname: string) {
  const firstSegment = getFirstPathSegment(pathname);
  return Boolean(firstSegment && RESERVED_PATHS.has(firstSegment));
}

function buildSubdomainUrl(request: NextRequest, username: string, pathname: string, rootHostname: string) {
  const url = request.nextUrl.clone();
  url.hostname = `${username}.${rootHostname}`;
  url.pathname = pathname || "/";
  return url;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getRequestHostname(request);
  const rootHostname = getRootHostname();
  const subdomain = getSubdomain(hostname, rootHostname);

  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard");

  if (isDashboardRoute) {
    const sessionRes = await fetch(new URL("/api/auth/get-session", request.url), {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    const session = await sessionRes.json().catch(() => null);

    if (!session || !session.user) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain) && !isReservedPath(pathname)) {
    const rewriteUrl = request.nextUrl.clone();
    if (pathname === `/${subdomain}` || pathname.startsWith(`/${subdomain}/`)) {
      return NextResponse.rewrite(rewriteUrl);
    }
    rewriteUrl.pathname = `/${subdomain}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  const firstSegment = getFirstPathSegment(pathname);
  const isProductionRoot = hostname === PRODUCTION_ROOT_HOSTNAME || hostname === `www.${PRODUCTION_ROOT_HOSTNAME}`;
  const isEnvRoot = hostname === rootHostname || hostname === `www.${rootHostname}`;
  const isRootDomain = isEnvRoot || isProductionRoot;
  if (
    isRootDomain &&
    firstSegment &&
    !RESERVED_PATHS.has(firstSegment) &&
    USERNAME_PATTERN.test(firstSegment)
  ) {
    const nextPath = pathname.replace(`/${firstSegment}`, "") || "/";
    const redirectRootHostname = isProductionRoot ? PRODUCTION_ROOT_HOSTNAME : rootHostname;
    return NextResponse.redirect(buildSubdomainUrl(request, firstSegment, nextPath, redirectRootHostname));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
