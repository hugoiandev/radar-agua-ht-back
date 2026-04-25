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
exports.NeighborhoodsService = void 0;
exports.calcStatus = calcStatus;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function calcStatus(avg) {
    if (avg >= 4)
        return 'boa';
    if (avg >= 2.5)
        return 'atencao';
    return 'critica';
}
let NeighborhoodsService = class NeighborhoodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllWithIndex() {
        const neighborhoods = await this.prisma.neighborhood.findMany({
            include: {
                evaluations: {
                    select: { odor: true, color: true, taste: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                    take: 100,
                },
            },
            orderBy: { name: 'asc' },
        });
        return neighborhoods.map((n) => {
            const evals = n.evaluations;
            if (evals.length === 0) {
                return { id: n.id, name: n.name, slug: n.slug, index: null, status: null, totalEvaluations: 0 };
            }
            const avg = evals.reduce((sum, e) => sum + (e.odor + e.color + e.taste) / 3, 0) / evals.length;
            return {
                id: n.id,
                name: n.name,
                slug: n.slug,
                index: parseFloat(avg.toFixed(2)),
                status: calcStatus(avg),
                totalEvaluations: evals.length,
            };
        });
    }
};
exports.NeighborhoodsService = NeighborhoodsService;
exports.NeighborhoodsService = NeighborhoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NeighborhoodsService);
//# sourceMappingURL=neighborhoods.service.js.map