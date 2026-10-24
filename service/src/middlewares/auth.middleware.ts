import { Context, Next } from "hono";
import { Env } from "../config/env";
import { ApiView } from "../views/api.view";

export async function serviceAuthMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const configuredSecret = c.env.SERVICE_SHARED_SECRET?.trim();

  // If secret is not configured in environment, allow access (or enforce in strict mode)
  if (!configuredSecret) {
    return await next();
  }

  const incomingSecret =
    c.req.header("x-service-secret") ||
    c.req.header("authorization")?.replace(/^Bearer\s+/i, "");

  if (incomingSecret !== configuredSecret) {
    return ApiView.error(c, "Unauthorized", 401);
  }

  await next();
}
