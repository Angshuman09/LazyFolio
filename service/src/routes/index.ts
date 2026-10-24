import { Hono } from "hono";
import { Env } from "../config/env";
import healthRoutes from "./health.route";
import trackRoutes from "./track.route";
import insightRoutes from "./insight.route";

const api = new Hono<{ Bindings: Env }>();

api.route("/", healthRoutes);

api.route("/api/v1/track", trackRoutes);
api.route("/api/v1/insights", insightRoutes);

export default api;
