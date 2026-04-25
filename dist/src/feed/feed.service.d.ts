import { PrismaService } from '../prisma/prisma.service';
export declare class FeedService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(limit: number, offset: number): Promise<{
        avgIndex: number;
        id: string;
        createdAt: Date;
        neighborhood: {
            id: string;
            slug: string;
            name: string;
        };
        odor: number;
        color: number;
        taste: number;
        tags: string[];
        comment: string | null;
    }[]>;
}
