"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const helpers_1 = require("@/helpers");
const models_1 = require("@/models");
class AnalyticsService {
    constructor() {
        this.contentModel = models_1.Content;
        this.adminModel = models_1.Admin;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AnalyticsService();
        }
        return this.instance;
    }
    getAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const contentsCount = yield this.contentModel.countDocuments({});
            const adminsCount = yield this.adminModel.countDocuments({});
            const contentStat = (0, helpers_1.createContentStat)(contentsCount);
            const adminStat = (0, helpers_1.createAdminStat)(adminsCount);
            const analytics = [contentStat, adminStat];
            return analytics;
        });
    }
}
exports.AnalyticsService = AnalyticsService;
