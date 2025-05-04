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
exports.PaginationService = void 0;
class PaginationService {
    constructor(model) {
        this.model = model;
    }
    /**
     *
     * @param {PaginationOptions}  options
     * @param {string[]}  keys - keys to extract from request query parameter
     */
    paginate(options, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, q, projections, sort, 
            // query,
            populate, } = options;
            const query = Object.assign(Object.assign({}, options.query), PaginationService.extractQuery(options, keys));
            if (q) {
                query["$text"] = { $search: q };
            }
            // console.log(query);
            const p = Number(page) || 1;
            const pp = Number(limit) || 20;
            const result = yield Promise.allSettled([
                this.model.countDocuments(query),
                this.model
                    .find(query, projections)
                    .skip(pp * (p - 1))
                    .limit(pp)
                    .sort(sort)
                    .populate(populate)
                    .lean()
                    .exec(),
            ]);
            let status = "success";
            if (result[0].status == "rejected" || result[1].status == "rejected")
                status = "error";
            const first = result[0].status === "fulfilled"
                ? result[0]
                : { value: 0 };
            const second = result[1].status === "fulfilled"
                ? result[1]
                : { value: [] };
            const total = first.value || 0;
            const pages = Math.ceil(total / pp);
            // console.log(result[1])
            return {
                data: second ? second.value || [] : [],
                meta: {
                    pages,
                    prev: p > 1,
                    next: p < pages && pages > 0,
                    total,
                    page: p,
                    // sort: ,
                    limit: pp,
                },
                status,
            };
        });
    }
}
exports.PaginationService = PaginationService;
/**
 * parse query
 * @param  {string} parameters
 * @return {object}
 */
PaginationService.extractQuery = (parameters, fields = []) => {
    if (parameters == null)
        return null;
    const query = {};
    for (const element in parameters) {
        if (fields.includes(element)) {
            const val = parameters[element];
            query[element] = val;
        }
    }
    return query;
};
exports.default = PaginationService;
