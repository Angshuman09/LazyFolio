import { Context } from "hono";
import { Env, DEFAULT_CONFIG } from "../config/env";
import { TrackPayload, TinybirdEvent } from "../models/event.model";
import { TinybirdRepository } from "../repositories/tinybird.repository";
import { getDeviceType } from "../utils/device";
import { hashVisitor } from "../utils/hash";

export class TrackService {
  private static extractClientIp(c: Context): string {
    return (
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "127.0.0.1"
    );
  }

  private static extractCountry(c: Context): string | null {
    const raw = c.req.raw as unknown as { cf?: { country?: string } };
    return raw?.cf?.country || c.req.header("x-vercel-ip-country") || null;
  }

  static async recordEvent(c: Context<{ Bindings: Env }>, payload: TrackPayload): Promise<boolean> {
    const { profileId, eventType, label } = payload;
    const ip = this.extractClientIp(c);
    const country = this.extractCountry(c);
    const userAgent = c.req.header("user-agent") || null;
    const device = getDeviceType(userAgent);
    const salt = c.env.VISITOR_HASH_SALT || DEFAULT_CONFIG.VISITOR_HASH_SALT;
    const visitorHash = await hashVisitor(ip, salt);

    const event: TinybirdEvent = {
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      profile_id: profileId,
      event_type: eventType,
      label: label ?? null,
      country,
      device,
      visitor_hash: visitorHash,
    };

    const task = TinybirdRepository.ingestEvent(event, c.env);

    // Edge execution context: schedule non-blocking background task in Cloudflare Workers
    try {
      if (c.executionCtx?.waitUntil) {
        c.executionCtx.waitUntil(task);
        return true;
      }
    } catch {
      // ExecutionContext is not available in Node.js or test runtime, fallback to awaiting
    }

    return await task;
  }
}
