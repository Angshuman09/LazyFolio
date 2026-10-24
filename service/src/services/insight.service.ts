import { Env } from "../config/env";
import { RangeKey, InsightData } from "../models/insight.model";
import { TinybirdRepository } from "../repositories/tinybird.repository";

export class InsightService {
  private static getDaysForRange(range: RangeKey): number {
    switch (range) {
      case "7d":
        return 7;
      case "30d":
        return 30;
      case "90d":
        return 90;
      default:
        return 30;
    }
  }

  static async getInsights(profileId: string, range: RangeKey, env: Env): Promise<InsightData> {
    const days = this.getDaysForRange(range);
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

    const startDate = start.toISOString().replace("T", " ").substring(0, 19);
    const endDate = end.toISOString().replace("T", " ").substring(0, 19);

    const params = `profile_id=${encodeURIComponent(profileId)}&start_date=${encodeURIComponent(
      startDate
    )}&end_date=${encodeURIComponent(endDate)}`;

    const [pvData, clicks, countries, devices, seriesMap] = await Promise.all([
      TinybirdRepository.fetchPageviews(params, env),
      TinybirdRepository.fetchTopClicks(params, env),
      TinybirdRepository.fetchTopCountries(params, env),
      TinybirdRepository.fetchTopDevices(params, env),
      TinybirdRepository.fetchPageviewSeries(params, env),
    ]);
    
    const series: { date: string; views: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      series.push({ date: key, views: seriesMap.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      pageviews: pvData.pageviews,
      uniqueVisitors: pvData.uniqueVisitors,
      clicks,
      countries,
      devices,
      series,
    };
  }
}
