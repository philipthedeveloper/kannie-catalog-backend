"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTL = void 0;
var TTL;
(function (TTL) {
    TTL[TTL["IN_A_MINUTE"] = 60000] = "IN_A_MINUTE";
    TTL[TTL["IN_5_MINUTES"] = 300000] = "IN_5_MINUTES";
    TTL[TTL["IN_10_MINUTES"] = 600000] = "IN_10_MINUTES";
    TTL[TTL["IN_30_MINUTES"] = 1800000] = "IN_30_MINUTES";
    TTL[TTL["IN_AN_HOUR"] = 3600000] = "IN_AN_HOUR";
    TTL[TTL["IN_2_HOURS"] = 7200000] = "IN_2_HOURS";
    TTL[TTL["IN_3_HOURS"] = 10800000] = "IN_3_HOURS";
})(TTL || (exports.TTL = TTL = {}));
