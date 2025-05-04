import { AnalyticsController } from "@/controllers";
import { createRouter } from "@/helpers";
import { validateToken } from "@/middlewares";

export const analyticsRouter = createRouter();
const analyticsController = AnalyticsController.getInstance();

analyticsRouter.get(
  "/get-analytics",
  validateToken,
  analyticsController.getAnalytics
);
