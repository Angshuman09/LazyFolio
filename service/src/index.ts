import { Hono } from 'hono'
import { cors } from "hono/cors";
import { Env } from './types';
import { TinybirdService } from './services/tinybird.service';
import { TrackPayload, RangeKey } from './models/event.model';
import { getDeviceType } from './utils/device';
import { hashVisitor } from './utils/hash';

const app = new Hono<{ Bindings: Env }>()

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-service-secret"]
  })
);

app.get('/', (c) => {
  return c.text('insight service is running')
})

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "insight service",
    timestamp: new Date().toISOString()
  })
})

app.post("/api/v1/track", async (c) => {
  try {
    const body = (await c.req.json()) as Partial<TrackPayload>;
    const { profileId, eventType = "pageview", label } = body;

    if (!profileId || !["pageview", "click"].includes(eventType)) {
      return c.json({ error: "Invalid payload" }, 400);
    }

    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "127.0.0.1";

    const country =
      (c.req.raw as any).cf?.country ||
      c.req.header("x-vercel-ip-country") ||
      null;

    const userAgent = c.req.header("user-agent") || null;
    const device = getDeviceType(userAgent);
    const salt = c.env.VISITOR_HASH_SALT || "default-salt";
    const visitorHash = await hashVisitor(ip, salt);

    const event = {
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      profile_id: profileId,
      event_type: eventType,
      label: label ?? null,
      country: country ?? null,
      device,
      visitor_hash: visitorHash,
    };

    if (c.executionCtx?.waitUntil) {
      c.executionCtx.waitUntil(TinybirdService.sendEvent(event as any, c.env));
    } else {
      await TinybirdService.sendEvent(event as any, c.env);
    }

    return c.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return c.json({ ok: false }, 200); 
  }
});

app.get("/api/v1/insights", async (c) => {

  const secret =
    c.req.header("x-service-secret") ||
    c.req.header("authorization")?.replace("Bearer ", "");

  if (c.env.SERVICE_SHARED_SECRET && secret !== c.env.SERVICE_SHARED_SECRET.trim()) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const profileId = c.req.query("profileId");
  if (!profileId) {
    return c.json({ error: "Missing profileId" }, 400);
  }

  const range = (c.req.query("range") ?? "30d") as RangeKey;
  if (!["7d", "30d", "90d"].includes(range)) {
    return c.json({ error: "Invalid range. Use: 7d, 30d, 90d" }, 400);
  }

  try {
    const data = await TinybirdService.getInsights(profileId, range, c.env);
    c.header("Cache-Control", "public, max-age=120, s-maxage=120");
    return c.json(data);
  } catch (err) {
    console.error("Insights error:", err);
    return c.json({ error: "Failed to fetch insights" }, 500);
  }
});

export default app
