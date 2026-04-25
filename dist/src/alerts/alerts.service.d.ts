import { PrismaService } from '../prisma/prisma.service';
export declare class AlertsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findActive(): Promise<({
        neighborhood: {
            slug: string;
            name: string;
        };
    } & {
        id: string;
        neighborhoodId: string;
        message: string;
        triggeredAt: Date;
        active: boolean;
    })[]>;
}
