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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const evaluations_service_1 = require("./evaluations.service");
const create_evaluation_dto_1 = require("./create-evaluation.dto");
let EvaluationsController = class EvaluationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.ip ?? '0.0.0.0';
        return this.service.create(dto, ip);
    }
    getCityIndex() {
        return this.service.getCityIndex();
    }
};
exports.EvaluationsController = EvaluationsController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { limit: 1, ttl: 600000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Envia avaliação da qualidade da água (anônimo, 1 por 10min por IP)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_evaluation_dto_1.CreateEvaluationDto, Object]),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('city-index'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna índice geral de qualidade da cidade' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvaluationsController.prototype, "getCityIndex", null);
exports.EvaluationsController = EvaluationsController = __decorate([
    (0, swagger_1.ApiTags)('evaluations'),
    (0, common_1.Controller)('evaluations'),
    __metadata("design:paramtypes", [evaluations_service_1.EvaluationsService])
], EvaluationsController);
//# sourceMappingURL=evaluations.controller.js.map