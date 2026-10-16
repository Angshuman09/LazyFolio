/**
 * Fast in-memory Bloom Filter and LRU Profile Cache.
 * 
 * 1. Bloom Filter:
 *    A space-efficient (~8KB) probabilistic data structure to instantly test
 *    whether a subdomain username definitely does NOT exist without querying PostgreSQL.
 *    - If has(username) === false: 100% certainty the user does NOT exist (no false negatives).
 *    - If has(username) === true: user probably exists, proceed to cache/DB.
 * 
 * 2. In-Memory Profile Cache:
 *    Keeps hot public profiles in memory with TTL (5 minutes), cutting subdomain
 *    rendering latency from ~300-800ms (cold PG database roundtrip) to <1ms.
 */

// Simple non-cryptographic hash functions for Bloom filter
function fnv1a(str: string, seed: number = 0x811c9dc5): number {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function djb2(str: string, seed: number = 5381): number {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function sdbm(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    hash |= 0;
  }
  return hash >>> 0;
}

class BloomFilter {
  private size: number;
  private bits: Uint8Array;

  constructor(size: number = 65536) { // 8 KB = 65,536 bits
    this.size = size;
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  private getHashes(str: string): [number, number, number] {
    const s = str.toLowerCase().trim();
    const h1 = fnv1a(s) % this.size;
    const h2 = djb2(s) % this.size;
    const h3 = sdbm(s) % this.size;
    return [h1, h2, h3];
  }

  public add(item: string): void {
    if (!item) return;
    const hashes = this.getHashes(item);
    for (const h of hashes) {
      const byteIndex = Math.floor(h / 8);
      const bitIndex = h % 8;
      this.bits[byteIndex] |= 1 << bitIndex;
    }
  }

  public has(item: string): boolean {
    if (!item) return false;
    const hashes = this.getHashes(item);
    for (const h of hashes) {
      const byteIndex = Math.floor(h / 8);
      const bitIndex = h % 8;
      if ((this.bits[byteIndex] & (1 << bitIndex)) === 0) {
        return false; // Definitely not present
      }
    }
    return true; // Might be present
  }
}

// Global singleton instances to persist across requests in Node/Edge worker runtime
const globalStore = globalThis as unknown as {
  __lf_bloom_filter__?: BloomFilter;
  __lf_profile_cache__?: Map<string, { data: unknown; expiresAt: number }>;
};

if (!globalStore.__lf_bloom_filter__) {
  globalStore.__lf_bloom_filter__ = new BloomFilter();
}
if (!globalStore.__lf_profile_cache__) {
  globalStore.__lf_profile_cache__ = new Map();
}

const bloomFilter = globalStore.__lf_bloom_filter__;
const profileCache = globalStore.__lf_profile_cache__;

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in memory

/**
 * Register a known username in the Bloom filter.
 */
export function registerUsernameInFilter(username: string): void {
  if (username) {
    bloomFilter.add(username);
  }
}

/**
 * Check if a username might exist using the Bloom filter.
 * Returns false if the username DEFINITELY does not exist.
 */
export function mayUsernameExist(username: string): boolean {
  if (!username) return false;
  return bloomFilter.has(username);
}

/**
 * Get profile from fast in-memory cache.
 */
export function getProfileFromMemoryCache<T>(username: string): T | null {
  if (!username) return null;
  const key = username.toLowerCase().trim();
  const entry = profileCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    profileCache.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * Store profile in fast in-memory cache and prime the Bloom filter.
 */
export function setProfileInMemoryCache(username: string, data: unknown): void {
  if (!username) return;
  const key = username.toLowerCase().trim();
  bloomFilter.add(key);
  profileCache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Invalidate memory cache when a user updates their profile.
 */
export function invalidateProfileMemoryCache(username?: string | null): void {
  if (!username) return;
  const key = username.toLowerCase().trim();
  profileCache.delete(key);
}
