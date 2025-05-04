"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("@/errors");
const logging_1 = require("@/logging");
// Define a type guard function to check if an object implements CustomErrorInterface
function isCustomError(error) {
    return typeof error === "object" && "statusCode" in error;
    // Replace 'customProperty' with a property or method that uniquely identifies CustomErrorInterface
}
const errorHandler = (err, req, res, next) => {
    var _a;
    console.log(err);
    let errorObject = {};
    if (err instanceof errors_1.CustomError && isCustomError(err)) {
        errorObject.status = err === null || err === void 0 ? void 0 : err.statusCode;
        errorObject.message = err.message;
    }
    if (err && err.name === "ValidationError") {
        errorObject.status = http_status_codes_1.StatusCodes.BAD_REQUEST;
        errorObject.message = err.message;
    }
    if (err && err.code === 11000) {
        let message = Object.keys(err.keyValue).join(", ");
        let newConflictError = (0, errors_1.createConflictError)(`${message} already exist`);
        errorObject.status = newConflictError.statusCode;
        errorObject.message = newConflictError.message;
    }
    if (err &&
        (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")) {
        errorObject.message = /malformed|algorithm/.test(err.message)
            ? "Invalid token"
            : "Session expired";
        errorObject.status = http_status_codes_1.StatusCodes.UNAUTHORIZED;
    }
    if (err && err.name === "CastError") {
        errorObject.message = `${err === null || err === void 0 ? void 0 : err.value} is not a valid ${err === null || err === void 0 ? void 0 : err.kind}`;
        errorObject.status = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err && err.name === "BSONError") {
        errorObject.status = http_status_codes_1.StatusCodes.BAD_REQUEST;
        errorObject.message = (err === null || err === void 0 ? void 0 : err.message) || http_status_codes_1.ReasonPhrases.BAD_REQUEST;
    }
    if (err &&
        (err.type === "entity.parse.failed" || err.name === "SyntaxError")) {
        errorObject.status = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 ? void 0 : err.status);
        errorObject.message = ((_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.includes("JSON"))
            ? "Invalid JSON format in the request body. Please ensure there are no trailing commas."
            : "Syntax Error: Invalid data format.";
    }
    if (err && err.name === "MulterError") {
        errorObject.status = http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY;
        errorObject.message = `${err === null || err === void 0 ? void 0 : err.message} ${err.field}`;
    }
    let status = (errorObject === null || errorObject === void 0 ? void 0 : errorObject.status) || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    logging_1.logger.error((errorObject === null || errorObject === void 0 ? void 0 : errorObject.message) || http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    logging_1.logger.silly(`${JSON.stringify({
        status,
        message: (errorObject === null || errorObject === void 0 ? void 0 : errorObject.message) || http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
        stack: err === null || err === void 0 ? void 0 : err.stack,
    }, undefined, 2)}`);
    return res.status(status).json({
        success: false,
        status,
        message: (errorObject === null || errorObject === void 0 ? void 0 : errorObject.message) || http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
};
exports.errorHandler = errorHandler;
