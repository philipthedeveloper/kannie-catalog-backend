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
exports.validateDTO = validateDTO;
const logging_1 = require("@/logging");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const http_status_codes_1 = require("http-status-codes");
function validateDTO(dtoClass) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const dto = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = yield (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const errorObj = {};
            for (let err of errors) {
                errorObj[err.property] = Object.values(err.constraints || [])[0];
            }
            logging_1.logger.error(`${JSON.stringify(errors, undefined, 2)}`);
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                errors: errorObj,
            });
            return;
        }
        next();
    });
}
