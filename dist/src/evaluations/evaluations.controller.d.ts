import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './create-evaluation.dto';
import type { Request } from 'express';
export declare class EvaluationsController {
    private readonly service;
    constructor(service: EvaluationsService);
    create(dto: CreateEvaluationDto, req: Request): Promise<{
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
}
