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
exports.AuthController = void 0;
const helpers_1 = require("@/helpers");
const services_1 = require("@/services");
const http_status_codes_1 = require("http-status-codes");
class AuthController {
    constructor() {
        this.adminLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.authService.loginAdmin(req.body);
            return (0, helpers_1.sendSuccessResponse)(res, data);
        });
        this.session = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.authService.session(req.authData);
            return (0, helpers_1.sendSuccessResponse)(res, data);
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.authService.changePassword(req.authData, req.body);
            return (0, helpers_1.sendSuccessResponse)(res, data);
        });
        this.seedAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.authService.seedAdmin();
            return (0, helpers_1.sendSuccessResponse)(res, data);
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.authService.expireSession((_a = req.authData) === null || _a === void 0 ? void 0 : _a.userId);
            return (0, helpers_1.sendSuccessResponse)(res, {}, http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.authService.session(req.authData);
            return (0, helpers_1.sendSuccessResponse)(res, data);
        });
        this.getAdmins = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = req.authData) === null || _a === void 0 ? void 0 : _a.isSuperAdmin)) {
                (0, helpers_1.throwForbiddenError)("You are not allowed to perform this action");
            }
            const data = yield this.authService.getAdmins(req.query);
            return (0, helpers_1.sendSuccessResponse)(res, data);
        });
        this.createAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.authService.createAdmin(req.body, req.authData);
            return (0, helpers_1.sendSuccessResponse)(res, data, http_status_codes_1.StatusCodes.CREATED);
        });
        this.authService = services_1.AuthService.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthController();
        }
        return this.instance;
    }
}
exports.AuthController = AuthController;
