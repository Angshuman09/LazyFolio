import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  USERNAME_PATTERN,
} from "@/lib/utils/username";
import { portfolioExists } from "@/lib/cache/portfolio-lookup";

const RESERVED_PATHS = new Set([
  "api",
  "auth",
  "dashboard",
  "privacy",
  "stats",
  "templates",
  "terms",
]);

// Page routes that should always live on the root domain. `/stats` is
// intentionally excluded: it is the Umami analytics proxy (script + /api/send),
// so portfolio subdomains must keep serving it locally instead of redirecting.
const RESERVED_PAGE_PATHS = new Set([
  "auth",
  "dashboard",
  "privacy",
  "templates",
  "terms",
]);

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "stats",
  "auth",
  "dashboard",
  "privacy",
  "terms",
  "templates",
]);
const PRODUCTION_ROOT_HOSTNAME = "lazyfolio.in";

// Matches no route in the app, so Next renders `app/not-found.tsx` with a real
// 404 status. A single-segment path would be swallowed by `[username]`.
const NOT_FOUND_PATH = "/_lf/404";

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

function renderNotFound(request: NextRequest) {
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
}

/**
 * Sends a request back to the root domain (or, in the dev environment, renders
 * the root page in place).
 *
 * Next 16 canonicalises `request.url`/`request.nextUrl` to the host the server
 * was started on (`localhost:3000` when using `*.localhost`). A redirect whose
 * target has that same origin gets serialised as a relative `Location`, which
 * loops forever on a custom host. Rewriting avoids the loop while keeping the
 * production behaviour (real cross-origin redirect) intact.
 */
function redirectToRoot(request: NextRequest, pathname: string, rootOrigin: string) {
  const target = new URL(pathname, rootOrigin);
  const requestHostname = getRequestHostname(request);
  const isRootHost = requestHostname === new URL(rootOrigin).hostname;

  // On a subdomain, `request.nextUrl` is canonicalised to the root host in the
  // dev server. A redirect whose target shares that canonical origin is emitted
  // as a relative `Location` and loops forever, so render the page in place.
  if (!isRootHost && target.origin === request.nextUrl.origin) {
    return NextResponse.rewrite(target);
  }

  return NextResponse.redirect(target);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getRequestHostname(request);
  const rootHostname = getRootHostname(hostname);
  const rootOrigin = getRootOrigin(request, rootHostname);
  const subdomain = getSubdomain(hostname, rootHostname);
  const firstSegment = getFirstPathSegment(pathname);

  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard");

  // Redirect legacy /pricing visits to home
  if (pathname === "/pricing" || pathname.startsWith("/pricing/") || subdomain === "pricing") {
    return redirectToRoot(request, "/", rootOrigin);
  }

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
      return redirectToRoot(request, "/auth", rootOrigin);
    }
  }

  // If the subdomain itself is a reserved page path (e.g. terms.localhost:3000 -> localhost:3000/terms)
  if (subdomain && RESERVED_PAGE_PATHS.has(subdomain)) {
    let targetPath = `/${subdomain}`;
    const cleanSegments = pathname.split("/").filter(Boolean);
    const nonSubdomainSegments = cleanSegments.filter((seg) => seg !== subdomain);
    if (nonSubdomainSegments.length > 0) {
      targetPath = `/${subdomain}/${nonSubdomainSegments.join("/")}`;
    }
    return redirectToRoot(request, targetPath, rootOrigin);
  }

  // If the subdomain is 'www', redirect to root
  if (subdomain === "www") {
    return redirectToRoot(request, pathname, rootOrigin);
  }

  const isProductionRoot = hostname === PRODUCTION_ROOT_HOSTNAME || hostname === `www.${PRODUCTION_ROOT_HOSTNAME}`;
  const isEnvRoot = hostname === rootHostname || hostname === `www.${rootHostname}`;
  const isRootDomain = isEnvRoot || isProductionRoot;

  const portfolioUsername =
    subdomain && !RESERVED_SUBDOMAINS.has(subdomain) && USERNAME_PATTERN.test(subdomain)
      ? subdomain
      : null;

  // Only real portfolios get subdomain routing. Anything else is a plain 404.
  if (portfolioUsername) {
    const exists = await portfolioExists(portfolioUsername);

    if (exists === false) {
      return renderNotFound(request);
    }

    // If the lookup failed (`null`) we keep the permissive behaviour and let
    // the portfolio page render its own not-found state.

    // On a portfolio subdomain, app pages belong to the root domain.
    if (RESERVED_PAGE_PATHS.has(firstSegment)) {
      return redirectToRoot(request, pathname, rootOrigin);
    }

    // API routes and the /stats analytics proxy are served as-is.
    if (isReservedPath(pathname)) {
      return NextResponse.next();
    }

    const rewriteUrl = request.nextUrl.clone();
    if (pathname === `/${portfolioUsername}` || pathname.startsWith(`/${portfolioUsername}/`)) {
      return NextResponse.rewrite(rewriteUrl);
    }
    rewriteUrl.pathname = `/${portfolioUsername}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // A non-reserved subdomain that can never be a portfolio (invalid label).
  if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain) && !USERNAME_PATTERN.test(subdomain)) {
    return renderNotFound(request);
  }

  // Root domain: /username -> username.domain, but only for existing portfolios.
  if (
    isRootDomain &&
    firstSegment &&
    !RESERVED_PATHS.has(firstSegment) &&
    USERNAME_PATTERN.test(firstSegment)
  ) {
    const exists = await portfolioExists(firstSegment);

    if (exists === false) {
      return renderNotFound(request);
    }

    const nextPath = pathname.replace(`/${firstSegment}`, "") || "/";
    const redirectRootHostname = isProductionRoot ? PRODUCTION_ROOT_HOSTNAME : rootHostname;
    return NextResponse.redirect(buildSubdomainUrl(request, firstSegment, nextPath, redirectRootHostname));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
