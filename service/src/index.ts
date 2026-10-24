import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import apiRoutes from "./routes";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-service-secret"],
  })
);

app.onError(errorHandler);
app.notFound(notFoundHandler);

app.route("/", apiRoutes);

export default app;
