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
exports.User = exports.UserSchema = void 0;
const enums_1 = require("@/enums");
const utils_1 = require("@/utils");
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const constants_1 = require("@/constants");
const collectionName = "users";
exports.UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "Please provide firstname"],
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Please provide lastname"],
    },
    email: {
        type: String,
        unique: [true, "User with email already exist"],
        required: [true, "Please provide email"],
        match: [utils_1.emailRegex, "Invalid email"],
        trim: true,
        lowercase: true,
    },
    hash: {
        type: String,
        trim: true,
    },
    salt: {
        type: String,
    },
    passwordChangedAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
        immutable: true,
    },
    userType: {
        type: String,
        default: enums_1.UserTypes.USER,
        immutable: true,
        enum: {
            values: Object.values(enums_1.UserTypes),
            message: "Unsupported user type {{VALUE}}",
        },
    },
}, {
    timestamps: true,
    autoIndex: true,
    toJSON: {
        versionKey: false,
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
exports.UserSchema.index({
    email: "text",
    firstName: "text",
    lastName: "text",
});
/**
 * Setup document method for password encryption
 * @param password
 */
exports.UserSchema.methods.setPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        this.salt = yield (0, bcryptjs_1.genSalt)(constants_1.BYTE_LENGTH);
        this.hash = yield (0, bcryptjs_1.hash)(password, this.salt);
        this.passwordChangedAt = new Date();
        return true;
    });
};
exports.UserSchema.methods.validatePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.salt || !this.hash)
            return false;
        return yield (0, bcryptjs_1.compare)(password, this.hash);
    });
};
exports.User = (0, mongoose_1.model)(collectionName, exports.UserSchema);
