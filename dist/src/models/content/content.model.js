"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const enums_1 = require("@/enums");
const mongoose_1 = require("mongoose");
const ContentSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: {
            values: Object.values(enums_1.ContentType),
            message: "Unsupported content type",
        },
        required: [true, "Please provide content type"],
    },
    description: {
        type: String,
        required: [true, "Please description what this is about"],
    },
    mediaUrl: {
        type: String,
        required: [true, "Please provide a url to this content"],
    },
    coverArtUrl: {
        type: String,
        required: [
            function () {
                return this.type === enums_1.ContentType.AUDIO;
            },
            "Please provide cover art for audio content",
        ],
    },
}, { timestamps: true, autoIndex: true, toJSON: { versionKey: false } });
exports.Content = (0, mongoose_1.model)("contents", ContentSchema);
