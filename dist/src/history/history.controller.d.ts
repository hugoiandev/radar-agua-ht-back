import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly service;
    constructor(service: HistoryService);
    getHistory(period?: '24h' | '7d' | '30d', neighborhoodId?: string): Promise<{
        period: "24h" | "7d" | "30d";
        points: {
            time: string;
            index: number;
            count: number;
        }[];
        trend: "melhora" | "piora" | "estavel";
        totalEvaluations: number;
    }>;
}
