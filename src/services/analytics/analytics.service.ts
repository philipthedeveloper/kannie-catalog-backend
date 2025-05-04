import { createAdminStat, createContentStat } from "@/helpers";
import { Admin, Content, IAdmin, IContent } from "@/models";
import { Model } from "mongoose";

export class AnalyticsService {
  private static instance: AnalyticsService;
  private readonly contentModel: Model<IContent> = Content;
  private readonly adminModel: Model<IAdmin> = Admin;

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new AnalyticsService();
    }
    return this.instance;
  }

  async getAnalytics() {
    const contentsCount = await this.contentModel.countDocuments({});
    const adminsCount = await this.adminModel.countDocuments({});
    const contentStat = createContentStat(contentsCount);
    const adminStat = createAdminStat(adminsCount);
    const analytics = [contentStat, adminStat];
    return analytics;
  }
}
