import { createRouter } from "@/helpers";
import { authRouter } from "./auth.routes";
import { analyticsRouter } from "./analytics.routes";
import { contentRouter } from "./content.routes";

export const appRouter = createRouter();

appRouter.use("/auth", authRouter);
appRouter.use("/analytics", analyticsRouter);
appRouter.use("/content", contentRouter);
