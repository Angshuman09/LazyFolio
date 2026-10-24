import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { InsightData } from "../models/insight.model";


export class ApiView {
  static text(c: Context, message: string, status: ContentfulStatusCode = 200) {
    return c.text(message, status);
  }

  static json<T>(
    c: Context,
    data: T,
    status: ContentfulStatusCode = 200,
    headers?: Record<string, string>
  ) {
    return c.json(data, status, headers);
  }

  static ok(c: Context) {
    return c.json({ ok: true }, 200);
  }

  static softFail(c: Context) {
    return c.json({ ok: false }, 200);
  }

  static error(c: Context, message: string, status: ContentfulStatusCode = 400) {
    return c.json({ error: message }, status);
  }

  static health(c: Context, serviceName: string = "insight service") {
    return c.json(
      {
        status: "ok",
        service: serviceName,
        timestamp: new Date().toISOString(),
      },
      200
    );
  }

  static insights(c: Context, data: InsightData, cacheSeconds: number = 120) {
    c.header("Cache-Control", `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`);
    return c.json(data, 200);
  }
}
