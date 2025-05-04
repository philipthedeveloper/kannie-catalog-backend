"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const http_status_codes_1 = require("http-status-codes");
// File filter function (dynamic validation per field)
const fileFilter = (allowedTypes) => {
    return (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${allowedTypes.join(", ")}`));
        }
        cb(null, true);
    };
};
/**
 * Flexible file upload middleware.
 * @param fields Array of field objects with validation rules.
 */
const uploadFiles = (fields) => {
    return (req, res, next) => {
        const multerFields = fields.map((field) => ({
            name: field.name,
            maxCount: field.maxCount || 1,
        }));
        // Configure multer dynamically
        const upload = (0, multer_1.default)({
            fileFilter: (req, file, cb) => {
                const fieldConfig = fields.find((f) => f.name === file.fieldname);
                if (fieldConfig && fieldConfig.mimeTypes) {
                    return fileFilter(fieldConfig.mimeTypes)(req, file, cb);
                }
                cb(new Error(`Unexpected field: ${file.fieldname}`));
            },
            limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
        }).fields(multerFields);
        upload(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError || err) {
                return res
                    .status(err.message.includes("Invalid file type")
                    ? http_status_codes_1.StatusCodes.UNSUPPORTED_MEDIA_TYPE
                    : http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({
                    message: err.message,
                    success: false,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                });
            }
            const reqFiles = req.files;
            // Manual required field validation
            for (const field of fields) {
                const isRequired = typeof field.required === "function"
                    ? field.required(req)
                    : field.required;
                if (isRequired && (!reqFiles || !reqFiles[field.name])) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ error: `Missing required file: ${field.name}` });
                }
            }
            next();
        });
    };
};
exports.uploadFiles = uploadFiles;
