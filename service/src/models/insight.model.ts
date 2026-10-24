export type RangeKey = "7d" | "30d" | "90d";

export const VALID_RANGES: readonly RangeKey[] = ["7d", "30d", "90d"] as const;

export function isValidRange(range: string | undefined): range is RangeKey {
  return typeof range === "string" && (VALID_RANGES as readonly string[]).includes(range);
}

export interface ClickMetric {
  label: string;
  count: number;
}

export interface CountryMetric {
  country: string;
  count: number;
}

export interface DeviceMetric {
  device: string;
  count: number;
}

export interface SeriesPoint {
  date: string;
  views: number;
}

export interface InsightData {
  pageviews: number;
  uniqueVisitors: number;
  clicks: ClickMetric[];
  countries: CountryMetric[];
  devices: DeviceMetric[];
  series: SeriesPoint[];
}
