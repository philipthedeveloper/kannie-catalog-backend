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
exports.StorageService = void 0;
const app_1 = require("firebase/app");
const config_1 = require("@/config");
const storage_1 = require("firebase/storage");
const helpers_1 = require("@/helpers");
class StorageService {
    constructor() {
        this.uploadFile = (file, location) => __awaiter(this, void 0, void 0, function* () {
            const fileRef = (0, storage_1.ref)(this.storage, location);
            yield (0, storage_1.uploadBytes)(fileRef, file.buffer);
            const fileUrl = yield (0, storage_1.getDownloadURL)(fileRef);
            const { size, fullPath, name, timeCreated, contentType } = yield (0, storage_1.getMetadata)(fileRef);
            return {
                metadata: {
                    size,
                    fullPath,
                    name,
                    timeCreated,
                    contentType,
                },
                fileUrl,
            };
        });
        this.deleteFile = (location) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileRef = (0, storage_1.ref)(this.storage, location);
                yield (0, storage_1.deleteObject)(fileRef);
                return { success: true };
            }
            catch (error) {
                if (typeof error === "string")
                    (0, helpers_1.throwServerError)(error);
                if (error.message)
                    (0, helpers_1.throwServerError)(error.message);
            }
        });
        this.app = (0, app_1.initializeApp)(config_1.config.firebase);
        this.storage = (0, storage_1.getStorage)(this.app);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new StorageService();
        }
        return this.instance;
    }
}
exports.StorageService = StorageService;
