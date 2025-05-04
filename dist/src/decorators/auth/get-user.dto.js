"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserPasswordDto = exports.GetUserAltDto = exports.GetUserDto = void 0;
/**
 * only returns fields that equates to zero
 */
class GetUserDto {
    constructor() {
        this.gender = 1;
        this.firstName = 1;
        this.lastName = 1;
    }
}
exports.GetUserDto = GetUserDto;
/**
 * ignores the fields that equates to zero
 */
exports.GetUserAltDto = {
    hash: 0,
    salt: 0,
    bvn: 0,
};
/**
 * pick only the fields that equates to one
 */
exports.GetUserPasswordDto = {
    hash: 1,
    salt: 1,
};
