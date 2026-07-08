// hooks/insights.ts
import { useQuery } from "@tanstack/react-query";

export type RangeKey = "7d" | "30d" | "90d";

export interface InsightData {
  pageviews: number;
  uniqueVisitors: number;
  clicks: { label: string; count: number }[];
  countries: { country: string; count: number }[];
  devices: { device: string; count: number }[];
  series: { date: string; views: number }[];
}

async function fetchInsights(profileId: string, range: RangeKey): Promise<InsightData> {
  const res = await fetch(`/api/dashboard/insights?profileId=${profileId}&range=${range}`);
  if (!res.ok) throw new Error("Failed to load insights");
  return res.json();
}

export function useGetInsights(profileId: string | undefined, range: RangeKey) {
  return useQuery({
    queryKey: ["insights", profileId, range],
    queryFn: () => fetchInsights(profileId as string, range),
    enabled: Boolean(profileId),
    staleTime: 60_000,
  });
}