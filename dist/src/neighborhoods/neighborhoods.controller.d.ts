import { NeighborhoodsService } from './neighborhoods.service';
import { OsmSyncService } from './osm-sync.service';
export declare class NeighborhoodsController {
    private readonly service;
    private readonly osmSync;
    constructor(service: NeighborhoodsService, osmSync: OsmSyncService);
    findAll(): Promise<({
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
        status: import("./neighborhoods.service").WaterStatus;
        totalEvaluations: number;
    })[]>;
    sync(): Promise<{
        inserted: number;
        skipped: number;
        names: string[];
    }>;
}
