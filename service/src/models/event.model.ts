export type EventType = "pageview" | "click";

export interface TrackPayload{
    profileId: string,
    eventType: EventType,
    label?: string | null
}

export interface TinybirdEvent{
    timestamp: string,
    profile_id: string,
    event_type: EventType,
    label: string | null,
    country: string | null,
    device: string,
    visitor_hash?: string
}

export type RangeKey = "7d" | "30d" | "90d";

export interface InsightData{
    pageviews: number;
    uniqueVisitors: number;
    clicks: {label: string, count: number}[];
    countries: { country: string; count: number }[];
  devices: { device: string; count: number }[];
  series: { date: string; views: number }[];
}
