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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OsmSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsmSyncService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../prisma/prisma.service");
const OSM_RELATION_ID = 298407;
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const QUERY = `
[out:json][timeout:30];
rel(${OSM_RELATION_ID});map_to_area->.city;
(
  node["place"~"suburb|neighbourhood|quarter|village"](area.city);
  way["place"~"suburb|neighbourhood|quarter|village"](area.city);
  relation["place"~"suburb|neighbourhood|quarter|village"](area.city);
);
out tags;
`.trim();
function toSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
let OsmSyncService = OsmSyncService_1 = class OsmSyncService {
    prisma;
    logger = new common_1.Logger(OsmSyncService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onApplicationBootstrap() {
        const count = await this.prisma.neighborhood.count();
        if (count === 0) {
            this.logger.log('Nenhum bairro encontrado — sincronizando com OpenStreetMap...');
            await this.sync();
        }
        else {
            this.logger.log(`${count} bairros já cadastrados. Use POST /neighborhoods/sync para atualizar.`);
        }
    }
    async sync() {
        this.logger.log('Buscando bairros de Hortolândia via Overpass API...');
        const response = await axios_1.default.post(OVERPASS_URL, `data=${encodeURIComponent(QUERY)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'User-Agent': 'radar-agua-hortolandia/1.0 (educational project)',
            },
            timeout: 35000,
        });
        const elements = response.data.elements ?? [];
        const names = [
            ...new Set(elements
                .map((e) => e.tags?.name)
                .filter(Boolean)),
        ].sort((a, b) => a.localeCompare(b, 'pt-BR'));
        this.logger.log(`Encontrados ${names.length} bairros no OSM`);
        let inserted = 0;
        let skipped = 0;
        for (const name of names) {
            const slug = toSlug(name);
            const existing = await this.prisma.neighborhood.findUnique({ where: { slug } });
            if (!existing) {
                await this.prisma.neighborhood.create({ data: { name, slug } });
                inserted++;
            }
            else {
                skipped++;
            }
        }
        this.logger.log(`Sync concluído: ${inserted} inseridos, ${skipped} já existiam`);
        return { inserted, skipped, names };
    }
};
exports.OsmSyncService = OsmSyncService;
exports.OsmSyncService = OsmSyncService = OsmSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OsmSyncService);
//# sourceMappingURL=osm-sync.service.js.map