import { OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class OsmSyncService implements OnApplicationBootstrap {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onApplicationBootstrap(): Promise<void>;
    sync(): Promise<{
        inserted: number;
        skipped: number;
        names: string[];
    }>;
}
