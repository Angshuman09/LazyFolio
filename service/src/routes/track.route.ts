import { Hono } from "hono";
import { Env } from "../config/env";
import { TrackController } from "../controllers/track.controller";

const router = new Hono<{ Bindings: Env }>();

router.post("/", TrackController.track);

export default router;
