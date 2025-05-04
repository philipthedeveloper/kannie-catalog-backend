"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LoggerLevels = void 0;
const winston_1 = require("winston");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
var LoggerLevels;
(function (LoggerLevels) {
    LoggerLevels["ERROR"] = "error";
    LoggerLevels["WARN"] = "warn";
    LoggerLevels["INFO"] = "info";
    LoggerLevels["HTTP"] = "http";
    LoggerLevels["VERBOSE"] = "verbose";
    LoggerLevels["DEBUG"] = "debug";
    LoggerLevels["SILLY"] = "silly";
})(LoggerLevels || (exports.LoggerLevels = LoggerLevels = {}));
const colorize = winston_1.format.printf(({ level, message, timestamp }) => {
    const color = level === "error"
        ? "red"
        : level === "warn"
            ? "yellow"
            : level === "info"
                ? "green"
                : level === "debug"
                    ? "cyan"
                    : "white";
    return `${timestamp} ${chalk_1.default[color](level)}: ${chalk_1.default[color](message)}`;
});
const plainTextFormat = winston_1.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const env = (process.env.NODE_ENV || "development").trim();
const logFileName = `${env}.combined.log`;
const errorLogFileName = `${env}.error.log`;
exports.logger = (0, winston_1.createLogger)({
    level: "debug",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.simple()),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.timestamp(), colorize),
        }),
        new winston_1.transports.File({
            filename: path_1.default.resolve(process.cwd(), env === "development" ? "src" : "dist/src", "logging", "logs", "errors", errorLogFileName),
            level: "error",
            format: winston_1.format.combine(winston_1.format.timestamp(), plainTextFormat),
        }),
        new winston_1.transports.File({
            filename: path_1.default.resolve(process.cwd(), env === "development" ? "src" : "dist/src", "logging", "logs", "global", logFileName),
            format: winston_1.format.combine(winston_1.format.timestamp(), plainTextFormat),
        }),
    ],
});
