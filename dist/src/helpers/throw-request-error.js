"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwServerError = exports.throwUnsupportedMediaTypeError = exports.throwForbiddenError = exports.throwUnprocessableEntityError = exports.throwUnauthorizedError = exports.throwNotFoundError = exports.throwMethodNotAllowedError = exports.throwConflictError = exports.throwBadRequestError = void 0;
const errors_1 = require("@/errors");
const http_status_codes_1 = require("http-status-codes");
const throwBadRequestError = (message) => {
    throw (0, errors_1.createBadRequestError)(message);
};
exports.throwBadRequestError = throwBadRequestError;
const throwConflictError = (message) => {
    throw (0, errors_1.createConflictError)(message);
};
exports.throwConflictError = throwConflictError;
const throwMethodNotAllowedError = (message) => {
    throw (0, errors_1.createMethodNotAllowedError)(message);
};
exports.throwMethodNotAllowedError = throwMethodNotAllowedError;
const throwNotFoundError = (message) => {
    throw (0, errors_1.createNotFoundError)(message);
};
exports.throwNotFoundError = throwNotFoundError;
const throwUnauthorizedError = (message) => {
    throw (0, errors_1.createUnauthorizedError)(message);
};
exports.throwUnauthorizedError = throwUnauthorizedError;
const throwUnprocessableEntityError = (message) => {
    throw (0, errors_1.createUnprocessableEntityError)(message);
};
exports.throwUnprocessableEntityError = throwUnprocessableEntityError;
const throwForbiddenError = (message) => {
    throw (0, errors_1.createForbiddenError)(message);
};
exports.throwForbiddenError = throwForbiddenError;
const throwUnsupportedMediaTypeError = (message) => {
    throw (0, errors_1.createUnsupportedMediaType)(message);
};
exports.throwUnsupportedMediaTypeError = throwUnsupportedMediaTypeError;
const throwServerError = (message) => {
    throw new errors_1.CustomError(message || http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
};
exports.throwServerError = throwServerError;
