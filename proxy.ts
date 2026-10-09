import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESERVED_PATHS = new Set([
  "api",
  "auth",
  "dashboard",
  "pricing",
  "privacy",
  "stats",
  "templates",
  "terms",
]);

const RESERVED_PAGE_PATHS = new Set([
  "auth",
  "dashboard",
  "pricing",
  "privacy",
  "stats",
  "templates",
  "terms",
]);

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "stats",
  "pricing",
  "auth",
  "dashboard",
  "privacy",
  "terms",
  "templates",
]);
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
const PRODUCTION_ROOT_HOSTNAME = "lazyfolio.in";

function getRootHostname(hostname: string) {
  if (hostname.endsWith(".localhost") || hostname === "localhost") {
    return "localhost";
  }
  if (hostname.endsWith(`.${PRODUCTION_ROOT_HOSTNAME}`) || hostname === PRODUCTION_ROOT_HOSTNAME) {
    return PRODUCTION_ROOT_HOSTNAME;
  }
  try {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
    if (siteUrl) {
      return new URL(siteUrl).hostname.replace(/^www\./, "").toLowerCase();
    }
  } catch {}
  return PRODUCTION_ROOT_HOSTNAME;
}

function getRootOrigin(request: NextRequest, rootHostname: string) {
  const host = request.headers.get("host") || request.headers.get("x-forwarded-host") || "";
  const port = host.split(":")[1] ? `:${host.split(":")[1]}` : "";
  const isHttps = request.url.startsWith("https") || request.headers.get("x-forwarded-proto") === "https";
  const protocol = rootHostname === "localhost" ? "http:" : isHttps ? "https:" : "http:";
  return `${protocol}//${rootHostname}${rootHostname === "localhost" ? port : ""}`;
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
  const rootHostname = getRootHostname(hostname);
  const rootOrigin = getRootOrigin(request, rootHostname);
  const subdomain = getSubdomain(hostname, rootHostname);
  const firstSegment = getFirstPathSegment(pathname);

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
      return NextResponse.redirect(new URL("/auth", rootOrigin));
    }
  }

  // If the subdomain itself is a reserved page path (e.g. pricing.localhost:3000 -> localhost:3000/pricing)
  if (subdomain && RESERVED_PAGE_PATHS.has(subdomain)) {
    let targetPath = `/${subdomain}`;
    const cleanSegments = pathname.split("/").filter(Boolean);
    const nonSubdomainSegments = cleanSegments.filter((seg) => seg !== subdomain);
    if (nonSubdomainSegments.length > 0) {
      targetPath = `/${subdomain}/${nonSubdomainSegments.join("/")}`;
    }
    const redirectUrl = new URL(targetPath, rootOrigin);
    return NextResponse.redirect(redirectUrl);
  }

  // If the subdomain is 'www', redirect to root
  if (subdomain === "www") {
    const redirectUrl = new URL(pathname, rootOrigin);
    return NextResponse.redirect(redirectUrl);
  }

  // If on a portfolio subdomain and requesting a reserved app page (e.g. angshu.localhost:3000/pricing -> localhost:3000/pricing)
  if (subdomain && RESERVED_PAGE_PATHS.has(firstSegment)) {
    const redirectUrl = new URL(pathname, rootOrigin);
    return NextResponse.redirect(redirectUrl);
  }

  if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain) && !isReservedPath(pathname)) {
    const rewriteUrl = request.nextUrl.clone();
    if (pathname === `/${subdomain}` || pathname.startsWith(`/${subdomain}/`)) {
      return NextResponse.rewrite(rewriteUrl);
    }
    rewriteUrl.pathname = `/${subdomain}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

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
