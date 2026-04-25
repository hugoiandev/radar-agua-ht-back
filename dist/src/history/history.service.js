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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HistoryService = class HistoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHistory(period, neighborhoodId) {
        const periodMs = {
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
        };
        const since = new Date(Date.now() - periodMs[period]);
        const evaluations = await this.prisma.evaluation.findMany({
            where: {
                createdAt: { gte: since },
                ...(neighborhoodId ? { neighborhoodId } : {}),
            },
            select: { odor: true, color: true, taste: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        const bucketSize = period === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const buckets = new Map();
        for (const e of evaluations) {
            const bucketTime = new Date(Math.floor(e.createdAt.getTime() / bucketSize) * bucketSize);
            const key = bucketTime.toISOString();
            const avg = (e.odor + e.color + e.taste) / 3;
            if (!buckets.has(key)) {
                buckets.set(key, { sum: 0, count: 0, time: bucketTime });
            }
            const bucket = buckets.get(key);
            bucket.sum += avg;
            bucket.count += 1;
        }
        const points = Array.from(buckets.values()).map((b) => ({
            time: b.time.toISOString(),
            index: parseFloat((b.sum / b.count).toFixed(2)),
            count: b.count,
        }));
        const trend = this.calcTrend(points);
        return { period, points, trend, totalEvaluations: evaluations.length };
    }
    calcTrend(points) {
        if (points.length < 2)
            return 'estavel';
        const first = points.slice(0, Math.ceil(points.length / 2));
        const last = points.slice(Math.floor(points.length / 2));
        const avgFirst = first.reduce((s, p) => s + p.index, 0) / first.length;
        const avgLast = last.reduce((s, p) => s + p.index, 0) / last.length;
        if (avgLast - avgFirst > 0.3)
            return 'melhora';
        if (avgFirst - avgLast > 0.3)
            return 'piora';
        return 'estavel';
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HistoryService);
//# sourceMappingURL=history.service.js.map