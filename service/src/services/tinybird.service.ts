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

    const params = `profile_id=${encodeURIComponent(profileId)}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;
    const headers = { Authorization: `Bearer ${env.TINYBIRD_API_TOKEN}` };

    // Call all 5 Tinybird pipes in parallel
    const [pvRes, clicksRes, countriesRes, devicesRes, seriesRes] = await Promise.all([
      fetch(`${baseUrl}/v0/pipes/get_pageviews.json?${params}`, { headers }),
      fetch(`${baseUrl}/v0/pipes/get_top_clicks.json?${params}`, { headers }),
      fetch(`${baseUrl}/v0/pipes/get_top_countries.json?${params}`, { headers }),
      fetch(`${baseUrl}/v0/pipes/get_top_devices.json?${params}`, { headers }),
      fetch(`${baseUrl}/v0/pipes/get_pageview_series.json?${params}`, { headers }),
    ]);

    // Parse pageviews & unique visitors
    let pageviews = 0;
    let uniqueVisitors = 0;
    if (pvRes.ok) {
      const json = (await pvRes.json()) as any;
      const row = json?.data?.[0];
      if (row) {
        pageviews = Number(row.pageviews ?? 0);
        uniqueVisitors = Number(row.unique_visitors ?? 0);
      }
    } else {
      console.error("get_pageviews error:", pvRes.status, await pvRes.text());
    }

    // Parse clicks
    let clicks: { label: string; count: number }[] = [];
    if (clicksRes.ok) {
      const json = (await clicksRes.json()) as any;
      clicks = (json?.data ?? []).map((row: any) => ({
        label: row.label as string,
        count: Number(row.count ?? 0),
      }));
    } else {
      console.error("get_top_clicks error:", clicksRes.status, await clicksRes.text());
    }

    // Parse countries
    let countries: { country: string; count: number }[] = [];
    if (countriesRes.ok) {
      const json = (await countriesRes.json()) as any;
      countries = (json?.data ?? []).map((row: any) => ({
        country: row.country as string,
        count: Number(row.count ?? 0),
      }));
    } else {
      console.error("get_top_countries error:", countriesRes.status, await countriesRes.text());
    }

    // Parse devices
    let devices: { device: string; count: number }[] = [];
    if (devicesRes.ok) {
      const json = (await devicesRes.json()) as any;
      devices = (json?.data ?? []).map((row: any) => ({
        device: row.device as string,
        count: Number(row.count ?? 0),
      }));
    } else {
      console.error("get_top_devices error:", devicesRes.status, await devicesRes.text());
    }

    // Parse series and fill missing days with 0
    const seriesMap = new Map<string, number>();
    if (seriesRes.ok) {
      const json = (await seriesRes.json()) as any;
      for (const item of json?.data ?? []) {
        seriesMap.set(item.date as string, Number(item.views ?? 0));
      }
    } else {
      console.error("get_pageview_series error:", seriesRes.status, await seriesRes.text());
    }

    const series: { date: string; views: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      series.push({ date: key, views: seriesMap.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return { pageviews, uniqueVisitors, clicks, countries, devices, series };
  }
}
