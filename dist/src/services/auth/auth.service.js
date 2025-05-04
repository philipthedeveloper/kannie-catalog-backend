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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = require("@/config");
const enums_1 = require("@/enums");
const models_1 = require("@/models");
const utils_1 = require("@/utils");
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const jwt_service_1 = require("./jwt.service");
const decorators_1 = require("@/decorators");
const helpers_1 = require("@/helpers");
const crypto_1 = require("crypto");
class AuthService {
    constructor() {
        // Model
        this.userModel = models_1.User;
        this.adminModel = models_1.Admin;
        this.cacheService = utils_1.CacheService.getInstance();
        this.jwtService = jwt_service_1.JwtService.getInstance();
        this.emailService = utils_1.SmtpEmailService.getInstance();
        this.userPagination = new utils_1.PaginationService(this.userModel);
        this.adminPagination = new utils_1.PaginationService(this.adminModel);
    }
    /**
     * Gets an instance of the AuthService
     * @returns {AuthService}
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }
    /**
     * A key used to map auth session id to the user id
     * @param {string} userId
     * @returns {string}
     */
    sessionKeyMap(userId) {
        return `auth-session-map-${userId}`;
    }
    /**
     * Expires existing session
     * @param {string} userId
     * @returns {void}
     */
    expireSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // fetch any existing session for user
            const existingAuthKey = yield this.cacheService.get(this.sessionKeyMap(userId));
            // delete any exist session
            if (existingAuthKey) {
                yield this.cacheService.delete(existingAuthKey);
            }
        });
    }
    /**
     * Refresh a user's session when there is change in the user's data
     * @param user {IUser}
     * @param userType {UserTypes}
     * @param authId {string}
     */
    refreshSession(user, userType, authId) {
        return __awaiter(this, void 0, void 0, function* () {
            const authData = yield this.cacheService.get(authId);
            // set new session details on cache
            const { _id: userId, email, firstName, lastName, isSuperAdmin } = user;
            yield this.cacheService.set(authId, {
                userId,
                email,
                firstName,
                lastName,
                userType,
                isSuperAdmin,
                exp: authData === null || authData === void 0 ? void 0 : authData.exp,
                access: [],
                authId,
            }, config_1.config.jwt.ttl);
            yield this.cacheService.set(this.sessionKeyMap(user.id), authId);
        });
    }
    /**
     * Sets a new session and expires existing one
     * @param user {IUser}
     * @param userType {UserType}
     * @param expire {number | null}
     * @returns {Promise<object>}
     */
    setSession(user, userType, expire) {
        return __awaiter(this, void 0, void 0, function* () {
            const authId = `auth-id-${(0, uuid_1.v4)()}`;
            yield this.expireSession(user.id);
            const ex = expire || config_1.config.jwt.ttl;
            const { _id: userId, email, firstName, lastName, isSuperAdmin } = user;
            yield this.cacheService.set(authId, {
                userId,
                email,
                firstName,
                lastName,
                userType,
                isSuperAdmin,
                exp: Date.now() / 1000 + ex,
                access: [],
                authId,
            }, ex);
            yield this.cacheService.set(this.sessionKeyMap(user.id), authId);
            const u = user.toObject();
            const { hash, salt, deviceId, pushToken } = u, rest = __rest(u, ["hash", "salt", "deviceId", "pushToken"]);
            return {
                user: rest,
                token: this.jwtService.generateToken(authId, ex),
            };
        });
    }
    /**
     *
     * @param loginDto
     * @returns {Promise<object>}
     */
    loginAdmin(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.adminModel.findOne({
                email: loginDto.email.toLowerCase(),
            });
            // If user could not be found in email
            if (!user)
                return (0, helpers_1.throwUnauthorizedError)("Invalid email or password");
            // If the input password is invalid
            const validPassword = yield user.validatePassword(loginDto.password);
            if (!validPassword)
                return (0, helpers_1.throwUnauthorizedError)("Invalid email or password");
            // If the account is inactive
            if (!user.isActive)
                return (0, helpers_1.throwUnprocessableEntityError)("Your account is inactive");
            user.lastLogin = new Date();
            yield user.save();
            return yield this.setSession(user, enums_1.UserTypes.ADMIN, null);
        });
    }
    /**
     * Returns a string f length 6
     * @returns {string}
     */
    generateOTP() {
        return crypto_1.webcrypto.getRandomValues(new Uint32Array(1)).toString().slice(0, 6);
    }
    changePassword(auth, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            switch (auth.userType) {
                case enums_1.UserTypes.ADMIN:
                    user = yield this.adminModel
                        .findById(auth.userId)
                        .select(decorators_1.GetUserPasswordDto)
                        .exec();
                    break;
                default:
                    user = yield this.userModel
                        .findById(auth.userId)
                        .select(decorators_1.GetUserPasswordDto)
                        .exec();
            }
            if (!user)
                return (0, helpers_1.throwUnprocessableEntityError)(`Invalid account, please try again`);
            const isValidPassword = yield user.validatePassword(body.oldPassword);
            if (!isValidPassword) {
                (0, helpers_1.throwUnprocessableEntityError)("Invalid password provided");
            }
            yield user.setPassword(body.password);
            yield user.save();
            return { message: "Password changed successfully" };
        });
    }
    seedAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            let exists = yield this.adminModel.exists({}).exec();
            if (!exists) {
                const user = yield this.adminModel.create({
                    email: "philipowolabi79@gmail.com",
                    firstName: "Philip",
                    lastName: "Owolabi",
                    isSuperAdmin: true,
                });
                yield user.setPassword("Pass1234.");
                yield user.save();
            }
            return { message: "Admin seeded successfully" };
        });
    }
    session(usr) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            switch (usr.userType) {
                case enums_1.UserTypes.ADMIN:
                    user = yield this.adminModel
                        .findById(usr.userId)
                        .select(decorators_1.GetUserAltDto)
                        .exec();
                    break;
                default:
                    user = yield this.userModel
                        .findById(usr.userId)
                        .select(decorators_1.GetUserAltDto)
                        .exec();
            }
            if (!user) {
                (0, helpers_1.throwUnauthorizedError)("Invalid account, Please try again");
            }
            return { user };
        });
    }
    getAdmins(query) {
        if (query.id) {
            query.id = new mongoose_1.Types.ObjectId(query.id);
        }
        return this.adminPagination.paginate(Object.assign(Object.assign({}, query), { deletedAt: { $exists: false }, projections: [
                "id",
                "firstName",
                "lastName",
                "email",
                "createdAt",
                "updatedAt",
            ] }), ["id", "firstName", "lastName", "email"]);
    }
    createAdmin(body, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!auth.isSuperAdmin) {
                (0, helpers_1.throwForbiddenError)("You are not allowed to perform this action");
            }
            if (yield this.adminModel.exists({ email: body.email })) {
                (0, helpers_1.throwConflictError)("Admin with email already exists");
            }
            let user = yield this.adminModel.create(body);
            yield user.setPassword(body.password);
            yield user.save();
            return { user, message: "Admin created" };
        });
    }
}
exports.AuthService = AuthService;
