"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
const controllers_1 = require("@/controllers");
const helpers_1 = require("@/helpers");
const middlewares_1 = require("@/middlewares");
exports.analyticsRouter = (0, helpers_1.createRouter)();
const analyticsController = controllers_1.AnalyticsController.getInstance();
exports.analyticsRouter.get("/get-analytics", middlewares_1.validateToken, analyticsController.getAnalytics);
