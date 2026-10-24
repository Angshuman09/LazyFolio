import { Context } from "hono";
import { Env, DEFAULT_CONFIG } from "../config/env";
import { isValidRange, RangeKey } from "../models/insight.model";
import { InsightService } from "../services/insight.service";
import { ApiView } from "../views/api.view";

export class InsightController {
  static async getInsights(c: Context<{ Bindings: Env }>) {
    const profileId = c.req.query("profileId");
    if (!profileId) {
      return ApiView.error(c, "Missing required query parameter: profileId", 400);
    }

    const rawRange = c.req.query("range") ?? "30d";
    if (!isValidRange(rawRange)) {
      return ApiView.error(c, "Invalid range parameter. Supported ranges: 7d, 30d, 90d", 400);
    }

    const range = rawRange as RangeKey;

    try {
      const data = await InsightService.getInsights(profileId, range, c.env);
      return ApiView.insights(c, data, DEFAULT_CONFIG.INSIGHTS_CACHE_SECONDS);
    } catch (err) {
      console.error("Insights controller error:", err);
      return ApiView.error(c, "Failed to fetch insights", 500);
    }
  }
}
