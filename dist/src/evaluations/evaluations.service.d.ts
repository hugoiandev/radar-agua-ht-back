import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './create-evaluation.dto';
export declare class EvaluationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEvaluationDto, ip: string): Promise<{
        neighborhood: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        neighborhoodId: string;
        odor: number;
        color: number;
        taste: number;
        tags: string[];
        comment: string | null;
        ipHash: string;
    }>;
    getCityIndex(): Promise<{
        index: null;
        status: null;
        totalEvaluations: number;
    } | {
        index: number;
        status: import("../neighborhoods/neighborhoods.service").WaterStatus;
        totalEvaluations: number;
    }>;
    private checkAndTriggerAlert;
}
