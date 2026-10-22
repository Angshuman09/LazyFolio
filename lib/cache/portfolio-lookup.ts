/**
 * Portfolio ownership lookup for subdomain routing in `proxy.ts`.
 *
 * A request to `<username>.host` (or a root-domain path whose first segment
 * looks like a username) must know whether that username actually owns a
 * portfolio before we rewrite or redirect it. This module answers that with a
 * small in-memory cache so repeat requests do not hit PostgreSQL.
 *
 * Returns `null` when the database cannot be reached, so callers can fall back
 * to the previous permissive behaviour instead of 404-ing the whole site.
 */

import { prisma } from "@/lib/prisma";

// Positive lookups are cached longer; misses are kept short so a freshly
// created portfolio becomes reachable quickly.
const FOUND_TTL_MS = 5 * 60 * 1000;
const MISS_TTL_MS = 15 * 1000;
const MAX_CACHE_ENTRIES = 1_000;

export type PortfolioLookup = boolean | null;

type CacheEntry = { exists: boolean; expiresAt: number };

const globalStore = globalThis as unknown as {
  __lf_portfolio_lookup__?: Map<string, CacheEntry>;
  __lf_portfolio_lookup_inflight__?: Map<string, Promise<PortfolioLookup>>;
};

const cache =
  globalStore.__lf_portfolio_lookup__ ??
  (globalStore.__lf_portfolio_lookup__ = new Map());
const inFlight =
  globalStore.__lf_portfolio_lookup_inflight__ ??
  (globalStore.__lf_portfolio_lookup_inflight__ = new Map());

function remember(username: string, exists: boolean) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    // Map preserves insertion order, so the first key is the oldest.
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(username, {
    exists,
    expiresAt: Date.now() + (exists ? FOUND_TTL_MS : MISS_TTL_MS),
  });
}

export async function portfolioExists(username: string): Promise<PortfolioLookup> {
  const key = username.trim().toLowerCase();
  if (!key) return false;

  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.exists;
  }
  if (cached) cache.delete(key);

  // Collapse concurrent lookups for the same username (RSC + prefetch).
  const pending = inFlight.get(key);
  if (pending) return pending;

  const lookup = (async () => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { username: key },
        select: { id: true },
      });
      const exists = Boolean(profile);
      remember(key, exists);
      return exists;
    } catch (error) {
      console.error(`[proxy] Could not resolve portfolio "${key}"`, error);
      return null;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, lookup);
  return lookup;
}

export function invalidatePortfolioLookup(username?: string | null) {
  if (!username) return;
  cache.delete(username.trim().toLowerCase());
}
