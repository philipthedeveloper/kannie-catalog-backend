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
exports.RedisStore = void 0;
const logging_1 = require("@/logging");
const ioredis_1 = require("ioredis");
class RedisStore {
    constructor(config) {
        this.config = config;
        this._tags = [];
        this.createClient(config);
    }
    createClient(config) {
        logging_1.logger.info(`Connecting to redis at >> ${config.url}`);
        this.client = new ioredis_1.Redis(config.url, Object.assign(Object.assign({}, config), { maxRetriesPerRequest: 5, connectTimeout: 10000 }));
        this.client.on("connect", () => {
            logging_1.logger.info("Connected to Redis");
            this.testConnection();
        });
        this.client.on("error", (err) => {
            logging_1.logger.error(`Failed to connect to Redis: ${err}`);
            this.client.quit();
            process.exit();
        });
        return this;
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.ping();
            logging_1.logger.info(`PING Response: ${response}`);
        });
    }
    getConnection() {
        return this.client;
    }
    getClient() {
        return this.client;
    }
    tags(...tags) {
        this._tags = [...this._tags, ...tags.flat()];
        return this;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.client.get(key);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return data;
            }
        });
    }
    set(key, data, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = JSON.stringify(data);
            // Add keys to tag sets
            for (const tag of this._tags) {
                yield this.client.sadd(`tag:${tag}`, key);
            }
            if (ttl) {
                yield this.client.setex(key, ttl, value);
            }
            else {
                yield this.client.set(key, value);
            }
        });
    }
    delete(...keys) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove keys from tag sets
            for (const tag of this._tags) {
                yield this.client.srem(`tag:${tag}`, ...keys);
            }
            yield this.client.del(keys);
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._tags.length === 0) {
                logging_1.logger.error("Flusing entire database is not allowed");
                throw new Error("Flushing entire database is not allowed");
            }
            const tags = this._tags.map((tag) => `tag:${tag}`);
            const keys = yield this.client.sunion(tags);
            if (keys.length > 0) {
                yield this.client.del([...tags, ...keys]);
            }
        });
    }
    mset(args, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = args.map(([key, value]) => [
                key,
                JSON.stringify(value),
            ]);
            if (!ttl) {
                yield this.client.mset(data);
                return;
            }
            const multi = this.client.multi();
            data.forEach(([key, value]) => {
                multi.setex(key, ttl, value);
            });
            multi.exec();
        });
    }
    mget(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.mget(args).then((values) => {
                return values.map((value) => {
                    let decoded;
                    try {
                        decoded = JSON.parse(value || "");
                    }
                    catch (_a) {
                        /* empty */
                    }
                    finally {
                        return decoded || value;
                    }
                });
            });
        });
    }
    keys(pattern) {
        return this.client.keys(pattern);
    }
    ttl(key) {
        return this.client.ttl(key);
    }
}
exports.RedisStore = RedisStore;
