"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const enums_1 = require("@/enums");
const user_model_1 = require("./user.model");
const mongoose_1 = require("mongoose");
const collectionName = "admins";
const AdminSchema = user_model_1.UserSchema.clone();
AdminSchema.add({
    userType: {
        type: String,
        default: enums_1.UserTypes.ADMIN,
        immutable: true,
        enum: {
            values: Object.values(enums_1.UserTypes),
            message: "Unsupported user type {VALUE}",
        },
    },
});
AdminSchema.clearIndexes();
// AdminSchema.pre<IAdmin>("save", async function (next) {
//   if (!this.isModified("hash")) {
//     return next();
//   }
//   this.salt = await genSalt(10);
//   this.hash = await hash(this.hash, this.salt);
//   next();
// });
exports.Admin = (0, mongoose_1.model)(collectionName, AdminSchema);
