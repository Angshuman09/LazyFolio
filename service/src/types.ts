export interface Env{
    TINYBIRD_BASE_URL: string;
    TINYBIRD_API_TOKEN: string;
    SERVICE_SHARED_SECRET: string;
    VISITOR_HASH_SALT: string;
}

export type EventType = "pageview" | "click";

export interface TrackPayload{
    profileId: string,
    eventType: EventType,
    label?: string | null
}
