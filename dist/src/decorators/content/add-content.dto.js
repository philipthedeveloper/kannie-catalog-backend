"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddContentFileDto = exports.AddContentDto = void 0;
const class_validator_1 = require("class-validator");
const enums_1 = require("@/enums");
class AddContentDto {
}
exports.AddContentDto = AddContentDto;
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.ContentType, { message: "Unsupported content type" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please provide content type" }),
    __metadata("design:type", String)
], AddContentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Please describe what this is about" }),
    __metadata("design:type", String)
], AddContentDto.prototype, "description", void 0);
class AddContentFileDto {
}
exports.AddContentFileDto = AddContentFileDto;
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Please upload your audio or video material" }),
    __metadata("design:type", Object)
], AddContentFileDto.prototype, "mediaFile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AddContentFileDto.prototype, "coverArt", void 0);
