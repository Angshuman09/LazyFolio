export interface Env {
  TINYBIRD_BASE_URL?: string;
  TINYBIRD_API_TOKEN?: string;
  SERVICE_SHARED_SECRET?: string;
  VISITOR_HASH_SALT?: string;
}

export const DEFAULT_CONFIG = {
  TINYBIRD_BASE_URL: "https://api.tinybird.co",
  VISITOR_HASH_SALT: "default-salt",
  INSIGHTS_CACHE_SECONDS: 120,
} as const;
