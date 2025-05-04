import { sendSuccessResponse } from "@/helpers";
import { AnalyticsService } from "@/services";
import { Request, Response } from "express";

export class AnalyticsController {
  private static instance: AnalyticsController;
  private readonly analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = AnalyticsService.getInstance();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AnalyticsController();
    }
    return this.instance;
  }

  getAnalytics = async (req: Request, res: Response) => {
    const analytics = await this.analyticsService.getAnalytics();
    return sendSuccessResponse(res, { analytics });
  };
}
