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
exports.ContentController = void 0;
const helpers_1 = require("@/helpers");
const services_1 = require("@/services");
const http_status_codes_1 = require("http-status-codes");
class ContentController {
    constructor() {
        this.getAlContents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.contentService.getAllWorks(req.query);
            return (0, helpers_1.sendSuccessResponse)(res, { data });
        });
        this.getContentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.contentService.getWork(req.params.id);
            return (0, helpers_1.sendSuccessResponse)(res, { data });
        });
        this.addNewContent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // if (req.body.type === ContentType.AUDIO && !req.files["coverAt"])
            //   return throwBadRequestError("Missing required file: cover art");
            var _a;
            const reqFiles = {
                mediaFile: req.files["mediaFile"][0],
                coverArt: (_a = req.files["coverArt"]) === null || _a === void 0 ? void 0 : _a[0],
            };
            if (!reqFiles.mediaFile.mimetype.includes(req.body.type))
                return (0, helpers_1.throwUnsupportedMediaTypeError)(`Media resource must match content type.`);
            const data = yield this.contentService.addWork(Object.assign(Object.assign({}, req.body), reqFiles));
            return (0, helpers_1.sendSuccessResponse)(res, { data }, http_status_codes_1.StatusCodes.CREATED);
        });
        this.updateContent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const reqFiles = {
                mediaFile: (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a["mediaFile"]) === null || _b === void 0 ? void 0 : _b[0],
                coverArt: (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c["coverArt"]) === null || _d === void 0 ? void 0 : _d[0],
            };
            const data = yield this.contentService.updateWork(req.params.id, Object.assign(Object.assign({}, req.body), reqFiles));
            return (0, helpers_1.sendSuccessResponse)(res, { data });
        });
        this.deleteContent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.contentService.deleteWork(req.params.id);
            return (0, helpers_1.sendSuccessResponse)(res, { data });
        });
        this.contentService = services_1.ContentService.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ContentController();
        }
        return this.instance;
    }
}
exports.ContentController = ContentController;
