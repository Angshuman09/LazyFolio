import { Env, DEFAULT_CONFIG } from "../config/env";
import { TinybirdEvent } from "../models/event.model";
import { ClickMetric, CountryMetric, DeviceMetric } from "../models/insight.model";

export class TinybirdRepository {
  private static getBaseUrl(env: Env): string {
    return env.TINYBIRD_BASE_URL || DEFAULT_CONFIG.TINYBIRD_BASE_URL;
  }

  private static getHeaders(env: Env): Record<string, string> {
    return {
      Authorization: `Bearer ${env.TINYBIRD_API_TOKEN || ""}`,
    };
  }

  static async ingestEvent(event: TinybirdEvent, env: Env): Promise<boolean> {
    try {
      const baseUrl = this.getBaseUrl(env);
      const res = await fetch(`${baseUrl}/v0/events?name=events`, {
        method: "POST",
        headers: {
          ...this.getHeaders(env),
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

  /**
   * Query pipe get_pageviews
   */
  static async fetchPageviews(
    params: string,
    env: Env
  ): Promise<{ pageviews: number; uniqueVisitors: number }> {
    const baseUrl = this.getBaseUrl(env);
    const res = await fetch(`${baseUrl}/v0/pipes/get_pageviews.json?${params}`, {
      headers: this.getHeaders(env),
    });

    if (!res.ok) {
      console.error("get_pageviews error:", res.status, await res.text());
      return { pageviews: 0, uniqueVisitors: 0 };
    }

    const json = (await res.json()) as any;
    const row = json?.data?.[0];
    return {
      pageviews: Number(row?.pageviews ?? 0),
      uniqueVisitors: Number(row?.unique_visitors ?? 0),
    };
  }

  /**
   * Query pipe get_top_clicks
   */
  static async fetchTopClicks(params: string, env: Env): Promise<ClickMetric[]> {
    const baseUrl = this.getBaseUrl(env);
    const res = await fetch(`${baseUrl}/v0/pipes/get_top_clicks.json?${params}`, {
      headers: this.getHeaders(env),
    });

    if (!res.ok) {
      console.error("get_top_clicks error:", res.status, await res.text());
      return [];
    }

    const json = (await res.json()) as any;
    return (json?.data ?? []).map((row: any) => ({
      label: row.label as string,
      count: Number(row.count ?? 0),
    }));
  }

  /**
   * Query pipe get_top_countries
   */
  static async fetchTopCountries(params: string, env: Env): Promise<CountryMetric[]> {
    const baseUrl = this.getBaseUrl(env);
    const res = await fetch(`${baseUrl}/v0/pipes/get_top_countries.json?${params}`, {
      headers: this.getHeaders(env),
    });

    if (!res.ok) {
      console.error("get_top_countries error:", res.status, await res.text());
      return [];
    }

    const json = (await res.json()) as any;
    return (json?.data ?? []).map((row: any) => ({
      country: row.country as string,
      count: Number(row.count ?? 0),
    }));
  }

  /**
   * Query pipe get_top_devices
   */
  static async fetchTopDevices(params: string, env: Env): Promise<DeviceMetric[]> {
    const baseUrl = this.getBaseUrl(env);
    const res = await fetch(`${baseUrl}/v0/pipes/get_top_devices.json?${params}`, {
      headers: this.getHeaders(env),
    });

    if (!res.ok) {
      console.error("get_top_devices error:", res.status, await res.text());
      return [];
    }

    const json = (await res.json()) as any;
    return (json?.data ?? []).map((row: any) => ({
      device: row.device as string,
      count: Number(row.count ?? 0),
    }));
  }

  /**
   * Query pipe get_pageview_series
   */
  static async fetchPageviewSeries(
    params: string,
    env: Env
  ): Promise<Map<string, number>> {
    const baseUrl = this.getBaseUrl(env);
    const res = await fetch(`${baseUrl}/v0/pipes/get_pageview_series.json?${params}`, {
      headers: this.getHeaders(env),
    });

    const seriesMap = new Map<string, number>();
    if (!res.ok) {
      console.error("get_pageview_series error:", res.status, await res.text());
      return seriesMap;
    }

    const json = (await res.json()) as any;
    for (const item of json?.data ?? []) {
      seriesMap.set(item.date as string, Number(item.views ?? 0));
    }
    return seriesMap;
  }
}
