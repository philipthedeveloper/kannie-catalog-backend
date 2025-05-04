"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleRequestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = __importDefault(require("chalk"));
// Utility function to determine method color
const getMethodColor = (method) => {
    const colors = {
        GET: "green",
        POST: "yellow",
        PUT: "cyan",
        DELETE: "red",
    };
    return chalk_1.default[colors[method] || "white"](method);
};
// Utility function to determine status color
const getStatusColor = (status) => {
    const colors = {
        500: "red",
        400: "yellow",
        300: "cyan",
        200: "green",
        0: "white",
    };
    const colorKey = Object.keys(colors)
        .reverse()
        .find((key) => status >= Number(key)) || 0;
    return chalk_1.default[colors[Number(colorKey)]](status);
};
// Log format function (shared logic)
const logFormat = (tokens, req, res, useColors = false) => {
    const method = tokens.method(req, res);
    const status = tokens.status(req, res);
    return [
        `[${tokens["date"](req, res, "web")}]`,
        `${tokens["remote-addr"](req, res)} - ${useColors ? getMethodColor(method) : method}`,
        tokens.url(req, res),
        `HTTP/${tokens["http-version"](req, res)}`,
        useColors ? getStatusColor(Number(status)) : status,
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
    ].join(" ");
};
// Logger for console output (with colors)
const consoleRequestLogger = () => (0, morgan_1.default)((tokens, req, res) => logFormat(tokens, req, res, true), {
    stream: process.stdout,
});
exports.consoleRequestLogger = consoleRequestLogger;
