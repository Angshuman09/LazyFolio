import { Hono } from 'hono'
import {cors} from "hono/cors";
import { Env } from './types';

const app = new Hono<{Bindings: Env}>()

app.use(
  "*",
  cors({
  origin: "*",
  allowMethods:["GET","POST","OPTIONS"],
  allowHeaders:["Content-Type", "Authorization", "x-service-secret"]
}));

app.get('/', (c) => {
  return c.text('insight service is running')
})

app.get("/health", (c)=>{
  return c.json({
    status: "ok",
    service: "insight service",
    timestamp: new Date().toISOString()
  })
})

app.get("/api/v1/config-check", (c)=>{
  return c.json({
    hasSalt: Boolean(c.env.VISITOR_HASH_SALT),
    tintinybirdUrl: c.env.TINYBIRD_BASE_URL || "https://api.tinybird.co",
  })
})

app.get("/api/v1/debug", (c) => {
  const ip =
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "127.0.0.1";
  const country = (c.req.raw as any).cf?.country || "LOCAL";
  const userAgent = c.req.header("user-agent") || "unknown";
  return c.json({
    ip,
    country,
    userAgent,
    headers: c.req.header(),
  });
});

export default app
