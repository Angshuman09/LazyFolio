import { Context } from "hono";
import { ApiView } from "../views/api.view";

/**
 * Global application error handler
 */
export function errorHandler(err: Error, c: Context) {
  console.error(`[Unhandled Error] ${c.req.method} ${c.req.url}:`, err);
  return ApiView.error(c, "Internal Server Error", 500);
}

/**
 * Route not found handler
 */
export function notFoundHandler(c: Context) {
  return ApiView.error(c, `Not Found: ${c.req.method} ${c.req.path}`, 404);
}
