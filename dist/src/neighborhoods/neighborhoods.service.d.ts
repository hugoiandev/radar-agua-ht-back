import { PrismaService } from '../prisma/prisma.service';
export type WaterStatus = 'boa' | 'atencao' | 'critica';
export declare function calcStatus(avg: number): WaterStatus;
export declare class NeighborhoodsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllWithIndex(): Promise<({
        id: string;
        name: string;
        slug: string;
        index: null;
        status: null;
        totalEvaluations: number;
    } | {
        id: string;
        name: string;
        slug: string;
        index: number;
        status: WaterStatus;
        totalEvaluations: number;
    })[]>;
}
