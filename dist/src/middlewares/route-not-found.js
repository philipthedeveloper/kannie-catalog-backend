"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
const helpers_1 = require("@/helpers");
const routeNotFound = (req, res) => {
    (0, helpers_1.throwNotFoundError)(`${req.url} does not exist`);
};
exports.routeNotFound = routeNotFound;
