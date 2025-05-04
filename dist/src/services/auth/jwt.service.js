"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const config_1 = require("@/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtService {
    static getInstance() {
        if (!this.instance) {
            this.instance = new JwtService();
        }
        return this.instance;
    }
    extractTokenFromHeader(request) {
        var _a, _b;
        const [type, token] = (_b = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")) !== null && _b !== void 0 ? _b : [];
        return type === "Bearer" ? token : undefined;
    }
    generateToken(authId, expires) {
        return jsonwebtoken_1.default.sign({ authId }, config_1.config.jwt.privateKey, {
            expiresIn: expires || config_1.config.jwt.expiresIn,
            issuer: config_1.config.jwt.issuer,
            algorithm: "RS256",
        });
    }
    verifyToken(token) {
        const jwtToken = jsonwebtoken_1.default.verify(token, config_1.config.jwt.publicKey, {
            complete: true,
            issuer: config_1.config.jwt.issuer,
        });
        return jwtToken.payload;
    }
}
exports.JwtService = JwtService;
