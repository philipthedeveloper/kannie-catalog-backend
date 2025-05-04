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
exports.validateToken = void 0;
const helpers_1 = require("../helpers");
const jwt_service_1 = require("@/services/auth/jwt.service");
const utils_1 = require("@/utils");
// export interface ExtendedRequest extends Request {
//   [key: string]: any;
// }
// This middleware is used to validate the token on incoming request
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtService = new jwt_service_1.JwtService();
    const cacheService = utils_1.CacheService.getInstance();
    const token = jwtService.extractTokenFromHeader(req);
    if (!token)
        return (0, helpers_1.throwUnauthorizedError)("Unauthorized");
    // Verify the token with jwt
    let payload = jwtService.verifyToken(token);
    if (!payload)
        return (0, helpers_1.throwUnauthorizedError)("Malformed Token");
    // Get user authentication data
    const authData = yield cacheService.get(payload.authId);
    if (!authData) {
        return (0, helpers_1.throwUnauthorizedError)("Invalid token");
    }
    req.authData = authData;
    next();
});
exports.validateToken = validateToken;
exports.default = exports.validateToken;
