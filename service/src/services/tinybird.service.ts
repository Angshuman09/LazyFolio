import { Env } from "../types/env";
import { TinybirdEvent, RangeKey, InsightData } from "../models/event.model";

export class TinybirdService {
  static async sendEvent(event: TinybirdEvent, env: Env): Promise<boolean> {
    try {
      const baseUrl = env.TINYBIRD_BASE_URL || "https://api.tinybird.co";
      const res = await fetch(`${baseUrl}/v0/events?name=events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.TINYBIRD_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!res.ok) {
        console.error("Tinybird ingestion error:", res.status, await res.text());
        return false;
      }
      return true;
    } catch (err) {
      console.error("Tinybird network error:", err);
      return false;
    }
  }

  static async getInsights(profileId: string, range: RangeKey, env: Env): Promise<InsightData> {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

    const startDate = start.toISOString().replace("T", " ").substring(0, 19);
    const endDate = end.toISOString().replace("T", " ").substring(0, 19);
    const baseUrl = env.TINYBIRD_BASE_URL || "https://api.tinybird.co";

    const summaryUrl = `${baseUrl}/v0/pipes/get_insight_summary.json?profile_id=${profileId}&start_date=${startDate}&end_date=${endDate}`;
    const seriesUrl = `${baseUrl}/v0/pipes/get_pageview_series.json?profile_id=${profileId}&start_date=${startDate}&end_date=${endDate}`;

    const headers = { Authorization: `Bearer ${env.TINYBIRD_API_TOKEN}` };

    const [summaryRes, seriesRes] = await Promise.all([
      fetch(summaryUrl, { headers }),
      fetch(seriesUrl, { headers }),
    ]);

    let pageviews = 0;
    let uniqueVisitors = 0;
    let clicks: { label: string; count: number }[] = [];
    let countries: { country: string; count: number }[] = [];
    let devices: { device: string; count: number }[] = [];

    if (summaryRes.ok) {
      const summaryJson = (await summaryRes.json()) as any;
      const row = summaryJson.data?.[0];
      if (row) {
        pageviews = Number(row.pageviews || 0);
        uniqueVisitors = Number(row.unique_visitors || 0);
        clicks = (row.clicks || []).map((c: [string, number]) => ({ label: c[0], count: Number(c[1]) }));
        countries = (row.countries || []).map((c: [string, number]) => ({ country: c[0], count: Number(c[1]) }));
        devices = (row.devices || []).map((d: [string, number]) => ({ device: d[0], count: Number(d[1]) }));
      }
    }

    const seriesMap = new Map<string, number>();
    if (seriesRes.ok) {
      const seriesJson = (await seriesRes.json()) as any;
      for (const item of seriesJson.data || []) {
        seriesMap.set(item.date, Number(item.views || 0));
      }
    }

    // Fill missing date buckets
    const series: { date: string; views: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      series.push({ date: key, views: seriesMap.get(key) || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return { pageviews, uniqueVisitors, clicks, countries, devices, series };
  }
}
