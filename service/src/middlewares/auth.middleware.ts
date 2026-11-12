import { Context, Next } from "hono";
import { Env } from "../config/env";
import { ApiView } from "../views/api.view";

export async function serviceAuthMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const configuredSecret = (
    c.env.SERVICE_SHARED_SECRET ||
    (c.env as Record<string, string | undefined>).INSIGHTS_SERVICE_SECRET
  )?.trim();

  if (!configuredSecret) {
    console.warn("Service secret is not configured in environment; denying access.");
    return ApiView.error(c, "Service authentication not configured", 401);
  }

  const incomingSecret =
    c.req.header("x-service-secret") ||
    c.req.header("authorization")?.replace(/^Bearer\s+/i, "");

  if (incomingSecret !== configuredSecret) {
    return ApiView.error(c, "Unauthorized", 401);
  }

  await next();
}
