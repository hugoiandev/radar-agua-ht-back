import { Module } from '@nestjs/common';
import { NeighborhoodsController } from './neighborhoods.controller';
import { NeighborhoodsService } from './neighborhoods.service';
import { OsmSyncService } from './osm-sync.service';

@Module({
  controllers: [NeighborhoodsController],
  providers: [NeighborhoodsService, OsmSyncService],
  exports: [NeighborhoodsService],
})
export class NeighborhoodsModule {}
