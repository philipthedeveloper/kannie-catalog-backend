"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegex = exports.urlRegex = exports.emailRegex = void 0;
exports.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.urlRegex = /^(https:\/\/)([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
exports.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/;
