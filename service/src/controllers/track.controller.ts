import { Context } from "hono";
import { Env } from "../config/env";
import { TrackPayload, isValidEventType } from "../models/event.model";
import { TrackService } from "../services/track.service";
import { ApiView } from "../views/api.view";

export class TrackController {
  static async track(c: Context<{ Bindings: Env }>) {
    try {
      const body = (await c.req.json().catch(() => null)) as Partial<TrackPayload> | null;

      if (!body) {
        return ApiView.error(c, "Invalid JSON payload", 400);
      }

      const { profileId, eventType = "pageview", label } = body;

      if (!profileId || !isValidEventType(eventType)) {
        return ApiView.error(c, "Invalid payload: profileId and valid eventType ('pageview' | 'click') are required", 400);
      }

      await TrackService.recordEvent(c, {
        profileId,
        eventType,
        label,
      });

      return ApiView.ok(c);
    } catch (err) {
      console.error("Track controller error:", err);
      // Soft-fail on ingestion error so client tracking doesn't break user flow
      return ApiView.softFail(c);
    }
  }
}
