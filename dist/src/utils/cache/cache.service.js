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
exports.initRedis = exports.CacheService = void 0;
const config_1 = require("@/config");
const cache_store_1 = require("./cache.store");
class CacheService {
    constructor(config) {
        this.store = new cache_store_1.RedisStore(config);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new CacheService({ url: config_1.config.redis.url });
        }
        return this.instance;
    }
    tags(...tags) {
        this.store.tags(...tags);
        return this;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(key);
        });
    }
    set(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.set(key, value, ttl);
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.delete(key);
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.reset();
        });
    }
    remember(key, callback, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = yield this.get(key);
            if (cached)
                return cached;
            const value = yield callback();
            yield this.set(key, value, ttl);
            return value;
        });
    }
}
exports.CacheService = CacheService;
const initRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    CacheService.getInstance();
});
exports.initRedis = initRedis;
