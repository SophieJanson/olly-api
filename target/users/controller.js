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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const entity_1 = require("./entity");
let UserController = class UserController {
    async signup(data) {
        const { password } = data, rest = __rest(data, ["password"]);
        const entity = entity_1.default.create(rest);
        await entity.setPassword(password);
        const user = await entity.save();
        return user;
    }
    async updateUserInterest(userId, interests, funFact, skills, department, role) {
        const user = await entity_1.default.findOne(userId);
        if (!user)
            throw new routing_controllers_1.NotFoundError("There's no user with the given ID, man! #CYBYWY");
        if (!interests && !funFact && !skills && !department && !role) {
            throw new routing_controllers_1.NotFoundError("Nothing to update here, bro!");
        }
        skills ? user.skills = skills.split(",") : user.skills;
        interests ? user.interests = interests.split(",") : user.interests;
        funFact ? user.funFact = funFact : user.funFact;
        department ? user.department = department : user.department;
        role ? user.role = role : user.role;
        let updatedUser = await user.save();
        return updatedUser;
    }
};
__decorate([
    routing_controllers_1.Post("/users"),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.default]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    routing_controllers_1.Patch("/users/:userid/"),
    routing_controllers_1.HttpCode(200),
    __param(0, routing_controllers_1.Param("userid")),
    __param(1, routing_controllers_1.BodyParam("interests")),
    __param(2, routing_controllers_1.BodyParam("funFact")),
    __param(3, routing_controllers_1.BodyParam("skills")),
    __param(4, routing_controllers_1.BodyParam("department")),
    __param(5, routing_controllers_1.BodyParam("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.default, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserInterest", null);
UserController = __decorate([
    routing_controllers_1.JsonController()
], UserController);
exports.default = UserController;
//# sourceMappingURL=controller.js.map