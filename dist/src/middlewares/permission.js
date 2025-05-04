"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionRequirement = void 0;
const helpers_1 = require("../helpers");
const permissionRequirement = (allowedUserTypes = []) => {
    return (req, res, next) => {
        if (req.authData) {
            if ((allowedUserTypes === null || allowedUserTypes === void 0 ? void 0 : allowedUserTypes.length) &&
                !allowedUserTypes.includes(req.authData.userType))
                (0, helpers_1.throwForbiddenError)("Forbidden");
            return next();
        }
        (0, helpers_1.throwUnauthorizedError)("Unauthorized");
    };
};
exports.permissionRequirement = permissionRequirement;
