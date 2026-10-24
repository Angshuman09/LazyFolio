export type EventType = "pageview" | "click";

export const VALID_EVENT_TYPES: readonly EventType[] = ["pageview", "click"] as const;

export function isValidEventType(type: unknown): type is EventType {
  return typeof type === "string" && (VALID_EVENT_TYPES as readonly string[]).includes(type);
}

export interface TrackPayload {
  profileId: string;
  eventType: EventType;
  label?: string | null;
}

export interface TinybirdEvent {
  timestamp: string;
  profile_id: string;
  event_type: EventType;
  label: string | null;
  country: string | null;
  device: string;
  visitor_hash?: string;
}

// Re-export insight types for backwards compatibility
export type { RangeKey, InsightData } from "./insight.model";
