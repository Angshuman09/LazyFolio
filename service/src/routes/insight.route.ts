import { Hono } from "hono";
import { Env } from "../config/env";
import { InsightController } from "../controllers/insight.controller";
import { serviceAuthMiddleware } from "../middlewares/auth.middleware";

const router = new Hono<{ Bindings: Env }>();

router.use("*", serviceAuthMiddleware);
router.get("/", InsightController.getInsights);

export default router;
