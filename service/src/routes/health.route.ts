import { Hono } from "hono";
import { HealthController } from "../controllers/health.controller";

const router = new Hono();

router.get("/", HealthController.root);
router.get("/health", HealthController.health);

export default router;
