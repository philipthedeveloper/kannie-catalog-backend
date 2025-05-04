"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentController = exports.contentRouter = void 0;
const constants_1 = require("@/constants");
const controllers_1 = require("@/controllers");
const decorators_1 = require("@/decorators");
const enums_1 = require("@/enums");
const helpers_1 = require("@/helpers");
const middlewares_1 = require("@/middlewares");
exports.contentRouter = (0, helpers_1.createRouter)();
exports.contentController = controllers_1.ContentController.getInstance();
exports.contentRouter.get("/all", exports.contentController.getAlContents);
exports.contentRouter.get("/:id", exports.contentController.getContentById);
exports.contentRouter.post("/create", middlewares_1.validateToken, (0, middlewares_1.uploadFiles)([
    {
        name: "mediaFile",
        required: true,
        mimeTypes: constants_1.VIDEO_AUDIO_MIMETYPES,
    },
    {
        name: "coverArt",
        required: function (req) {
            return req.body.type === enums_1.ContentType.AUDIO;
        },
        mimeTypes: constants_1.IMAGE_MIMETYPES,
    },
]), (0, middlewares_1.validateDTO)(decorators_1.AddContentDto), exports.contentController.addNewContent);
exports.contentRouter.patch("/:id", middlewares_1.validateToken, (0, middlewares_1.uploadFiles)([
    { name: "mediaFile", required: false, mimeTypes: constants_1.VIDEO_AUDIO_MIMETYPES },
    { name: "coverAt", required: false, mimeTypes: constants_1.IMAGE_MIMETYPES },
]), (0, middlewares_1.validateDTO)(decorators_1.UpdateContentDto), exports.contentController.updateContent);
exports.contentRouter.delete("/:id", middlewares_1.validateToken, exports.contentController.deleteContent);
