/**
 * Portfolio ownership lookup for subdomain routing in `proxy.ts`.
 *
 * A request to `<username>.host` (or a root-domain path whose first segment
 * looks like a username) must know whether that username actually owns a
 * portfolio before we rewrite or redirect it. This module answers that with a
 * small in-memory cache so repeat requests do not hit PostgreSQL, backed by
 * the username bloom filter (username-filter.ts): a freshly-seeded filter
 * answers "definitely does not exist" with zero DB traffic, which makes
 * scanner/typo subdomain traffic free.
 *
 * Returns `null` when the database cannot be reached, so callers can fall back
 * to the previous permissive behaviour instead of 404-ing the whole site.
 */

import { prisma } from "@/lib/prisma";
import {
  isUsernameFilterSeedFresh,
  markUsernameFilterSeeded,
  registerUsernameInFilter,
  usernameDefinitelyAbsent,
} from "./username-filter";

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
  // Keep the bloom filter in sync with DB-confirmed positives so usernames
  // resolved before seeding finished (or after a rename) are never absent.
  if (exists) registerUsernameInFilter(username);
  cache.set(username, {
    exists,
    expiresAt: Date.now() + (exists ? FOUND_TTL_MS : MISS_TTL_MS),
  });
}

// Bloom-filter seeding. Negative checks are only trusted once every existing
// username is in the filter AND that seed is recent (see NEGATIVE_TRUST_MS in
// username-filter.ts), so this runs a background refresh whenever the seed
// goes stale. The triggering request pays only its own DB lookup — the seed
// is never awaited.
const MAX_SEED_USERNAMES = 250_000;
let seedInFlight: Promise<void> | null = null;
let seedDisabled = false;

function ensureUsernameFilterSeeded() {
  if (seedDisabled || seedInFlight) return;
  if (isUsernameFilterSeedFresh()) return;
  seedInFlight = (async () => {
    try {
      const rows = await prisma.profile.findMany({
        where: { username: { not: null } },
        select: { username: true },
      });
      if (rows.length > MAX_SEED_USERNAMES) {
        // Too large to seed cheaply on every cold start; disable the filter
        // so negatives are never trusted (today's Map/DB behaviour).
        console.warn(
          `[proxy] Bloom seed disabled: ${rows.length} usernames exceeds cap of ${MAX_SEED_USERNAMES}`,
        );
        seedDisabled = true;
        return;
      }
      // Bloom bits are add-only: refreshes re-add current usernames, while
      // deleted/renamed ones linger as harmless false positives that fall
      // through to the DB. Freshness is tracked via markUsernameFilterSeeded.
      for (const row of rows) registerUsernameInFilter(row.username!);
      markUsernameFilterSeeded();
    } catch (error) {
      console.error("[proxy] Could not seed username bloom filter", error);
      // Timestamp stays stale/absent, so negatives fail open and a later
      // request retries (partial adds are idempotent).
    } finally {
      seedInFlight = null;
    }
  })();
}

export async function portfolioExists(username: string): Promise<PortfolioLookup> {
  const key = username.trim().toLowerCase();
  if (!key) return false;

  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.exists;
  }
  if (cached) cache.delete(key);

  // Start (once) the background seed that lets the bloom filter answer
  // "definitely does not exist" without touching PostgreSQL.
  ensureUsernameFilterSeeded();

  // Bloom miss with a fully seeded filter: the profile cannot exist. Skipped
  // before the Map write on purpose — scanner/typo traffic would otherwise
  // flood the bounded 1,000-entry Map and evict real cached positives.
  if (usernameDefinitelyAbsent(key)) {
    return false;
  }

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
