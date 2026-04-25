import { PrismaService } from '../prisma/prisma.service';
export declare class HistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHistory(period: '24h' | '7d' | '30d', neighborhoodId?: string): Promise<{
        period: "24h" | "7d" | "30d";
        points: {
            time: string;
            index: number;
            count: number;
        }[];
        trend: "melhora" | "piora" | "estavel";
        totalEvaluations: number;
    }>;
    private calcTrend;
}
