const DEFAULT_SITE_ORIGIN = "https://lazyfolio.in";

function getSiteUrl(siteUrl?: string) {
  return (siteUrl || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN).replace(/\/+$/, "");
}

function normalizeUsername(username?: string | null) {
  return (username || "").trim().toLowerCase();
}

function getBaseUrl(siteUrl?: string) {
  try {
    return new URL(getSiteUrl(siteUrl));
  } catch {
    return new URL(DEFAULT_SITE_ORIGIN);
  }
}

export function getPortfolioDomainSuffix(siteUrl?: string) {
  const baseUrl = getBaseUrl(siteUrl);
  const hostname = baseUrl.hostname.replace(/^www\./, "");
  const port = baseUrl.port ? `:${baseUrl.port}` : "";
  return `${hostname}${port}`;
}

export function getPortfolioOrigin(username?: string | null, siteUrl?: string) {
  const normalizedUsername = normalizeUsername(username);
  const baseUrl = getBaseUrl(siteUrl);
  const hostname = baseUrl.hostname.replace(/^www\./, "");
  const port = baseUrl.port ? `:${baseUrl.port}` : "";

  if (!normalizedUsername) {
    return `${baseUrl.protocol}//${hostname}${port}`;
  }

  return `${baseUrl.protocol}//${normalizedUsername}.${hostname}${port}`;
}

export function getPortfolioUrl(
  username?: string | null,
  path = "/",
  siteUrl?: string,
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const suffix = normalizedPath === "/" ? "" : normalizedPath;
  return `${getPortfolioOrigin(username, siteUrl)}${suffix}`;
}

export function getPortfolioBlogPath(slug?: string | null) {
  const normalizedSlug = (slug || "").trim().replace(/^\/+/, "");
  return normalizedSlug ? `/blogs/${normalizedSlug}` : null;
}
