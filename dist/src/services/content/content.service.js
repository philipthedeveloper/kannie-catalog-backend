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
exports.ContentService = void 0;
const helpers_1 = require("@/helpers");
const models_1 = require("@/models");
const utils_1 = require("@/utils");
const mongoose_1 = require("mongoose");
class ContentService {
    constructor() {
        this.contentModel = models_1.Content;
        this.storageService = utils_1.StorageService.getInstance();
        this.contentPagination = new utils_1.PaginationService(models_1.Content);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ContentService();
        }
        return this.instance;
    }
    getAllWorks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contentType } = query;
            const queryObject = {};
            if (contentType) {
                queryObject.type = contentType;
            }
            return this.contentPagination.paginate(Object.assign({}, queryObject), ["type", "description", "mediaUrl", "coverArt"]);
        });
    }
    getWork(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.contentModel.findById(id);
            if (!content)
                return (0, helpers_1.throwNotFoundError)("Work not found");
            return content;
        });
    }
    addWork(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, description, mediaFile, coverArt } = data;
            const contentId = new mongoose_1.Types.ObjectId();
            const contentMediaPrefix = `contents/${contentId}`;
            let { fileUrl: mediaUrl } = yield this.storageService.uploadFile(mediaFile, `${contentMediaPrefix}_${mediaFile.originalname}`);
            let coverArtUrl;
            if (coverArt) {
                let { fileUrl } = yield this.storageService.uploadFile(coverArt, `cover_arts/${contentId}_${coverArt.originalname}`);
                coverArtUrl = fileUrl;
            }
            const content = yield this.contentModel.create({
                _id: contentId,
                type,
                description,
                mediaUrl,
                coverArtUrl,
            });
            return content;
        });
    }
    updateWork(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = yield this.contentModel.findById(id);
            if (!content)
                return (0, helpers_1.throwNotFoundError)("The content you are trying to update does not exist");
            const { mediaFile, coverArt } = data;
            const contentMediaPrefix = `contents/${content._id}`;
            if (mediaFile) {
                if (!mediaFile.mimetype.includes(content.type))
                    return (0, helpers_1.throwUnsupportedMediaTypeError)("Media resource type must match content type");
                yield this.storageService.deleteFile(content.mediaUrl);
                content.mediaUrl = (yield this.storageService.uploadFile(mediaFile, `${contentMediaPrefix}_${mediaFile === null || mediaFile === void 0 ? void 0 : mediaFile.originalname}`)).fileUrl;
            }
            if (coverArt) {
                yield this.storageService.deleteFile(content.coverArtUrl);
                content.coverArtUrl = (yield this.storageService.uploadFile(coverArt, `cover_arts/${content._id}_${coverArt.originalname}`)).fileUrl;
            }
            if (data.description)
                content.description = data.description;
            yield content.save();
            return content;
        });
    }
    deleteWork(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.contentModel.findByIdAndDelete(id);
            if (!content)
                return (0, helpers_1.throwNotFoundError)("Work not found");
            yield this.storageService.deleteFile(content.mediaUrl);
            if (content.coverArtUrl)
                yield this.storageService.deleteFile(content.coverArtUrl);
            return content;
        });
    }
}
exports.ContentService = ContentService;
