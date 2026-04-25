import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly service;
    constructor(service: AlertsService);
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
