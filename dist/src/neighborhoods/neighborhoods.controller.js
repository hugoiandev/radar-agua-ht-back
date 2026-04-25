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
exports.NeighborhoodsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const neighborhoods_service_1 = require("./neighborhoods.service");
const osm_sync_service_1 = require("./osm-sync.service");
let NeighborhoodsController = class NeighborhoodsController {
    service;
    osmSync;
    constructor(service, osmSync) {
        this.service = service;
        this.osmSync = osmSync;
    }
    findAll() {
        return this.service.findAllWithIndex();
    }
    sync() {
        return this.osmSync.sync();
    }
};
exports.NeighborhoodsController = NeighborhoodsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista bairros de Hortolândia com índice de qualidade' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NeighborhoodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sincroniza bairros com OpenStreetMap (Overpass API)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NeighborhoodsController.prototype, "sync", null);
exports.NeighborhoodsController = NeighborhoodsController = __decorate([
    (0, swagger_1.ApiTags)('neighborhoods'),
    (0, common_1.Controller)('neighborhoods'),
    __metadata("design:paramtypes", [neighborhoods_service_1.NeighborhoodsService,
        osm_sync_service_1.OsmSyncService])
], NeighborhoodsController);
//# sourceMappingURL=neighborhoods.controller.js.map