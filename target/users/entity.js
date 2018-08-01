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
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const entity_1 = require("../weeklyUpdates/entity");
const entity_2 = require("../matches/entity");
const entity_3 = require("../followups/entity");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "department", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "funFact", void 0);
__decorate([
    class_validator_1.IsString(),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "slackId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "interests", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsArray(),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
__decorate([
    typeorm_1.OneToMany(_ => entity_1.default, WeeklyUpdate => WeeklyUpdate.userId),
    __metadata("design:type", Array)
], User.prototype, "weeklyUpdate", void 0);
__decorate([
    typeorm_1.OneToMany(_ => entity_3.default, followUp => followUp.user),
    __metadata("design:type", Array)
], User.prototype, "followUps", void 0);
__decorate([
    typeorm_1.ManyToMany(_ => entity_2.default, match => match.users),
    __metadata("design:type", Array)
], User.prototype, "matches", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.default = User;
//# sourceMappingURL=entity.js.map