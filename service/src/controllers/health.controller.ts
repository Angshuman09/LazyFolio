import { Context } from "hono";
import { ApiView } from "../views/api.view";

export class HealthController {
  static root(c: Context) {
    return ApiView.text(c, "insight service is running");
  }

  static health(c: Context) {
    return ApiView.health(c, "insight service");
  }
}
