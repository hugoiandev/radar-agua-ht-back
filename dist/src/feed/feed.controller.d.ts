import { FeedService } from './feed.service';
export declare class FeedController {
    private readonly service;
    constructor(service: FeedService);
    findAll(limit?: string, offset?: string): Promise<{
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
