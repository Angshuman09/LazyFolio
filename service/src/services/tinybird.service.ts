import { Env } from "../config/env";
import { TinybirdEvent, RangeKey, InsightData } from "../models/event.model";
import { TinybirdRepository } from "../repositories/tinybird.repository";
import { InsightService } from "./insight.service";

export class TinybirdService {
  static async sendEvent(event: TinybirdEvent, env: Env): Promise<boolean> {
    return TinybirdRepository.ingestEvent(event, env);
  }

  static async getInsights(profileId: string, range: RangeKey, env: Env): Promise<InsightData> {
    return InsightService.getInsights(profileId, range, env);
  }
}
