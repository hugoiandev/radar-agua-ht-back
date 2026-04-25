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
exports.EvaluationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ip_hash_util_1 = require("../common/ip-hash.util");
const neighborhoods_service_1 = require("../neighborhoods/neighborhoods.service");
const VALID_TAGS = new Set([
    'Cheiro de esgoto',
    'Água turva',
    'Gosto estranho',
    'Cor escura',
    'Sem problemas',
]);
let EvaluationsService = class EvaluationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, ip) {
        const ipHash = (0, ip_hash_util_1.hashIp)(ip);
        if (dto.tags) {
            for (const tag of dto.tags) {
                if (!VALID_TAGS.has(tag))
                    throw new common_1.BadRequestException(`Tag inválida: ${tag}`);
            }
        }
        const neighborhood = await this.prisma.neighborhood.findUnique({
            where: { id: dto.neighborhoodId },
        });
        if (!neighborhood)
            throw new common_1.BadRequestException('Bairro não encontrado');
        const evaluation = await this.prisma.evaluation.create({
            data: {
                neighborhoodId: dto.neighborhoodId,
                odor: dto.odor,
                color: dto.color,
                taste: dto.taste,
                tags: dto.tags ?? [],
                comment: dto.comment,
                ipHash,
            },
            include: { neighborhood: true },
        });
        await this.checkAndTriggerAlert(dto.neighborhoodId);
        return evaluation;
    }
    async getCityIndex() {
        const evals = await this.prisma.evaluation.findMany({
            select: { odor: true, color: true, taste: true },
            orderBy: { createdAt: 'desc' },
            take: 500,
        });
        if (evals.length === 0)
            return { index: null, status: null, totalEvaluations: 0 };
        const avg = evals.reduce((sum, e) => sum + (e.odor + e.color + e.taste) / 3, 0) / evals.length;
        return {
            index: parseFloat(avg.toFixed(2)),
            status: (0, neighborhoods_service_1.calcStatus)(avg),
            totalEvaluations: evals.length,
        };
    }
    async checkAndTriggerAlert(neighborhoodId) {
        const now = new Date();
        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        const [recent, older] = await Promise.all([
            this.prisma.evaluation.findMany({
                where: { neighborhoodId, createdAt: { gte: threeHoursAgo } },
                select: { odor: true, color: true, taste: true },
            }),
            this.prisma.evaluation.findMany({
                where: { neighborhoodId, createdAt: { gte: sixHoursAgo, lt: threeHoursAgo } },
                select: { odor: true, color: true, taste: true },
            }),
        ]);
        if (recent.length < 3 || older.length < 3)
            return;
        const avgRecent = recent.reduce((s, e) => s + (e.odor + e.color + e.taste) / 3, 0) / recent.length;
        const avgOlder = older.reduce((s, e) => s + (e.odor + e.color + e.taste) / 3, 0) / older.length;
        if (avgOlder - avgRecent >= 1.5) {
            const neighborhood = await this.prisma.neighborhood.findUnique({ where: { id: neighborhoodId } });
            await this.prisma.alert.create({
                data: {
                    neighborhoodId,
                    message: `Qualidade da água caiu nas últimas horas no bairro ${neighborhood?.name}`,
                },
            });
        }
    }
};
exports.EvaluationsService = EvaluationsService;
exports.EvaluationsService = EvaluationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvaluationsService);
//# sourceMappingURL=evaluations.service.js.map