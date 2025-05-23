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
exports.establishDatabaseConnection = void 0;
const logging_1 = require("@/logging");
const mongoose_1 = require("mongoose");
const config_1 = require("@/config");
const helpers_1 = require("@/helpers");
const establishDatabaseConnection = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.logger.info("Connecting to the database...");
        if (!config_1.config.db.url)
            return (0, helpers_1.throwServerError)("Missing database url");
        yield (0, mongoose_1.connect)(config_1.config.db.url, {});
        logging_1.logger.info("Connected to the database");
        if (callback)
            callback === null || callback === void 0 ? void 0 : callback();
    }
    catch (error) {
        logging_1.logger.error("An error occured during database connection");
        logging_1.logger.error(error.message);
        process.exit(1);
    }
});
exports.establishDatabaseConnection = establishDatabaseConnection;
